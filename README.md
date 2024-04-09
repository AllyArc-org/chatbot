## Introduction  🌟

AllyArc Chatbot is a sophisticated tool designed to automate educational interactions, offering seamless messaging experiences via WhatsApp. Developed with Twilio Studio's flows and serverless functions, it supports educators by providing breakdown assistance, generating educational content, and facilitating a dynamic, responsive chat experience for Special Educational Needs (SEN) education. It uniquely incorporates a fine-tuned model to specifically handle breakdown requests, enhancing its capability to provide detailed and understandable explanations.

## Features 🌈

- **Automated Messaging Flows:** Utilizes structured flows for guiding diverse user interactions, ensuring an engaging and responsive chat experience.
- **Serverless Architecture:** Employs Twilio's serverless functions for flexible, scalable response handling and operational efficiency.
- **Comprehensive Integration:** Seamlessly integrates Twilio Studio flows with serverless functions for robust functionality, further enhanced by Firebase for data storage, OpenAI for content generation, and other APIs for creativity assessment and feedback provision.
- **Educational Support:** Offers tailored support through assignment guidance, conceptual explanations, and visual aids to enrich the learning process.
- **Feedback and Grading:** Enables real-time feedback and grading, facilitating immediate learning progress assessments.
- **Fine-Tuned Model for Breakdown Requests:** Utilizes a fine-tuned AI model to specifically address and elaborate on breakdown requests, ensuring detailed and tailored educational assistance.

## Bricks and pieces 🧱

### Deployment 🚀
This chatbot is deployed using Twilio Serverless. The code is written in Node.js and the necessary dependencies are listed in the package.json file.

### Twilio Studio  🎨
Twilio Studio is used to design the chatbot flow. The flow consists of several widgets such as the webhook widget, function widget, and message widget. The webhook widget triggers the function that handles the incoming message. The function retrieves the student's response from the database and evaluates it using the various APIs. Finally, the message widget sends the feedback to the student.

### Firebase Admin SDK 🔥
The Firebase Admin SDK is used to read and write data to the database. The chatbot retrieves the student's response from the database and stores the feedback in the database.

### APIs 🌐
The chatbot uses several APIs to evaluate the student's response:

- OpenAI GPT-3 text-davinci-003 model and DALL-E API for generating feedback and creative response generation.
- Sentino API to calculate creativity levels and tone analysis.
- Twinword-Text-Similarity API to calculate text similarity and assign marks based on student answer and model answer.


## Flows Overview 🔄

The chatbot incorporates four distinct flows to manage various types of user interactions. Each flow is represented by a Twilio Studio JSON flow and is linked to specific serverless functions that facilitate the chatbot's operations.

### Flow 1: AllyArc Main Communication

Serves as the main communication channel between the chatbot and students, handling general inquiries, providing information, and directing to specific assistance or resources as needed.

- **General Inquiries Handling:** Answers common questions and provides information on various topics.
- **Resource Direction:** Directs students to additional resources, such as instructional materials or external links, for further learning.
- **Feedback and Suggestions:** Collects feedback and suggestions from students to improve the chatbot's performance and resource offerings.
<img src="https://github.com/AllyArc-org/chatbot/blob/main/images/allyarc-main.png" width="900" height="450">

### Flow 2: AllyArc Assignment Interaction

This flow focuses on assigning tasks or questions to students, tracking their responses, and grading their answers. It begins with triggering the flow through an incoming message, setting default variables, sending the assignment question, collecting the student's response, and evaluating the response against the model answer.

- **Trigger and Variables:** Sets up the flow trigger and initializes variables for the assignment.
- **Assignment Distribution and Collection:** Sends the assignment question and waits for the student's response.
- **Grading:** Calculates the student's score based on the model answer and the response provided.
<img src="https://github.com/AllyArc-org/chatbot/blob/main/images/allyarc-assignment.png" width="900" height="450">

### Flow 3: AllyArc Breakdown Assistance

