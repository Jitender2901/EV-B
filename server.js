const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve additional directories like scripts, images, etc.
app.use('/Data', express.static(path.join(__dirname, 'Data')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Fallback route for undefined paths, should come after static file middleware
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
