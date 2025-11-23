
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, '..', 'service-account-key.json');

if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({
        credential: cert(serviceAccount)
    });
} else {
    console.log("⚠️ Service account key not found. Trying application default credentials...");
    initializeApp({
        credential: applicationDefault(),
        projectId: "techterview-webapp" // Replace with your actual project ID if known, or remove if using default
    });
}

const db = getFirestore();

const challenges = [
    {
        id: "js-counter-closure",
        title: "Counter Closure",
        description: `
# Counter Closure

Implement a function \`createCounter\` that accepts an integer \`n\`. 
It should return another function that, when called, returns \`n\` initially, and then \`n + 1\`, \`n + 2\`, etc.

## Example 1:
\`\`\`
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
\`\`\`
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
\`\`\`
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
    }
];

async function seedChallenges() {
    console.log('🚀 Starting to seed challenges...');

    const batch = db.batch();

    for (const challenge of challenges) {
        const ref = db.collection('challenges').doc(challenge.id);
        batch.set(ref, challenge);
        console.log(`   ✨ Prepared challenge: ${challenge.id}`);
    }

    await batch.commit();
    console.log('🎉 Successfully seeded all challenges!');
}

seedChallenges().catch(console.error);
