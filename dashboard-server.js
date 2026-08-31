const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dashboard/dist
app.use(express.static(path.join(__dirname, 'dashboard', 'dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dashboard server running on port ${PORT}`);
});
