# Express.js

Express is a minimal and flexible Node.js web application framework.

## Creating a Server

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
```