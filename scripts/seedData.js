import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW_aeuoNfRLJwD9srn726wICxtUAtzZDc",
  authDomain: "techterview-webapp.firebaseapp.com",
  projectId: "techterview-webapp",
  storageBucket: "techterview-webapp.firebasestorage.app",
  messagingSenderId: "283033835367",
  appId: "1:283033835367:web:53f3024a9ce8dad4f681c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample questions data
const sampleQuestions = [
  {
    question: "What is the difference between let, const, and var in JavaScript?",
    category: "JavaScript",
    difficulty: "easy",
    type: "technical",
    tags: ["variables", "scope", "hoisting"],
    sampleAnswer: "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned.",
    followUpQuestions: [
      "Can you explain hoisting with these variable declarations?",
      "What happens if you try to access a let variable before declaration?"
    ]
  },
  {
    question: "Explain the concept of closures in JavaScript.",
    category: "JavaScript",
    difficulty: "medium",
    type: "technical",
    tags: ["closures", "scope", "functions"],
    sampleAnswer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).",
    followUpQuestions: [
      "Can you provide a practical example of closures?",
      "What are the performance implications of closures?"
    ]
  },
  {
    question: "What is the difference between SQL and NoSQL databases?",
    category: "Database",
    difficulty: "easy",
    type: "technical",
    tags: ["database", "sql", "nosql"],
    sampleAnswer: "SQL databases are relational with fixed schemas, while NoSQL databases are non-relational with flexible schemas.",
    followUpQuestions: [
      "When would you choose NoSQL over SQL?",
      "Can you name some examples of each type?"
    ]
  },
  {
    question: "Describe your experience with version control systems.",
    category: "Tools",
    difficulty: "easy",
    type: "experience",
    tags: ["git", "version-control", "collaboration"],
    sampleAnswer: "Version control systems like Git help track changes in code, enable collaboration, and maintain project history.",
    followUpQuestions: [
      "How do you handle merge conflicts?",
      "What is your typical Git workflow?"
    ]
  },
  {
    question: "How do you handle a situation where you disagree with a team member's technical approach?",
    category: "Behavioral",
    difficulty: "medium",
    type: "behavioral",
    tags: ["teamwork", "communication", "conflict-resolution"],
    sampleAnswer: "I would discuss the pros and cons of both approaches, present data or examples, and work together to find the best solution.",
    followUpQuestions: [
      "Can you give a specific example from your experience?",
      "How do you ensure team harmony while maintaining technical standards?"
    ]
  },
  {
    question: "Explain the concept of RESTful APIs and HTTP methods.",
    category: "Web Development",
    difficulty: "medium",
    type: "technical",
    tags: ["rest", "api", "http", "web-services"],
    sampleAnswer: "REST is an architectural style for web services that uses standard HTTP methods (GET, POST, PUT, DELETE) for different operations.",
    followUpQuestions: [
      "What makes an API RESTful?",
      "How do you handle API versioning?"
    ]
  },
  {
    question: "What is your biggest weakness?",
    category: "Behavioral",
    difficulty: "easy",
    type: "behavioral", 
    tags: ["self-awareness", "growth", "improvement"],
    sampleAnswer: "I sometimes spend too much time perfecting details, but I'm learning to balance quality with deadlines and team priorities.",
    followUpQuestions: [
      "How are you working to improve this weakness?",
      "Can you give an example of how this affected a project?"
    ]
  },
  {
    question: "Explain the difference between authentication and authorization.",
    category: "Security",
    difficulty: "easy",
    type: "technical",
    tags: ["security", "authentication", "authorization"],
    sampleAnswer: "Authentication verifies who you are, while authorization determines what you're allowed to do.",
    followUpQuestions: [
      "Can you explain different authentication methods?",
      "How do you implement role-based access control?"
    ]
  },
  {
    question: "What is the time complexity of common sorting algorithms?",
    category: "Algorithms",
    difficulty: "hard",
    type: "technical",
    tags: ["algorithms", "sorting", "time-complexity"],
    sampleAnswer: "Bubble sort: O(n²), Merge sort: O(n log n), Quick sort: O(n log n) average, O(n²) worst case.",
    followUpQuestions: [
      "Which sorting algorithm would you choose for large datasets?",
      "Can you explain the trade-offs between space and time complexity?"
    ]
  },
  {
    question: "Describe a challenging project you worked on and how you overcame the difficulties.",
    category: "Behavioral",
    difficulty: "medium",
    type: "behavioral",
    tags: ["problem-solving", "resilience", "project-management"],
    sampleAnswer: "I'd describe a specific project, the challenges faced, actions taken, and lessons learned, following the STAR method.",
    followUpQuestions: [
      "What would you do differently if you faced a similar situation?",
      "How did this experience change your approach to future projects?"
    ]
  }
];

async function seedQuestions() {
  try {
    console.log('Starting to seed questions...');
    const questionsCollection = collection(db, 'questions');
    
    for (const question of sampleQuestions) {
      await addDoc(questionsCollection, {
        ...question,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added question: ${question.question.substring(0, 50)}...`);
    }
    
    console.log('Successfully seeded all questions!');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
}

// Run the seeding function
seedQuestions();