Designed to offer step-by-step breakdown assistance for questions or tasks assigned to students. It helps in guiding the student through the solution process, improving their understanding and problem-solving skills.

- **Initial Request Handling:** Identifies the need for breakdown assistance and initiates the assistance flow.
- **Breakdown Process:** Provides a detailed breakdown of the solution steps, asking for student's input or confirmation at each step.
- **Feedback Collection:** Gathers student feedback on the assistance provided for continuous improvement of the breakdown process.
<img src="https://github.com/AllyArc-org/chatbot/blob/main/images/allyarc-breakdown.png" width="900" height="450">

### Flow 4: AllyArc Visualization

Aids in visual learning by generating and presenting visual content based on the student's requests or the curriculum's needs. This could include diagrams, charts, or other educational visuals.

- **Visualization Request Handling:** Processes requests for visual content and identifies the type of visualization needed.
- **Visual Content Generation:** Generates the requested visual content using serverless functions and external APIs as needed.
- **Presentation:** Presents the generated visual content to the student, offering further explanations or answering questions about the visualized information.
<img src="https://github.com/AllyArc-org/chatbot/blob/main/images/allyarc-visualize.png" width="900" height="450">

## Serverless Functions Overview 🔧

The chatbot utilizes a variety of serverless functions to handle complex logic, integrate with external APIs, manage database interactions, and perform natural language processing. Below is a detailed overview of each serverless function and its purpose within the chatbot ecosystem.

### 1. `timestamp.protected.js`

- **Purpose:** Generates a timestamp in ISO format and converts it to a localized format for Asia/Kolkata timezone. This function is used to timestamp user interactions or events.
- **Key Operations:** Captures the current date and time, formats it to the specified timezone, and returns both the ISO string and localized date and time.

### 2. `set_score.protected.js`

- **Purpose:** Calculates a similarity score between a student's answer and a model answer using external similarity APIs. It adjusts the student's score based on this similarity.
- **Key Operations:** Sends requests to an external API to get a similarity score, calculates the student's score based on predefined thresholds, and returns the calculated score.

### 3. `identify_request.protected.js`

- **Purpose:** Identifies the type of user request (e.g., visualize, breakdown, question) using natural language classification provided by external services.
- **Key Operations:** Processes the incoming message, classifies it into one of the predefined categories, and triggers the appropriate response or flow based on the classification.

### 4. `save_convo_db.protected.js`

- **Purpose:** Saves conversation snippets to a Firestore database for record-keeping, analytics, and further processing.
- **Key Operations:** Connects to Firestore, creates or updates conversation records, and stores the details of each message exchanged between the chatbot and the user.

### 5. `time_management.protected.js`

- **Purpose:** Evaluates the student's time management skills based on the duration taken to respond to questions or assignments.
- **Key Operations:** Calculates the time difference between the question being sent and the answer received, evaluates time management skills, and returns a score reflecting the student's efficiency.

### 6. `verify_student.protected.js`

- **Purpose:** Verifies the identity of the student interacting with the chatbot by checking against records in a Firestore database.
- **Key Operations:** Searches the Firestore database for a student record matching the sender's contact number, and retrieves relevant details for personalized interactions.

### 7. `creativity.protected.js`

- **Purpose:** Assesses the creativity aspect of the student's response using external APIs that analyze text for creative elements.
- **Key Operations:** Sends the student's answer to an external API for creativity analysis, receives scores for various creativity components, and calculates a cumulative creativity score.

### 8. `create_message_instance.protected.js`

- **Purpose:** Initiates a new conversation instance in the Firestore database, marking the start of a new interaction session with a student.
- **Key Operations:** Generates a new conversation record in Firestore with initial details such as timestamps and initial messages, setting up the framework for a structured conversation flow.

### 9. `save_answer.protected.js`

- **Purpose:** Stores the student's responses to assignments or questions in Firestore for grading, feedback, and future reference.
- **Key Operations:** Collects the student's answer along with associated details (e.g., question id, score), and updates the Firestore database with the new answer record.

### 10. `breakdown.protected.js`

