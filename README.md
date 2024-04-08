# Chatbot Project

## Introduction

This project introduces a sophisticated WhatsApp chatbot developed using Twilio Studio's flows alongside Twilio service serverless functions. Aimed at automating interactions and offering a seamless messaging experience, this chatbot is designed to facilitate educational activities, provide breakdown assistance, and generate visual content to support learning.

## Features

- **Automated Messaging Flows:** Harnesses four main flows for guiding users through diverse interactions, ensuring a dynamic and responsive chat experience.
- **Serverless Architecture:** Utilizes Twilio service serverless functions for dynamic response handling, offering scalability and flexibility in operations.
- **Seamless Integration:** Employs a combination of Twilio Studio flows and serverless functions, ensuring robust chatbot functionality on WhatsApp.
- **Educational Support:** Offers personalized educational support, including assignment assistance, conceptual breakdowns, and visual learning aids.
- **Real-time Feedback and Grading:** Allows for real-time feedback and grading of assignments to facilitate learning and comprehension.

## Flows

The chatbot incorporates four distinct flows to manage various types of user interactions. Each flow is represented by a Twilio Studio JSON flow and is linked to specific serverless functions that facilitate the chatbot's operations.

### Flow 1: AllyArc Assignment Interaction

This flow focuses on assigning tasks or questions to students, tracking their responses, and grading their answers. It begins with triggering the flow through an incoming message, setting default variables, sending the assignment question, collecting the student's response, and evaluating the response against the model answer.

- **Trigger and Variables:** Sets up the flow trigger and initializes variables for the assignment.
- **Assignment Distribution and Collection:** Sends the assignment question and waits for the student's response.
- **Grading:** Calculates the student's score based on the model answer and the response provided.

### Flow 2: AllyArc Breakdown Assistance

Designed to offer step-by-step breakdown assistance for questions or tasks assigned to students. It helps in guiding the student through the solution process, improving their understanding and problem-solving skills.

- **Initial Request Handling:** Identifies the need for breakdown assistance and initiates the assistance flow.
- **Breakdown Process:** Provides a detailed breakdown of the solution steps, asking for student's input or confirmation at each step.
- **Feedback Collection:** Gathers student feedback on the assistance provided for continuous improvement of the breakdown process.

### Flow 3: AllyArc Main Communication

Serves as the main communication channel between the chatbot and students, handling general inquiries, providing information, and directing to specific assistance or resources as needed.

- **General Inquiries Handling:** Answers common questions and provides information on various topics.
- **Resource Direction:** Directs students to additional resources, such as instructional materials or external links, for further learning.
- **Feedback and Suggestions:** Collects feedback and suggestions from students to improve the chatbot's performance and resource offerings.

### Flow 4: AllyArc Visualization

Aids in visual learning by generating and presenting visual content based on the student's requests or the curriculum's needs. This could include diagrams, charts, or other educational visuals.

- **Visualization Request Handling:** Processes requests for visual content and identifies the type of visualization needed.
- **Visual Content Generation:** Generates the requested visual content using serverless functions and external APIs as needed.
- **Presentation:** Presents the generated visual content to the student, offering further explanations or answering questions about the visualized information.

# Serverless Functions Overview

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


## Getting Started

To deploy and use this chatbot for your WhatsApp messaging, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to each flow file under the `flows` directory and review the JSON to understand the flow structure.
3. Review the serverless functions under the `function` directory to understand how they process incoming and outgoing messages.
4. Set up your Twilio account and configure a WhatsApp sender.
5. Deploy the serverless functions to your Twilio environment.
6. Import the flows into Twilio Studio and link them to the corresponding functions.

## Contributions

Contributions to enhance the chatbot's functionality or add new features are highly welcome. Fork the repository, commit your changes, and submit a pull request for review.

## License

This project is released under [Specify License Here], which outlines the terms under which the project can be used and distributed.
