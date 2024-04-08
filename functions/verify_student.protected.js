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
let response='';
exports.handler = async (context, event, callback) => {
    console.log("STARTING VERIFY STUDENT")
    const functionResponseData = {
    messageToSend: '',
    foundUser: false,
    studentDetails: []
  };
  const timeout = setTimeout(() => {
    callback(new Error('Function timed out.'));
  }, 4000); // set the timeout to 4 seconds

  try {
    if (!admin.apps.length) {
      const serviceAccount = await getFirebaseKey();
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // you can also specify a unique name for the app here if you want
      });
    }
    const db = admin.firestore();
    const studentRef = db.collection('student');
    let studentList=[]
    const studentsnapshot = await studentRef.get();
    studentsnapshot.forEach(doc => {
      studentList.push(doc.data());
    });
    const senderNumber = event.sender_number;
    var userId = '0'+senderNumber.split("whatsapp:+94")[1];
    for(var i=0; i<studentList.length; i++){
      if(userId==studentList[i].contact){
        response=`Welcome back ${studentList[i].name}  🤗 !!`
        foundUser=true
        var studentName={name:studentList[i].name};
        functionResponseData.studentDetails[0] = studentName;
        var studentGrade={grade:studentList[i].grade};
        functionResponseData.studentDetails[1] = studentGrade;
        var studentContact={contact:studentList[i].contact};
        functionResponseData.studentDetails[2] = studentContact;
        var skill ={
          skill: {
            creativity: studentList[i].skill.creativity, 
            logical: studentList[i].skill.logical, 
            time: studentList[i].skill.time, 
            visual: studentList[i].skill.visual, 
          }
        };
        functionResponseData.studentDetails[3] = skill;  
        functionResponseData.foundUser=true
        break;
      }
    }
  functionResponseData.messageToSend=response
  console.log("ENDING VERIFY STUDENT")
  clearTimeout(timeout); // clear the timeout
  callback(null, functionResponseData); // return a success response
  
  } catch (error) {
    clearTimeout(timeout); // clear the timeout
    console.log(error);
    callback(error); // return an error response
  }
};