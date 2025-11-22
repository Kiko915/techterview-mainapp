# The Event Loop

The Event Loop is one of the most important aspects to understand about JavaScript.

1. **Call Stack**: Where your code executes.
2. **Web APIs**: Where async operations (DOM, AJAX, setTimeout) are handled.
3. **Callback Queue**: Where callbacks wait to be pushed to the stack.
4. **Event Loop**: Checks if stack is empty and pushes from queue.