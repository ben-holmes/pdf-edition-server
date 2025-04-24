// Redeploy trigger comment
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

let counter = 0; // in-memory edition counter

app.get('/download', (req, res) => {
  counter++;
  const edition = String(counter).padStart(3, '0');
  const filename = `KarenEliot_BenjaminHolmes_${edition}.pdf`;

  // PDF path inside public folder
  const filePath = path.join(__dirname, 'public', 'KarenEliot_BenjaminHolmes.pdf');

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(500).send('PDF not found on server.');
  }

  // Set headers to force download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Stream the file to the user
  fs.createReadStream(filePath).pipe(res);
});

// Vercel doesn't use listen() in deployment, so this is just for local dev
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
  });
}

module.exports = app; // Vercel needs this export