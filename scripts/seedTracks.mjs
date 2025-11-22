
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const tracksData = [
    {
        id: 'track-frontend',
        data: {
            title: "Frontend Developer Track",
            description: "Master the art of building beautiful, interactive user interfaces. This track covers everything from HTML/CSS fundamentals to advanced React patterns and performance optimization.",
            difficulty: "Intermediate",
            category: "Development",
            estimatedTime: 40,
            image: "/assets/tracks-image/frontend.png",
            skills: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Next.js"],
            isLocked: false,
            order: 1
        },
        modules: [
            {
                id: 'module1',
                data: {
                    title: "Web Fundamentals",
                    description: "The building blocks of the web. Learn how to structure content with HTML and style it with CSS to create responsive, accessible layouts.",
                    duration: "8 hours",
                    order: 1,
                    lessons: [
                        { id: 'html5-structure', title: "HTML5 Semantic Structure", duration: "45 min", type: "article", challengeId: null },
                        { id: 'css-box-model', title: "CSS Box Model & Flexbox", duration: "60 min", type: "article", challengeId: null },
                        { id: 'responsive-grid', title: "Responsive Design with Grid", duration: "60 min", type: "article", challengeId: null },
                        { id: 'web-accessibility', title: "Web Accessibility (a11y)", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module2',
                data: {
                    title: "JavaScript Deep Dive",
                    description: "Go beyond the basics. Understand closures, the event loop, promises, and modern ES6+ features that every senior frontend dev needs to know.",
                    duration: "12 hours",
                    order: 2,
                    lessons: [
                        { id: 'js-closures', title: "Scope, Hoisting & Closures", duration: "60 min", type: "article", challengeId: null },
                        { id: 'js-async', title: "Async JS: Promises & Async/Await", duration: "90 min", type: "article", challengeId: null },
                        { id: 'event-loop', title: "The Event Loop Explained", duration: "45 min", type: "article", challengeId: null },
                        { id: 'es6-features', title: "ES6+ Features & Modules", duration: "60 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module3',
                data: {
                    title: "React Ecosystem",
                    description: "Master modern React. Hooks, state management, routing, and performance optimization techniques for building scalable applications.",
                    duration: "20 hours",
                    order: 3,
                    lessons: [
                        { id: 'react-hooks', title: "React Hooks In-Depth", duration: "90 min", type: "article", challengeId: null },
                        { id: 'state-management', title: "State Management Patterns", duration: "60 min", type: "article", challengeId: null },
                        { id: 'nextjs-router', title: "Next.js App Router", duration: "90 min", type: "article", challengeId: null },
                        { id: 'react-perf', title: "Performance Optimization", duration: "60 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module4',
                data: {
                    title: "Interview Prep",
                    description: "Specific preparation for frontend interviews. Common questions, coding challenges, and system design for frontend.",
                    duration: "10 hours",
                    order: 4,
                    lessons: [
                        { id: 'fe-interview-questions', title: "Common Frontend Interview Questions", duration: "60 min", type: "article", challengeId: null },
                        { id: 'fe-coding-challenges', title: "Live Coding Challenges", duration: "120 min", type: "article", challengeId: "fe-challenge-1" },
                        { id: 'fe-system-design', title: "Frontend System Design", duration: "90 min", type: "article", challengeId: null },
                        { id: 'fe-behavioral', title: "Behavioral Questions for Frontend", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module5',
                data: {
                    title: "Final Assessment",
                    description: "Put your skills to the test with a comprehensive final project and assessment to certify your frontend mastery.",
                    duration: "5 hours",
                    order: 5,
                    lessons: [
                        { id: 'fe-quiz', title: "Comprehensive Quiz", duration: "60 min", type: "quiz", challengeId: null },
                        { id: 'fe-final-project', title: "Final Project Brief", duration: "30 min", type: "article", challengeId: "fe-project-1" },
                        { id: 'fe-submission', title: "Project Submission", duration: "15 min", type: "article", challengeId: null },
                        { id: 'fe-review', title: "Code Review Checklist", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            }
        ]
    },
    {
        id: 'track-backend',
        data: {
            title: "Backend Developer Track",
            description: "Get interview-ready for backend developer roles by mastering server-side logic, databases, and APIs. This track dives deep into Node.js, Express, SQL/NoSQL, and authentication.",
            difficulty: "Advanced",
            category: "Development",
            estimatedTime: 45,
            image: "/assets/tracks-image/backend.png",
            skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "System Design"],
            isLocked: false,
            order: 2
        },
        modules: [
            {
                id: 'module1',
                data: {
                    title: "Backend Foundations",
                    description: "Learn how the web really works — behind the scenes. This module covers server-side fundamentals, RESTful APIs, and the core principles of backend architecture.",
                    duration: "10 hours",
                    order: 1,
                    lessons: [
                        { id: 'nodejs-runtime', title: "Node.js Runtime & Event Loop", duration: "60 min", type: "article", challengeId: null },
                        { id: 'express-api', title: "Building RESTful APIs with Express", duration: "90 min", type: "article", challengeId: null },
                        { id: 'middleware', title: "Middleware & Error Handling", duration: "45 min", type: "article", challengeId: null },
                        { id: 'auth-jwt', title: "Authentication & Authorization (JWT)", duration: "90 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module2',
                data: {
                    title: "Database Mastery",
                    description: "Data is the heart of every application. Learn to design efficient schemas, write complex queries, and choose the right database for the job.",
                    duration: "15 hours",
                    order: 2,
                    lessons: [
                        { id: 'sql-design', title: "Relational DB Design (SQL)", duration: "90 min", type: "article", challengeId: null },
                        { id: 'nosql-mongo', title: "NoSQL Patterns with MongoDB", duration: "90 min", type: "article", challengeId: null },
                        { id: 'db-indexing', title: "Indexing & Query Optimization", duration: "60 min", type: "article", challengeId: null },
                        { id: 'acid-props', title: "Transactions & ACID Properties", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module3',
                data: {
                    title: "System Design & Scalability",
                    description: "Prepare for the dreaded system design interview. Learn about caching, load balancing, microservices, and how to scale applications to millions of users.",
                    duration: "20 hours",
                    order: 3,
                    lessons: [
                        { id: 'caching-redis', title: "Caching Strategies (Redis)", duration: "60 min", type: "article", challengeId: null },
                        { id: 'load-balancing', title: "Load Balancing & Horizontal Scaling", duration: "60 min", type: "article", challengeId: null },
                        { id: 'microservices', title: "Microservices vs Monolith", duration: "60 min", type: "article", challengeId: null },
                        { id: 'message-queues', title: "Message Queues & Event-Driven Arch", duration: "90 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module4',
                data: {
                    title: "Interview Prep",
                    description: "Targeted preparation for backend roles. API design challenges, database schema problems, and high-level system architecture discussions.",
                    duration: "10 hours",
                    order: 4,
                    lessons: [
                        { id: 'be-api-design', title: "API Design Challenges", duration: "90 min", type: "article", challengeId: "be-challenge-1" },
                        { id: 'be-schema-design', title: "Database Schema Design Problems", duration: "90 min", type: "article", challengeId: "be-challenge-2" },
                        { id: 'be-system-design', title: "System Design Interview Practice", duration: "120 min", type: "article", challengeId: null },
                        { id: 'be-mock-interview', title: "Mock Backend Interview", duration: "60 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module5',
                data: {
                    title: "Final Assessment",
                    description: "Validate your backend expertise with a full-stack capstone project and a rigorous technical assessment.",
                    duration: "5 hours",
                    order: 5,
                    lessons: [
                        { id: 'be-quiz', title: "Backend Architecture Quiz", duration: "60 min", type: "quiz", challengeId: null },
                        { id: 'be-capstone', title: "Capstone Project: Scalable API", duration: "30 min", type: "article", challengeId: "be-project-1" },
                        { id: 'be-submission', title: "Project Submission", duration: "15 min", type: "article", challengeId: null },
                        { id: 'be-review', title: "Performance Review", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            }
        ]
    },
    {
        id: 'track-uiux',
        data: {
            title: "UI/UX Design Track",
            description: "Bridge the gap between design and code. Learn user-centered design principles, prototyping with Figma, and how to hand off designs to developers effectively.",
            difficulty: "Beginner",
            category: "Design",
            estimatedTime: 30,
            image: "/assets/tracks-image/ui-ux.png",
            skills: ["Figma", "User Research", "Prototyping", "Wireframing", "Design Systems"],
            isLocked: false,
            order: 3
        },
        modules: [
            {
                id: 'module1',
                data: {
                    title: "Design Thinking & Research",
                    description: "Understand your users before you design. Learn the design thinking process, how to conduct user interviews, and create personas.",
                    duration: "8 hours",
                    order: 1,
                    lessons: [
                        { id: 'design-thinking', title: "The Design Thinking Process", duration: "45 min", type: "article", challengeId: null },
                        { id: 'user-research', title: "User Research Methods", duration: "60 min", type: "article", challengeId: null },
                        { id: 'personas', title: "Creating User Personas", duration: "45 min", type: "article", challengeId: null },
                        { id: 'journey-mapping', title: "User Journey Mapping", duration: "60 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module2',
                data: {
                    title: "Interface Design (UI)",
                    description: "Create beautiful, functional interfaces. Master typography, color theory, layout grids, and component-based design systems.",
                    duration: "12 hours",
                    order: 2,
                    lessons: [
                        { id: 'typography-color', title: "Typography & Color Theory", duration: "60 min", type: "article", challengeId: null },
                        { id: 'layout-grids', title: "Layout Grids & Spacing", duration: "45 min", type: "article", challengeId: null },
                        { id: 'component-design', title: "Component Design & States", duration: "90 min", type: "article", challengeId: null },
                        { id: 'design-systems', title: "Building a Design System", duration: "90 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module3',
                data: {
                    title: "Prototyping & Handoff",
                    description: "Bring your designs to life. Learn to create interactive prototypes in Figma and document your work for seamless developer handoff.",
                    duration: "10 hours",
                    order: 3,
                    lessons: [
                        { id: 'figma-basics', title: "Figma Prototyping Basics", duration: "60 min", type: "article", challengeId: null },
                        { id: 'advanced-interactions', title: "Advanced Interactions", duration: "60 min", type: "article", challengeId: null },
                        { id: 'usability-testing', title: "Usability Testing", duration: "90 min", type: "article", challengeId: null },
                        { id: 'dev-handoff', title: "Developer Handoff Best Practices", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module4',
                data: {
                    title: "Interview Prep",
                    description: "Prepare for design portfolio reviews and whiteboard challenges. Learn how to articulate your design decisions effectively.",
                    duration: "8 hours",
                    order: 4,
                    lessons: [
                        { id: 'portfolio-review', title: "Portfolio Review Preparation", duration: "90 min", type: "article", challengeId: null },
                        { id: 'whiteboard-challenge', title: "Whiteboard Design Challenge", duration: "60 min", type: "article", challengeId: "uiux-challenge-1" },
                        { id: 'design-decisions', title: "Articulating Design Decisions", duration: "60 min", type: "article", challengeId: null },
                        { id: 'uiux-behavioral', title: "Behavioral Questions for Designers", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            },
            {
                id: 'module5',
                data: {
                    title: "Final Assessment",
                    description: "Complete a full design sprint challenge to showcase your end-to-end design process and problem-solving skills.",
                    duration: "5 hours",
                    order: 5,
                    lessons: [
                        { id: 'uiux-quiz', title: "Design Theory Quiz", duration: "60 min", type: "quiz", challengeId: null },
                        { id: 'uiux-challenge', title: "Final Design Challenge", duration: "30 min", type: "article", challengeId: "uiux-project-1" },
                        { id: 'uiux-submission', title: "Case Study Submission", duration: "15 min", type: "article", challengeId: null },
                        { id: 'uiux-critique', title: "Self-Critique & Review", duration: "45 min", type: "article", challengeId: null }
                    ]
                }
            }
        ]
    }
];

async function seedTracks() {
    try {
        console.log('🚀 Starting to seed tracks and modules from files...');

        for (const track of tracksData) {
            console.log(`\nProcessing track: ${track.id} (${track.data.title})`);

            // 1. Update the Track Document
            const trackRef = doc(db, 'tracks', track.id);
            await setDoc(trackRef, {
                ...track.data,
                updatedAt: serverTimestamp()
            }, { merge: true });

            console.log(`✅ Track updated: ${track.id}`);

            // 2. Update Modules Sub-collection
            const modulesRef = collection(db, 'tracks', track.id, 'modules');

            for (const module of track.modules) {
                const moduleDocRef = doc(modulesRef, module.id);

                // Process lessons to read content from files
                const processedLessons = module.data.lessons.map(lesson => {
                    try {
                        const filePath = path.join(__dirname, '../content/tracks', track.id, module.id, `${lesson.id}.md`);
                        const content = fs.readFileSync(filePath, 'utf8');
                        return {
                            ...lesson,
                            content
                        };
                    } catch (err) {
                        console.warn(`⚠️ Could not read content for lesson ${lesson.id}: ${err.message}`);
                        return {
                            ...lesson,
                            content: "# Content not found\n\nPlease check the file system."
                        };
                    }
                });

                await setDoc(moduleDocRef, {
                    ...module.data,
                    lessons: processedLessons,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                console.log(`   ✨ Module updated: ${module.id} - ${module.data.title}`);
            }
        }

        console.log('\n🎉 Successfully seeded all tracks and modules!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding tracks:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedTracks();
