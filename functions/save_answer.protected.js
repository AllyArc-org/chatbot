const axios = require('axios');
const admin = require('firebase-admin');

async function getFirebaseKey() {
  try {
    const response = await axios.get('https://allyarc-9130.twil.io/firebase');
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
exports.handler = async (context, event, callback) => {
  console.log("STARTING SAVE ANSWER TO DB")
  const timeout = setTimeout(() => {
    callback(new Error('Function timed out.'));
  }, 20000); // set the timeout to 4 seconds

  try {
    if (!admin.apps.length) {
      const serviceAccount = await getFirebaseKey();
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // you can also specify a unique name for the app here if you want
      });
    }
 
    const student_grade= event.grade;
    const student_contact= event.contact;
    const student_name=event.student_name;

    const question_id= event.id;
    const question_description= event.description;
    const question= event.question;
    const question_score= event.score;
    const question_topic= event.topic;
    const question_model_answer= event.model_answer;

    
    const student_score= event.student_score;
    const student_answer= event.student_answer;
    const student_time_score= JSON.parse(event.time_score);
    const student_creativity_score= JSON.parse(event.creativity_score);

    //answer object
    console.log(`student_contact: ${student_contact}`);
    const newAnswer = {
      student: {
        contact: `${student_contact}`,
        grade: `${student_grade}`,
        name: `${student_name}`,
      },
      question : {
        count: `${question_id}`,
        description: `${question_description}`,
        modelAnswer: `${question_model_answer}`,
        question:`${question}`,
        score: `${question_score}`,
        topic: `${question_topic}`
      },
      score: `${parseFloat(student_score)}`,
      answer: `${student_answer}`,
      skillEvaluate: {
        creativity: `${student_creativity_score.creativitySkill}`,
        time:`${student_time_score.timeScore}`,
      },
      timeline:{
        start: {
          date: `${student_time_score.start.date}`,
          time: `${student_time_score.start.time}`
        },
        end: {
          date: `${student_time_score.end.date}`,
          time: `${student_time_score.end.time}`
        },
      }
    }
    console.log("newAnswer")
    console.log(JSON.stringify(newAnswer))
    console.log(newAnswer)

    const db = admin.firestore();
    //update student skill score
    const studentRef = db.collection('student');
    await studentRef.where("contact", "==", student_contact).get()
      .then((querySnapshot) => {
        if (querySnapshot.size == 0) {
          console.log("No documents found with the specified field value.");
        } else {
          // Get the first matching document
          const docSnapshot = querySnapshot.docs[0];
      
          // Get the document data as a JavaScript object
          const docData = docSnapshot.data();
      
          // Get the document ID
          const docId = docSnapshot.id;
          var timeSkill= docData.skill.time
          var creativitySkill= docData.skill.creativity
          const docRef = studentRef.doc(docId);
          docRef.update(
          {
          "skill.time": `${parseFloat(timeSkill)+parseFloat(student_time_score.timeScore)}`,
            "skill.creativity": `${parseFloat(creativitySkill)+parseFloat(student_creativity_score.creativitySkill)}`,
          }).then(() => {
          console.log("Document updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
            });
        }
      })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
    
    // add answer to db
    const answerRef = db.collection('answer')
    await db.collection('answer').get()
      .then((querySnapshot) => {
        const answerListSize = querySnapshot.size + 1;
        answerRef.doc( `${answerListSize}`).set(newAnswer)
          .then(() => {
            console.log('New answer added to Firestore');
          })
        .catch((error) => {
          console.error('Error adding answer to Firestore:', error);
        });
      })
    .catch((error) => {
      console.error('Error getting collection size:', error);
    });
      
    console.log("END SAVE ANSWER TO DB")
    clearTimeout(timeout); // clear the timeout
    callback(null, "success"); // return a success response
  } catch (error) {
    clearTimeout(timeout); // clear the timeout
    console.log(error);
    callback(error); // return an error response
  }
};