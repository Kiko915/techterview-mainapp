
const fs = require('fs');
const path = require('path');

const tracksData = [
    {
        id: 'track-frontend',
        modules: [
            {
                id: 'module1',
                lessons: [
                    {
                        id: 'html5-structure',
                        content: "# HTML5 Semantic Structure\n\nSemantic HTML is the foundation of a accessible and SEO-friendly web application. In this lesson, we'll explore why using the correct tags matters.\n\n## Key Concepts\n\n- **<header>**: Introductory content or navigation\n- **<main>**: The dominant content of the <body>\n- **<article>**: Self-contained composition\n- **<section>**: Thematic grouping of content\n- **<footer>**: Footer for a section or page\n\n## Why it matters\n\nUsing semantic tags helps screen readers understand your page structure and improves search engine ranking."
                    },
                    {
                        id: 'css-box-model',
                        content: "# CSS Box Model & Flexbox\n\nUnderstanding the Box Model is crucial for layout.\n\n## The Box Model\n\nEvery element in web design is a rectangular box. The box model consists of:\n1. **Content**: The actual content of the box, where text and images appear\n2. **Padding**: Clears an area around the content\n3. **Border**: A border that goes around the padding and content\n4. **Margin**: Clears an area outside the border\n\n## Flexbox\n\nFlexbox is a one-dimensional layout method for laying out items in rows or columns."
                    },
                    {
                        id: 'responsive-grid',
                        content: "# CSS Grid Layout\n\nCSS Grid Layout excels at dividing a page into major regions or defining the relationship in terms of size, position, and layer, between parts of a control built from HTML primitives.\n\n## Basic Terminology\n\n- **Grid Container**: The element on which `display: grid` is applied.\n- **Grid Item**: The children of the grid container.\n- **Grid Line**: The dividing lines that make up the structure of the grid."
                    },
                    {
                        id: 'web-accessibility',
                        content: "# Web Accessibility\n\nWeb accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them.\n\n## WCAG Principles\n\n1. **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive.\n2. **Operable**: User interface components and navigation must be operable.\n3. **Understandable**: Information and the operation of user interface must be understandable.\n4. **Robust**: Content must be robust enough that it can be interpreted reliably by a wide variety of user agents."
                    }
                ]
            },
            {
                id: 'module2',
                lessons: [
                    {
                        id: 'js-closures',
                        content: "# Closures in JavaScript\n\nA closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).\n\n```javascript\nfunction makeFunc() {\n  const name = 'Mozilla';\n  function displayName() {\n    console.log(name);\n  }\n  return displayName;\n}\n\nconst myFunc = makeFunc();\nmyFunc();\n```"
                    },
                    {
                        id: 'js-async',
                        content: "# Asynchronous JavaScript\n\nJavaScript is single-threaded, but it handles asynchronous operations using the Event Loop.\n\n## Promises\n\nA Promise is an object representing the eventual completion or failure of an asynchronous operation.\n\n## Async/Await\n\nAsync/await is syntactic sugar built on top of promises. It makes asynchronous code look and behave a little more like synchronous code."
                    },
                    {
                        id: 'event-loop',
                        content: "# The Event Loop\n\nThe Event Loop is one of the most important aspects to understand about JavaScript.\n\n1. **Call Stack**: Where your code executes.\n2. **Web APIs**: Where async operations (DOM, AJAX, setTimeout) are handled.\n3. **Callback Queue**: Where callbacks wait to be pushed to the stack.\n4. **Event Loop**: Checks if stack is empty and pushes from queue."
                    },
                    {
                        id: 'es6-features',
                        content: "# Modern JavaScript (ES6+)\n\n## Key Features\n\n- **Arrow Functions**: `() => {}`\n- **Destructuring**: `const { a, b } = obj`\n- **Template Literals**: `Hello ${name}`\n- **Spread/Rest Operator**: `...`\n- **Modules**: `import` / `export`"
                    }
                ]
            },
            {
                id: 'module3',
                lessons: [
                    {
                        id: 'react-hooks',
                        content: "# React Hooks\n\nHooks allow you to use state and other React features without writing a class.\n\n## Common Hooks\n\n- `useState`: Manage local state\n- `useEffect`: Side effects (data fetching, subscriptions)\n- `useContext`: Context API\n- `useReducer`: Complex state logic\n- `useRef`: Mutable values without re-rendering"
                    },
                    {
                        id: 'state-management',
                        content: "# State Management\n\nManaging state effectively is key to scaling React apps.\n\n1. **Local State**: `useState`\n2. **Lifted State**: Passing props down\n3. **Context API**: Global state for themes, auth\n4. **External Libraries**: Redux, Zustand, Jotai"
                    },
                    {
                        id: 'nextjs-router',
                        content: "# Next.js App Router\n\nThe App Router is a new paradigm for building applications using React's latest features like Server Components and Streaming.\n\n## Key Concepts\n\n- **Server Components**: Render on the server for better performance.\n- **Client Components**: Interactive components (`'use client'`).\n- **Routing**: File-system based routing in the `app` directory."
                    },
                    {
                        id: 'react-perf',
                        content: "# React Performance\n\nOptimizing React applications involves minimizing re-renders and bundle size.\n\n## Techniques\n\n- `React.memo`: Memoize components\n- `useMemo` & `useCallback`: Memoize values and functions\n- **Code Splitting**: `React.lazy` and `Suspense`\n- **Virtualization**: Rendering only visible items in large lists"
                    }
                ]
            },
            {
                id: 'module4',
                lessons: [
                    {
                        id: 'fe-interview-questions',
                        content: "# Common Interview Questions\n\n1. **What is the difference between `var`, `let`, and `const`?**\n2. **Explain the concept of hoisting.**\n3. **What is the Virtual DOM?**\n4. **Explain event delegation.**\n5. **What are Higher-Order Components (HOCs)?**"
                    },
                    {
                        id: 'fe-coding-challenges',
                        content: "# Coding Challenges\n\nPractice these common challenges:\n\n- Implement `debounce` and `throttle`\n- Flatten a nested array\n- Build a todo list in React\n- Fetch data from an API and display it"
                    },
                    {
                        id: 'fe-system-design',
                        content: "# Frontend System Design\n\nWhen designing a large-scale application, consider:\n\n- **Component Hierarchy**\n- **State Management Strategy**\n- **Data Fetching & Caching**\n- **Performance & Optimization**\n- **Accessibility & Internationalization**"
                    },
                    {
                        id: 'fe-behavioral',
                        content: "# Behavioral Questions\n\n- Tell me about a challenging bug you fixed.\n- How do you handle disagreements with designers?\n- Describe a time you improved website performance.\n- How do you keep up with the latest frontend trends?"
                    }
                ]
            },
            {
                id: 'module5',
                lessons: [
                    {
                        id: 'fe-quiz',
                        content: "# Final Quiz\n\nThis quiz covers all topics from the track. Good luck!"
                    },
                    {
                        id: 'fe-final-project',
                        content: "# Final Project: E-commerce Dashboard\n\nBuild a responsive dashboard for an e-commerce store.\n\n## Requirements\n\n- Product list with filtering and sorting\n- Shopping cart functionality\n- User authentication (mock)\n- Dark/Light mode toggle\n- Responsive design"
                    },
                    {
                        id: 'fe-submission',
                        content: "# Submit Your Project\n\nPlease provide the GitHub repository URL and the deployed link (Vercel/Netlify)."
                    },
                    {
                        id: 'fe-review',
                        content: "# Self-Review Checklist\n\nBefore submitting, check:\n\n- [ ] No console errors\n- [ ] Responsive on mobile\n- [ ] Accessible (keyboard navigation, ARIA)\n- [ ] Clean code structure\n- [ ] Readme file included"
                    }
                ]
            }
        ]
    },
    {
        id: 'track-backend',
        modules: [
            {
                id: 'module1',
                lessons: [
                    {
                        id: 'nodejs-runtime',
                        content: "# Node.js Runtime\n\nNode.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.\n\n## Non-blocking I/O\n\nNode.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient."
                    },
                    {
                        id: 'express-api',
                        content: "# Express.js\n\nExpress is a minimal and flexible Node.js web application framework.\n\n## Creating a Server\n\n```javascript\nconst express = require('express')\nconst app = express()\n\napp.get('/', (req, res) => {\n  res.send('Hello World!')\n})\n```"
                    },
                    {
                        id: 'middleware',
                        content: "# Middleware\n\nMiddleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle."
                    },
                    {
                        id: 'auth-jwt',
                        content: "# JWT Authentication\n\nJSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object."
                    }
                ]
            },
            {
                id: 'module2',
                lessons: [
                    {
                        id: 'sql-design',
                        content: "# SQL Database Design\n\n## Normalization\n\nNormalization is the process of organizing data in a database. This includes creating tables and establishing relationships between those tables according to rules designed both to protect the data and to make the database more flexible by eliminating redundancy and inconsistent dependency."
                    },
                    {
                        id: 'nosql-mongo',
                        content: "# MongoDB Schema Design\n\nUnlike SQL, MongoDB uses a flexible schema. Data is stored in documents (JSON-like objects).\n\n## Embedding vs Referencing\n\n- **Embedding**: Storing related data in a single document.\n- **Referencing**: Storing references (IDs) to other documents."
                    },
                    {
                        id: 'db-indexing',
                        content: "# Database Indexing\n\nIndexes are special lookup tables that the database search engine can use to speed up data retrieval. Simply put, an index is a pointer to data in a table."
                    },
                    {
                        id: 'acid-props',
                        content: "# ACID Properties\n\nTo ensure data integrity, transactions must follow ACID properties:\n\n- **Atomicity**: All or nothing.\n- **Consistency**: Valid state transitions.\n- **Isolation**: Transactions don't interfere.\n- **Durability**: Committed data is saved."
                    }
                ]
            },
            {
                id: 'module3',
                lessons: [
                    {
                        id: 'caching-redis',
                        content: "# Caching\n\nCaching is the process of storing copies of files in a temporary storage location, so that they can be accessed more quickly.\n\n## Redis\n\nRedis is an in-memory data structure store, used as a database, cache, and message broker."
                    },
                    {
                        id: 'load-balancing',
                        content: "# Load Balancing\n\nA load balancer distributes network or application traffic across a number of servers.\n\n## Horizontal vs Vertical Scaling\n\n- **Horizontal (Scale Out)**: Adding more machines.\n- **Vertical (Scale Up)**: Adding more power (CPU, RAM) to an existing machine."
                    },
                    {
                        id: 'microservices',
                        content: "# Microservices Architecture\n\nMicroservices - also known as the microservice architecture - is an architectural style that structures an application as a collection of services that are:\n- Highly maintainable and testable\n- Loosely coupled\n- Independently deployable"
                    },
                    {
                        id: 'message-queues',
                        content: "# Message Queues\n\nMessage queues allow different parts of a system to communicate and process operations asynchronously.\n\n## Examples\n\n- RabbitMQ\n- Apache Kafka\n- AWS SQS"
                    }
                ]
            },
            {
                id: 'module4',
                lessons: [
                    {
                        id: 'be-api-design',
                        content: "# API Design Challenge\n\nDesign an API for a social media feed.\n\n## Considerations\n\n- Endpoints definition\n- Request/Response format\n- Pagination strategy\n- Rate limiting"
                    },
                    {
                        id: 'be-schema-design',
                        content: "# Schema Design\n\nDesign the database schema for an Uber-like ride sharing app.\n\n## Entities\n\n- Users (Riders/Drivers)\n- Rides\n- Locations\n- Payments"
                    },
                    {
                        id: 'be-system-design',
                        content: "# System Design: URL Shortener\n\nDesign a system like Bit.ly.\n\n## Requirements\n\n- Shorten long URLs\n- Redirect to original URL\n- Analytics (optional)\n- High availability"
                    },
                    {
                        id: 'be-mock-interview',
                        content: "# Mock Interview Checklist\n\n- [ ] Review HTTP status codes\n- [ ] Explain REST vs GraphQL\n- [ ] Database normalization levels\n- [ ] Authentication flows (OAuth)"
                    }
                ]
            },
            {
                id: 'module5',
                lessons: [
                    {
                        id: 'be-quiz',
                        content: "# Final Backend Quiz\n\nTest your knowledge on Node.js, Databases, and System Design."
                    },
                    {
                        id: 'be-capstone',
                        content: "# Capstone: Task Management API\n\nBuild a robust API for a task management system.\n\n## Features\n\n- CRUD for Tasks\n- User Auth\n- Real-time updates (Socket.io)\n- Background jobs (email notifications)"
                    },
                    {
                        id: 'be-submission',
                        content: "# Submission\n\nDeploy your API to a cloud provider (Heroku/Render/AWS) and submit the URL."
                    },
                    {
                        id: 'be-review',
                        content: "# Performance Review\n\n- Load test your API (Apache Bench/JMeter)\n- Check query performance\n- Security audit (OWASP Top 10)"
                    }
                ]
            }
        ]
    },
    {
        id: 'track-uiux',
        modules: [
            {
                id: 'module1',
                lessons: [
                    {
                        id: 'design-thinking',
                        content: "# Design Thinking\n\nA non-linear, iterative process that teams use to understand users, challenge assumptions, redefine problems and create innovative solutions to prototype and test.\n\n## Stages\n\n1. Empathize\n2. Define\n3. Ideate\n4. Prototype\n5. Test"
                    },
                    {
                        id: 'user-research',
                        content: "# User Research\n\n## Qualitative vs Quantitative\n\n- **Qualitative**: Interviews, Observations (Why?)\n- **Quantitative**: Surveys, Analytics (How many?)"
                    },
                    {
                        id: 'personas',
                        content: "# User Personas\n\nFictional characters, which you create based upon your research in order to represent the different user types that might use your service, product, site, or brand in a similar way."
                    },
                    {
                        id: 'journey-mapping',
                        content: "# User Journey Map\n\nA visual representation of the customer experience. It tells the story of a customer's experience with your brand from original engagement and into hopefully a long-term relationship."
                    }
                ]
            },
            {
                id: 'module2',
                lessons: [
                    {
                        id: 'typography-color',
                        content: "# Typography & Color\n\n## Typography\n\n- Hierarchy\n- Readability\n- Font pairing\n\n## Color Theory\n\n- Color wheel\n- Color harmony\n- Accessibility (Contrast ratios)"
                    },
                    {
                        id: 'layout-grids',
                        content: "# Grids\n\nA grid system is a structure (usually two-dimensional) made up of a series of intersecting straight (vertical, horizontal) lines used to structure content."
                    },
                    {
                        id: 'component-design',
                        content: "# UI Components\n\nButtons, Inputs, Cards, Modals.\n\n## States\n\n- Default\n- Hover\n- Active\n- Disabled\n- Error"
                    },
                    {
                        id: 'design-systems',
                        content: "# Design Systems\n\nA collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications."
                    }
                ]
            },
            {
                id: 'module3',
                lessons: [
                    {
                        id: 'figma-basics',
                        content: "# Figma Prototyping\n\nConnect frames to create flows. Add interactions like On Click, On Hover, etc."
                    },
                    {
                        id: 'advanced-interactions',
                        content: "# Smart Animate\n\nCreate smooth transitions between frames with matching layer names."
                    },
                    {
                        id: 'usability-testing',
                        content: "# Usability Testing\n\nObserving users as they attempt to complete tasks with your prototype."
                    },
                    {
                        id: 'dev-handoff',
                        content: "# Handoff\n\n- Annotate designs\n- Export assets\n- Define spacing tokens\n- Communicate behavior"
                    }
                ]
            },
            {
                id: 'module4',
                lessons: [
                    {
                        id: 'portfolio-review',
                        content: "# Portfolio Review\n\nSelect 3-4 strong case studies. Focus on the process, not just the final UI."
                    },
                    {
                        id: 'whiteboard-challenge',
                        content: "# Whiteboard Challenge\n\nSolve a design problem on the spot.\n\n1. Ask clarifying questions\n2. Define the user\n3. Sketch flows\n4. Draw screens"
                    },
                    {
                        id: 'design-decisions',
                        content: "# Articulating Decisions\n\nExplain the 'Why'. Use data or research to back up your choices."
                    },
                    {
                        id: 'uiux-behavioral',
                        content: "# Behavioral Questions\n\n- How do you handle feedback?\n- Describe a time you disagreed with a PM.\n- What is your design process?"
                    }
                ]
            },
            {
                id: 'module5',
                lessons: [
                    {
                        id: 'uiux-quiz',
                        content: "# Design Theory Quiz\n\nTest your knowledge on Color, Typography, and UX Laws."
                    },
                    {
                        id: 'uiux-challenge',
                        content: "# Final Challenge: Travel App\n\nDesign a mobile app for booking eco-friendly travel experiences."
                    },
                    {
                        id: 'uiux-submission',
                        content: "# Case Study\n\nWrite a case study for your final challenge and submit the link."
                    },
                    {
                        id: 'uiux-critique',
                        content: "# Self-Critique\n\nWhat would you improve if you had more time? What assumptions did you make?"
                    }
                ]
            }
        ]
    }
];

function migrateContent() {
    console.log('🚀 Starting content migration to files...');

    const contentDir = path.join(__dirname, '../content/tracks');

    tracksData.forEach(track => {
        track.modules.forEach(module => {
            const moduleDir = path.join(contentDir, track.id, module.id);

            // Ensure directory exists (though we created it manually, good to be safe)
            if (!fs.existsSync(moduleDir)) {
                fs.mkdirSync(moduleDir, { recursive: true });
            }

            module.lessons.forEach(lesson => {
                const filePath = path.join(moduleDir, `${lesson.id}.md`);
                fs.writeFileSync(filePath, lesson.content);
                console.log(`✅ Created: ${track.id}/${module.id}/${lesson.id}.md`);
            });
        });
    });

    console.log('🎉 Migration complete!');
}

migrateContent();
