
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to load .env.local manually
function loadEnv() {
    const envPath = join(__dirname, '..', '.env.local');
    if (existsSync(envPath)) {
        const envConfig = readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
        console.log('✅ Loaded environment variables from .env.local');
    } else {
        console.warn('⚠️ .env.local file not found. Ensure environment variables are set.');
    }
}

loadEnv();

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const challenges = [
    {
        id: "js-counter-closure",
        title: "Counter Closure",
        description: `
# Counter Closure

Implement a function \`createCounter\` that accepts an integer \`n\`. 
It should return another function that, when called, returns \`n\` initially, and then \`n + 1\`, \`n + 2\`, etc.

## Example 1:
\`\`\`javascript
const counter = createCounter(10);
counter(); // 10
counter(); // 11
counter(); // 12
\`\`\`
`,
        category: "frontend",
        difficulty: "Easy",
        languageRestriction: ["javascript"],
        starterCode: {
            javascript: `/**
 * @param {number} n
 * @return {Function} counter
 */
var createCounter = function(n) {
    
};`
        },
        testHarness: {
            javascript: `
const assert = require('assert');
try {
    const counter = createCounter(10);
    assert.strictEqual(counter(), 10, "First call should return 10");
    assert.strictEqual(counter(), 11, "Second call should return 11");
    assert.strictEqual(counter(), 12, "Third call should return 12");
    console.log("All tests passed!");
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
`
        }
    },
    {
        id: "py-valid-anagram",
        title: "Valid Anagram",
        description: `
# Valid Anagram

Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

## Example 1:
\`\`\`text
Input: s = "anagram", t = "nagaram"
Output: true
\`\`\`
`,
        category: "backend",
        difficulty: "Easy",
        languageRestriction: ["python"],
        starterCode: {
            python: `def isAnagram(s: str, t: str) -> bool:
    pass`
        },
        testHarness: {
            python: `
import sys

try:
    assert isAnagram("anagram", "nagaram") == True, "Test Case 1 Failed"
    assert isAnagram("rat", "car") == False, "Test Case 2 Failed"
    print("All tests passed!")
except AssertionError as e:
    print(e)
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
`
        }
    },
    {
        id: "universal-two-sum",
        title: "Two Sum",
        description: `
# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

## Example 1:
\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`
`,
        category: "universal",
        difficulty: "Easy",
        languageRestriction: ["javascript", "python"],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
            python: `def twoSum(nums: List[int], target: int) -> List[int]:
    pass`
        },
        testHarness: {
            javascript: `
const assert = require('assert');
try {
    const result1 = twoSum([2,7,11,15], 9);
    assert.deepStrictEqual(result1.sort(), [0,1], "Test Case 1 Failed");
    
    const result2 = twoSum([3,2,4], 6);
    assert.deepStrictEqual(result2.sort(), [1,2], "Test Case 2 Failed");
    
    console.log("All tests passed!");
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
`,
            python: `
import sys
from typing import List

try:
    assert sorted(twoSum([2,7,11,15], 9)) == [0,1], "Test Case 1 Failed"
    assert sorted(twoSum([3,2,4], 6)) == [1,2], "Test Case 2 Failed"
    print("All tests passed!")
except AssertionError as e:
    print(e)
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
`
        }
    },
    {
        "id": "js-valid-palindrome",
        "title": "Valid Palindrome",
        "description": "# Valid Palindrome\n\nA phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n## Example 1:\n```js\nisPalindrome(\"A man, a plan, a canal: Panama\") // true\n```\n\n## Example 2:\n```js\nisPalindrome(\"race a car\") // false\n```",
        "category": "frontend",
        "difficulty": "Easy",
        "languageRestriction": ["javascript"],
        "starterCode": {
            "javascript": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n  \n}"
        },
        "testHarness": {
            "javascript": "\nconst assert = require('assert');\ntry {\n    assert.strictEqual(isPalindrome('A man, a plan, a canal: Panama'), true, 'Test Case 1 Failed');\n    assert.strictEqual(isPalindrome('race a car'), false, 'Test Case 2 Failed');\n    assert.strictEqual(isPalindrome(' '), true, 'Test Case 3 Failed (Empty string)');\n    console.log('All tests passed!');\n} catch (e) {\n    console.error(e.message);\n    process.exit(1);\n}\n"
        }
    },
    {
        "id": "js-deep-flatten",
        "title": "Deep Flatten",
        "description": "# Deep Flatten\n\nImplement a function `flatten` that takes an array containing nested arrays and returns a fully flattened array.\n\n**Constraints:** Do not use the built-in `Array.prototype.flat` method.\n\n## Example:\n```js\nflatten([1, [2, [3, [4]], 5]]); \n// Output: [1, 2, 3, 4, 5]\n```",
        "category": "frontend",
        "difficulty": "Medium",
        "languageRestriction": ["javascript"],
        "starterCode": {
            "javascript": "/**\n * @param {any[]} arr\n * @return {any[]}\n */\nfunction flatten(arr) {\n  \n}"
        },
        "testHarness": {
            "javascript": "\nconst assert = require('assert');\ntry {\n    const input = [1, [2, [3, [4]], 5]];\n    const expected = [1, 2, 3, 4, 5];\n    const result = flatten(input);\n    assert.deepStrictEqual(result, expected, 'Test Case 1 Failed');\n    assert.deepStrictEqual(flatten([]), [], 'Test Case 2 Failed');\n    console.log('All tests passed!');\n} catch (e) {\n    console.error(e.message);\n    process.exit(1);\n}\n"
        }
    },
    {
        "id": "js-event-emitter",
        "title": "Event Emitter",
        "description": "# Event Emitter\n\nDesign an `EventEmitter` class. This interface is similar to Node.js's built-in EventEmitter.\n\nImplement the following methods:\n1. `subscribe(eventName, callback)`: Should return an object with an `unsubscribe` method.\n2. `emit(eventName, args[])`: Executes all callbacks associated with the eventName.\n\n## Example:\n```js\nconst emitter = new EventEmitter();\nconst sub = emitter.subscribe('click', () => console.log('clicked!'));\nemitter.emit('click'); // logs 'clicked!'\nsub.unsubscribe();\n```",
        "category": "frontend",
        "difficulty": "Medium",
        "languageRestriction": ["javascript"],
        "starterCode": {
            "javascript": "class EventEmitter {\n  subscribe(eventName, callback) {\n      \n  }\n\n  emit(eventName, args = []) {\n      \n  }\n}"
        },
        "testHarness": {
            "javascript": "\nconst assert = require('assert');\ntry {\n    const emitter = new EventEmitter();\n    let count = 0;\n    const sub = emitter.subscribe('test', (val) => count += val);\n    emitter.emit('test', [10]);\n    assert.strictEqual(count, 10, 'Emit failed to trigger callback');\n    sub.unsubscribe();\n    emitter.emit('test', [5]);\n    assert.strictEqual(count, 10, 'Unsubscribe failed');\n    console.log('All tests passed!');\n} catch (e) {\n    console.error(e.message);\n    process.exit(1);\n}\n"
        }
    },
    {
        "id": "js-promise-all-polyfill",
        "title": "Promise.all Polyfill",
        "description": "# Promise.all Polyfill\n\nImplement a function `promiseAll(promises)` that mimics the behavior of `Promise.all`.\n\n- It takes an array of promises.\n- It returns a single Promise that resolves to an array of the results of the input promises.\n- If any of the input promises reject, the returned promise rejects immediately with that error.\n\n## Example:\n```js\npromiseAll([Promise.resolve(1), Promise.resolve(2)]).then(console.log); // [1, 2]\n```",
        "category": "frontend",
        "difficulty": "Hard",
        "languageRestriction": ["javascript"],
        "starterCode": {
            "javascript": "/**\n * @param {Array<Promise>} promises\n * @return {Promise}\n */\nfunction promiseAll(promises) {\n  \n}"
        },
        "testHarness": {
            "javascript": "\nconst assert = require('assert');\nasync function runTests() {\n    try {\n        const p1 = Promise.resolve(3);\n        const p2 = 42;\n        const p3 = new Promise((resolve) => setTimeout(resolve, 10, 'foo'));\n        \n        const res = await promiseAll([p1, p2, p3]);\n        assert.deepStrictEqual(res, [3, 42, 'foo'], 'Basic Resolution Failed');\n\n        try {\n             await promiseAll([Promise.resolve(1), Promise.reject('error')]);\n             throw new Error('Should have rejected');\n        } catch (e) {\n             assert.strictEqual(e, 'error', 'Rejection handling failed');\n        }\n        console.log('All tests passed!');\n    } catch (e) {\n        console.error(e.message);\n        process.exit(1);\n    }\n}\nrunTests();\n"
        }
    },
    {
        "id": "js-deep-clone",
        "title": "Deep Clone",
        "description": "# Deep Clone\n\nWrite a function `deepClone(obj)` that creates a deep copy of a JavaScript object. \n\n- It should handle nested objects and arrays.\n- (Bonus) Handle `Date` objects.\n- You can assume no circular references for this challenge.\n\n## Example:\n```js\nconst a = { x: 1, y: { z: 2 } };\nconst b = deepClone(a);\nb.y.z = 3;\nconsole.log(a.y.z); // 2\n```",
        "category": "frontend",
        "difficulty": "Hard",
        "languageRestriction": ["javascript"],
        "starterCode": {
            "javascript": "/**\n * @param {Object} obj\n * @return {Object}\n */\nfunction deepClone(obj) {\n  \n}"
        },
        "testHarness": {
            "javascript": "\nconst assert = require('assert');\ntry {\n    const original = { a: 1, b: { c: 2 }, d: new Date() };\n    const copy = deepClone(original);\n    \n    assert.notStrictEqual(original, copy, 'Root object reference should differ');\n    assert.notStrictEqual(original.b, copy.b, 'Nested object reference should differ');\n    assert.deepStrictEqual(original, copy, 'Content should be identical');\n    \n    copy.b.c = 999;\n    assert.strictEqual(original.b.c, 2, 'Mutation should not affect original');\n    console.log('All tests passed!');\n} catch (e) {\n    console.error(e.message);\n    process.exit(1);\n}\n"
        }
    },
    {
        "id": "py-valid-parentheses",
        "title": "Valid Parentheses",
        "description": "# Valid Parentheses\n\nGiven a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\n## Example:\n```python\nis_valid(\"()[]{}\") # True\nis_valid(\"(]\") # False\n```",
        "category": "backend",
        "difficulty": "Easy",
        "languageRestriction": ["python"],
        "starterCode": {
            "python": "def is_valid(s: str) -> bool:\n    pass"
        },
        "testHarness": {
            "python": "\nimport sys\ntry:\n    assert is_valid(\"()\") == True, \"Test Case 1 Failed\"\n    assert is_valid(\"()[]{}\") == True, \"Test Case 2 Failed\"\n    assert is_valid(\"(]\") == False, \"Test Case 3 Failed\"\n    print(\"All tests passed!\")\nexcept AssertionError as e:\n    print(str(e))\n    sys.exit(1)\n"
        }
    },
    {
        "id": "py-group-anagrams",
        "title": "Group Anagrams",
        "description": "# Group Anagrams\n\nGiven an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\n## Example:\n```python\ngroup_anagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"])\n# Output: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n```",
        "category": "backend",
        "difficulty": "Medium",
        "languageRestriction": ["python"],
        "starterCode": {
            "python": "from typing import List\n\ndef group_anagrams(strs: List[str]) -> List[List[str]]:\n    pass"
        },
        "testHarness": {
            "python": "\nimport sys\n\ntry:\n    result = group_anagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"])\n    # Sort inner lists and outer list for comparison\n    normalized = sorted([sorted(x) for x in result])\n    expected = sorted([sorted([\"bat\"]), sorted([\"nat\",\"tan\"]), sorted([\"ate\",\"eat\",\"tea\"])])\n    \n    assert normalized == expected, \"Test Case 1 Failed\"\n    print(\"All tests passed!\")\nexcept Exception as e:\n    print(f\"Error: {e}\")\n    sys.exit(1)\n"
        }
    },
    {
        "id": "py-longest-substring",
        "title": "Longest Substring No Repeats",
        "description": "# Longest Substring\n\nGiven a string `s`, find the length of the longest substring without repeating characters.\n\n## Example 1:\n```python\nlength_of_longest_substring(\"abcabcbb\") \n# Output: 3 (The answer is \"abc\")\n```\n\n## Example 2:\n```python\nlength_of_longest_substring(\"bbbbb\") \n# Output: 1 (The answer is \"b\")\n```",
        "category": "backend",
        "difficulty": "Medium",
        "languageRestriction": ["python"],
        "starterCode": {
            "python": "def length_of_longest_substring(s: str) -> int:\n    pass"
        },
        "testHarness": {
            "python": "\nimport sys\ntry:\n    assert length_of_longest_substring(\"abcabcbb\") == 3, \"Test Case 1 Failed\"\n    assert length_of_longest_substring(\"bbbbb\") == 1, \"Test Case 2 Failed\"\n    assert length_of_longest_substring(\"pwwkew\") == 3, \"Test Case 3 Failed\"\n    print(\"All tests passed!\")\nexcept AssertionError as e:\n    print(str(e))\n    sys.exit(1)\n"
        }
    },
    {
        "id": "py-lru-cache",
        "title": "LRU Cache",
        "description": "# LRU Cache\n\nDesign a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n* `__init__(self, capacity: int)` Initialize the LRU cache with positive size capacity.\n* `get(self, key: int) -> int` Return the value of the `key` if the key exists, otherwise return `-1`.\n* `put(self, key: int, value: int) -> None` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.\n\n\n",
        "category": "backend",
        "difficulty": "Hard",
        "languageRestriction": ["python"],
        "starterCode": {
            "python": "class LRUCache:\n\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass"
        },
        "testHarness": {
            "python": "\nimport sys\ntry:\n    lru = LRUCache(2)\n    lru.put(1, 1)\n    lru.put(2, 2)\n    assert lru.get(1) == 1, \"Get 1 Failed\"\n    lru.put(3, 3) # Evicts key 2\n    assert lru.get(2) == -1, \"Eviction of key 2 Failed\"\n    lru.put(4, 4) # Evicts key 1\n    assert lru.get(1) == -1, \"Eviction of key 1 Failed\"\n    assert lru.get(3) == 3, \"Get 3 Failed\"\n    assert lru.get(4) == 4, \"Get 4 Failed\"\n    print(\"All tests passed!\")\nexcept AssertionError as e:\n    print(str(e))\n    sys.exit(1)\n"
        }
    }
];

async function seedChallenges() {
    console.log('🚀 Starting to seed challenges...');

    const batch = writeBatch(db);

    for (const challenge of challenges) {
        const ref = doc(db, 'challenges', challenge.id);
        batch.set(ref, challenge);
        console.log(`   ✨ Prepared challenge: ${challenge.id}`);
    }

    await batch.commit();
    console.log('🎉 Successfully seeded all challenges!');
}

seedChallenges().catch(console.error);
