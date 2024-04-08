
// This is your new function. To start, set the name and path on the left.
const cohere = require('cohere-ai');
exports.handler = async(context, event, callback) => {
  console.log("STARTING INDENTIFY REQUEST")
  const aiResponse=""
    try{
    console.log("in classify if input is food or activity")
    cohere.init(process.env.OPENAI_API_KEY); // This is your trial API key
      const response = await cohere.classify({
        model: 'daa7b459-13cb-4fa7-b588-c4dccd00dab7-ft',
        inputs: [`${event.Body}`]
      });
      console.log(`The confidence levels of the labels are ${JSON.stringify(response.body.classifications)}`);
      console.log(`Classify response is: ${JSON.stringify(response.body.classifications[0].prediction)}`);
      type=`${JSON.stringify(response.body.classifications[0].prediction)}`;
      //get calorie count
      console.log(`TYPE IS: ${type}`);
      if (type=='"visualize"'){
        console.log("TYPE IS INDEED visualize");
        aiResponse+=`This is a visualize request`;
      }else if (type=='"breakdown"'){
        console.log("TYPE IS INDEED breakdown");
        aiResponse+=`This is a breakdown request`;
      }else{
        console.log("TYPE IS INDEED question");
        aiResponse+=`This is a question request`;
      }
  } catch (error) {
    console.error(`ERROR IN classifyType: ${error}`);
  }
  const twilioClient = context.getTwilioClient();
  const from = event.From || 'whatsapp:+14155238886';
  const to = event.To || 'whatsapp:+94769094725';
  const body = event.Body || `${aiResponse}`;
  twilioClient.messages
    .create({ body, to, from})
    .then((message) => {
      console.log('SMS successfully sent');
      console.log(message.sid);
      return callback(null, `Success! Message SID: ${message.sid}`);
    })
    .catch((error) => {
      console.error(error);
      return callback(error);
    });
};
