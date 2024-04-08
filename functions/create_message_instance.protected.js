const axios = require('axios');
const admin = require('firebase-admin');
const { getFirestore, collection, getDocs, setDoc, doc } = require('firebase-admin/firestore');


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
  console.log("create message instance")
  const timeout = setTimeout(() => {
    callback(new Error('Function timed out.'));
  }, 200000); // set the timeout to 4 seconds

  try {
    if (!admin.apps.length) {
      const serviceAccount = await getFirebaseKey();
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    const functionResponseData = {
     chatSessionId: '',
    };

    const now = new Date();
    const isoTimestamp = now.toISOString();
    const timestampDate = new Date(isoTimestamp);
    const options = {timeZone: 'Asia/Kolkata', hour12: false};
    const date = timestampDate.toLocaleDateString("en-IN", {day: "numeric", month: "numeric", year: "2-digit", timeZone: 'Asia/Kolkata'});
    const time = timestampDate.toLocaleTimeString("en-IN", options);
    const student_contact= event.sender_number;
    const message1 = event.message1;
    const message2 = event.message2;
    const message3 = event.message3;
    const message4 = event.message4;
    
    const chatRef = admin.firestore().collection('whatsappChats');
    const getChatSize = await chatRef.get();
    let chatListSize = getChatSize.size + 1;
    functionResponseData.chatSessionId=`chatSession${chatListSize}`;
    await admin.firestore().collection('whatsappChats').doc(`chatSession${chatListSize}`).set({

      chats: {
        1: {
          message : `${message1}`,
          sender: `student`,
          receiver: `chatbot`
        },
        2: {
          message : `${message2}`,
          sender: `chatbot`,
          receiver: `student`
        },
        3: {
          message : `${message3}`,
          sender: `chatbot`,
          receiver: `student`
        },
        4: {
          message : `${message4}`,
          sender: `chatbot`,
          receiver: `student`
        },
      },

      student_contact: student_contact,
      timeStamp:{
        start: {
          date: `${date}`,
          time: `${time}`
        },
        end: {
          date: ``,
          time: ``
        },
      }
    })
    .catch((error) => {
      console.error("Error creating document: ", error);
    });
    
      
    console.log("END CREATE MESSAGE INSTANCE TO DB")
    clearTimeout(timeout); // clear the timeout
    callback(null, functionResponseData); // return a success response
  } catch (error) {
    clearTimeout(timeout); // clear the timeout
    console.log(error);
    callback(error); // return an error response
  }
};
