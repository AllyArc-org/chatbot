const axios = require('axios');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getFirebaseKey() {
  try {
    const response = await axios.get('https://allyarc-9130.twil.io/firebase');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.handler = async (context, event, callback) => {
  console.log("STARTING BREAKDOWN");
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

  const timeout = setTimeout(() => {
    callback(new Error('Function timed out.'));
  }, 20000); // set the timeout to 20 seconds

  try {
    if (!admin.apps.length) {
      const serviceAccount = await getFirebaseKey();
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    var student_grade;
    var student_name;
    const senderNumber = event.sender_contact;
    const db = admin.firestore();
    const studentRef = db.collection('student');
    const feedbackRef = db.collection('feedback');

    try {
      const querySnapshot = await studentRef.where("contact", "==", senderNumber).get();
      if (querySnapshot.size == 0) {
        console.log("No documents found with the specified field value.");
      } else {
        // Get the first matching document
        const docSnapshot = querySnapshot.docs[0];

        // Get the document data as a JavaScript object
        const docData = docSnapshot.data();

        // Get the document ID
        const docId = docSnapshot.id;
        var visualHelpCount = docData.helpRequestCount.visualHelp;
        var logicalHelpCount = docData.helpRequestCount.logicalHelp;
        student_grade = docData.grade;
        student_name = docData.name;

        const docRef = studentRef.doc(docId);
        await docRef.update({
          "helpRequestCount.visualHelp": `${visualHelpCount}`,
          "helpRequestCount.logicalHelp": `${(parseInt(logicalHelpCount) + 1).toString()}`
        });
        console.log("Document updated successfully.");
      }
    } catch (error) {
      console.error("Error getting or updating documents: ", error);
    }

    var feedbackRemarks = "";

    try {
      const feedbackQuerySnapshot = await feedbackRef.where("contact", "==", senderNumber).get();
      if (feedbackQuerySnapshot.size > 0) {
        console.log("Feedbacks found for the sender number.");
        feedbackRemarks = "Please consider the following remarks from the teacher regarding " + student_name + ", a " + student_grade + " grade student you are assisting. Incorporate these points into your interactions and support for " + student_name + ":\n";
        feedbackQuerySnapshot.forEach((doc) => {
          console.log("Feedback document:", doc.id);
          const feedbackData = doc.data();
          feedbackRemarks += "- " + feedbackData.feedback + "\n";
        });
      } else {
        console.log("No feedbacks found for the sender number.");
      }
    } catch (error) {
      console.error("Error getting feedback documents: ", error);
    }

    const twiml = new Twilio.twiml.MessagingResponse();
    const inbMsg = event.sender_query.toLowerCase().trim();

    try {
      const systemContent = feedbackRemarks ?  `
     You are AllyArc, an educational chatbot designed to make learning engaging and fun for autistic students. Simplify complex concepts using relatable examples, create an interactive learning environment, and adapt explanations to each student's interests. Use clear language, engage students with examples from their daily lives and favorite subjects, and quickly adapt to their feedback. Transform learning into an enjoyable adventure that inspires curiosity and a love for learning in a supportive way.`+ "\n\n"  + feedbackRemarks + "\n\n" : `You are AllyArc, an educational chatbot designed to make learning engaging and fun for autistic students. Simplify complex concepts using relatable examples, create an interactive learning environment, and adapt explanations to each student's interests. Use clear language, engage students with examples from their daily lives and favorite subjects, and quickly adapt to their feedback. Transform learning into an enjoyable adventure that inspires curiosity and a love for learning in a supportive way.`;
     console.log(systemContent);

      const completion = await  openai.chat.completions.create({
        model: "ft:gpt-3.5-turbo-0125:personal:allyarc:99L5WQ0P",
        messages: [
          {
            role: "system",
            content: systemContent
          },
          { role: "user", content: `${inbMsg}` },
        ],
      });

      console.log(completion.choices[0].message.content);
      twiml.message(completion.choices[0].message.content);

      console.log("ENDING BREAKDOWN");
      clearTimeout(timeout);
      callback(null, twiml);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      throw error;
    }
  } catch (error) {
    clearTimeout(timeout);
    console.log(error);
    callback(error);
  }
};
