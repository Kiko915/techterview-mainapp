import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCW_aeuoNfRLJwD9srn726wICxtUAtzZDc",
    authDomain: "techterview-webapp.firebaseapp.com",
    projectId: "techterview-webapp",
    storageBucket: "techterview-webapp.firebasestorage.app",
    messagingSenderId: "283033835367",
    appId: "1:283033835367:web:53f3024a9ce8dad4f681c2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const questions = [
    // Frontend Quiz Questions
    {
        quizId: 'fe-quiz',
        text: "Which HTML5 tag is used to define the main content of a document?",
        options: ["<main>", "<content>", "<section>", "<body>"],
        correctAnswer: 0,
        explanation: "The <main> tag specifies the main content of a document."
    },
    {
        quizId: 'fe-quiz',
        text: "What is the purpose of the 'z-index' property in CSS?",
        options: ["To set the transparency of an element", "To control the stacking order of elements", "To zoom into an element", "To set the width of an element"],
        correctAnswer: 1,
        explanation: "The z-index property specifies the stack order of an element."
    },
    {
        quizId: 'fe-quiz',
        text: "Which method is used to update state in a React class component?",
        options: ["updateState()", "setState()", "changeState()", "modifyState()"],
        correctAnswer: 1,
        explanation: "setState() is the method used to update the state object in React class components."
    },
    {
        quizId: 'fe-quiz',
        text: "What does DOM stand for?",
        options: ["Data Object Model", "Document Object Model", "Digital Object Model", "Dynamic Object Model"],
        correctAnswer: 1,
        explanation: "DOM stands for Document Object Model."
    },
    {
        quizId: 'fe-quiz',
        text: "Which hook is used to perform side effects in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation: "useEffect is used for side effects like data fetching, subscriptions, etc."
    },

    // Backend Quiz Questions
    {
        quizId: 'be-quiz',
        text: "Which of the following is a NoSQL database?",
        options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
        correctAnswer: 2,
        explanation: "MongoDB is a popular NoSQL database."
    },
    {
        quizId: 'be-quiz',
        text: "What is the primary purpose of Node.js?",
        options: ["To run JavaScript in the browser", "To run JavaScript on the server", "To style web pages", "To query databases"],
        correctAnswer: 1,
        explanation: "Node.js is a runtime environment that allows you to run JavaScript on the server."
    },
    {
        quizId: 'be-quiz',
        text: "What does REST stand for?",
        options: ["Representational State Transfer", "Remote Execution State Transfer", "Real State Transfer", "Rapid Execution State Transfer"],
        correctAnswer: 0,
        explanation: "REST stands for Representational State Transfer."
    },
    {
        quizId: 'be-quiz',
        text: "Which HTTP method is typically used to create a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 1,
        explanation: "POST is used to submit data to be processed to a specified resource."
    },
    {
        quizId: 'be-quiz',
        text: "What is middleware in Express.js?",
        options: ["A database driver", "Functions that have access to the request and response objects", "A frontend framework", "A testing tool"],
        correctAnswer: 1,
        explanation: "Middleware functions have access to the request object (req), the response object (res), and the next middleware function."
    },

    // UI/UX Quiz Questions
    {
        quizId: 'uiux-quiz',
        text: "What is the first stage of the Design Thinking process?",
        options: ["Define", "Ideate", "Empathize", "Prototype"],
        correctAnswer: 2,
        explanation: "Empathize is the first stage, where you understand the users' needs."
    },
    {
        quizId: 'uiux-quiz',
        text: "Which tool is primarily used for interface design and prototyping?",
        options: ["Photoshop", "Figma", "Illustrator", "After Effects"],
        correctAnswer: 1,
        explanation: "Figma is a leading tool for interface design and prototyping."
    },
    {
        quizId: 'uiux-quiz',
        text: "What does 'hierarchy' refer to in visual design?",
        options: ["The color scheme", "The arrangement of elements to show importance", "The font size", "The background image"],
        correctAnswer: 1,
        explanation: "Visual hierarchy controls the delivery of the experience. If you have a hard time figuring out where to look on a page, it's likely that its layout lacks a clear visual hierarchy."
    },
    {
        quizId: 'uiux-quiz',
        text: "What is a 'persona' in UX design?",
        options: ["A fictional character representing a user type", "The designer's personality", "A marketing slogan", "A type of font"],
        correctAnswer: 0,
        explanation: "A persona is a fictional character created to represent a user type that might use a site, brand, or product in a similar way."
    },
    {
        quizId: 'uiux-quiz',
        text: "What is the purpose of a wireframe?",
        options: ["To show the final visual design", "To define the structure and layout", "To write the code", "To test the performance"],
        correctAnswer: 1,
        explanation: "A wireframe is a visual guide that represents the skeletal framework of a website."
    }
];

async function seedQuestions() {
    try {
        console.log('🚀 Starting to seed quiz questions...');
        const questionsRef = collection(db, 'questions');

        for (const question of questions) {
            await addDoc(questionsRef, {
                ...question,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log(`✅ Added question for ${question.quizId}: ${question.text.substring(0, 30)}...`);
        }

        console.log('\n🎉 Successfully seeded all quiz questions!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding questions:', error);
        process.exit(1);
    }
}

seedQuestions();
