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
  console.log("STARTING VISUALIZING");
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

  let timeout;

  try {
    timeout = setTimeout(() => {
      throw new Error('Function timed out.');
    }, 300000); // Increase the timeout to 5 minutes (300000 milliseconds)

    if (!admin.apps.length) {
      const serviceAccount = await getFirebaseKey();
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    console.log("IN TRY");
    var student_grade;
    const senderNumber = event.sender_contact;
    const db = admin.firestore();
    const studentRef = db.collection('student');

    try {
      console.log("SNAPSHOT");
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

        const docRef = studentRef.doc(docId);
        await docRef.update({
          "helpRequestCount.visualHelp": `${(parseInt(visualHelpCount) + 1).toString()}`,
          "helpRequestCount.logicalHelp": `${logicalHelpCount}`
        });
        console.log("Document updated successfully.");
      }
    } catch (error) {
      console.error("Error getting or updating documents: ", error);
    }

    const twiml = new Twilio.twiml.MessagingResponse();
    const inbMsg = event.sender_query.toLowerCase().trim();

    try {
      console.log("IN DALLE 3");
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: inbMsg,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      });

      console.log(response.data[0].url);
      clearTimeout(timeout);
      callback(null, { mediaUrl: response.data[0].url });

      console.log("ENDING VISUALIZE");
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      twiml.message("Sorry, an error occurred while generating the image. Please try again later.");
      clearTimeout(timeout);
      callback(null, twiml);
    }
  } catch (error) {
    clearTimeout(timeout);
    console.log(error);
    callback(error);
  }
};