- **Purpose:** Provides a detailed breakdown of complex concepts or assignments to students, utilizing OpenAI's services for generating understandable explanations.
- **Key Operations:** Receives a concept or question from the student, processes it through OpenAI's API to generate a detailed explanation or breakdown, and returns this information to the student.

### 11. `visualize.protected.js`

- **Purpose:** Facilitates the creation of visual content based on user queries, utilizing OpenAI's DALL·E to generate images corresponding to the textual descriptions provided by users.
- **Key Operations:** Processes user queries to generate visual prompts, utilizes the DALL·E model from OpenAI to create images based on these prompts, and returns the generated image URLs for presentation to the user.

## Prerequisites 📋

- A Twilio account (create one for free [here](https://www.twilio.com/try-twilio))
- A Twilio WhatsApp Sandbox ([set one up here](https://www.twilio.com/docs/whatsapp/sandbox))
- Node.js and npm installed
- The Twilio CLI ([installation instructions here](https://www.twilio.com/docs/twilio-cli/quickstart))

## How to Deploy 🛠️
To deploy this chatbot, you will need to follow these steps:

1. Clone the repository
2. Set up a Twilio account and WhatsApp Sandbox
3. Set up a Firebase account and create a new Firebase project
4. Obtain API keys for the OpenAI GPT-3.5, DALLE, Sentino, and Twinword-Text-Similarity APIs from Rapid API
5. Set up environment variables for all API keys and Firebase credentials
6. Deploy the Twilio Studio flow and Twilio Serverless functions using the Twilio CLI
7. Test the chatbot using the WhatsApp Sandbox phone number


## Setting up Environment Variables 💻
First, set up environment variables for all API keys and Firebase credentials. 

For that copy the `.env.example` file to `.env`:
```
cp .env.example .env
```
and add your respective credentials for each of the below enviroment variables

```
OPENAI_API_KEY=<your_openai_api_key>
RAPID_API_KEY=<your_rapid_api_key>
ACCOUNT_SID=<your_twilio_account_sid>
AUTH_TOKEN=<your_twilio_auth_token>
```

## Deploying the Twilio Studio Flow 🛫
Next, deploy the Twilio Studio flow by following these steps:

1. Go to Twilio Studio and create a new flow.
2. Import the `xxx-studio-flow.json` file from this repository, for each of the flow required
3. Update the `get_api_key` function in the `get_api_key.js` file to retrieve the correct API key based on the API name.
4. Save and publish the Studio flow.


## Deploying the Twilio Serverless Functions ⚙️
Finally, deploy the Twilio Serverless functions by following these steps:

1. Install the Twilio CLI by following the instructions [here](https://www.twilio.com/docs/twilio-cli/quickstart).
2. Install the Firebase CLI by running `npm install -g firebase-tools`
3. Initialize the Firebase project by running `firebase login` and `firebase init`.
4. Deploy the Serverless functions by running `twilio serverless:deploy`.
5. Set up the `chatbot` and `firebase` environment variables for the deployed Serverless functions by running 

```
twilio serverless:environment:update --service <your_service_name> --environment <your_environment_name> --variables chatbot={...},firebase={...}
```

With these steps completed, your Twilio WhatsApp chatbot should be up and running!

## Resources 📚

- [Twilio Serverless Quickstart](https://www.twilio.com/docs/serverless/quickstart)
- [Twilio Studio Documentation](https://www.twilio.com/docs/studio)
- [Twilio WhatsApp Sandbox Documentation](https://www.twilio.com/docs/whatsapp/sandbox)
- [Twilio CLI Quickstart](https://www.twilio.com/docs/twilio-cli/quickstart)

## Disclaimer ⚠️
This chatbot is designed as a tool to assist teachers in SEN education and should not be used as the sole method for evaluating student progress. The chatbot's responses and feedback should be reviewed by a teacher to ensure accuracy and appropriateness for the student's skill level.


## Contributions

Contributions to enhance the chatbot's functionality or add new features are highly welcome. Fork the repository, commit your changes, and submit a pull request for review.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
