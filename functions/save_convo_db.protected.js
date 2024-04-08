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
  console.log("STARTING SAVE CONVO TO DB")
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

    const chatSessionId = event.chatSessionId;
    const message = event.message;
    const sender = event.sender;
    const receiver = event.receiver;
    const chat = {
      message : `${message}`,
      sender: `${sender}`,
      receiver: `${receiver}`
      }
    
    const chatColRef = admin.firestore().collection('whatsappChats');
    // Open chatSessionId document in chatColRef
    const chatDocRef = chatColRef.doc(chatSessionId);

    // Get the document snapshot
    const chatDocSnapshot = await chatDocRef.get();

    if (chatDocSnapshot.exists) {
      // Get the length of objects in chatSessionId.chats
      const chatData = chatDocSnapshot.data();
      const chatLength = Object.keys(chatData.chats).length;

      // Add chat object with id chatSessionId.chats.size + 1 to chats object
      await chatDocRef.update({
        [`chats.${chatLength + 1}`]: chat
      });
    } 
    console.log("END SAVE CONVERSATION TO DB")
    clearTimeout(timeout); // clear the timeout
    callback(null, "success"); // return a success response
  } catch (error) {
    clearTimeout(timeout); // clear the timeout
    console.log(error);
    callback(error); // return an error response
  }
};
