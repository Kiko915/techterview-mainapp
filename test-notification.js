// Test script to create a notification for testing the UI
// You can run this manually to test the notification system

async function createTestNotification() {
  const response = await fetch('https://us-central1-techterview-webapp.cloudfunctions.net/createWelcomeNotification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: 'test-user-123', // Replace with actual user ID
      displayName: 'Test User',
      email: 'test@example.com'
    })
  });

  const result = await response.json();
  console.log('Test notification created:', result);
}

// Instructions:
// 1. Replace 'test-user-123' with your actual user ID from Firebase Auth
// 2. Run: node test-notification.js
// 3. Check your notification bell in the dashboard

console.log('To create a test notification, call createTestNotification() with your user ID');