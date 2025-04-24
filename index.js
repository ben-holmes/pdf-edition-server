const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('public'));

const counterPath = path.join(__dirname, 'counter.txt');

// Make sure the counter file exists
if (!fs.existsSync(counterPath)) {
  fs.writeFileSync(counterPath, '0');
}

// Get current counter value
function getCounter() {
  return parseInt(fs.readFileSync(counterPath, 'utf8'), 10);
}

// Increment and return new counter value
function incrementCounter() {
  const count = getCounter() + 1;
  fs.writeFileSync(counterPath, count.toString());
  return count;
}

// Updated download route
app.get('/download', (req, res) => {
  const count = incrementCounter();
  const edition = String(count).padStart(3, '0');
  const filename = `KarenEliot_BenjaminHolmes_${edition}.pdf`;

  const fileUrl = 'https://pdf-edition-server.vercel.app/KarenEliot_BenjaminHolmes.pdf'; // Replace with your actual domain if different

  https.get(fileUrl, (fileRes) => {
    if (fileRes.statusCode !== 200) {
      return res.status(500).send('Could not retrieve PDF.');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    fileRes.pipe(res);
  }).on('error', (err) => {
    console.error(err);
    res.status(500).send('Error downloading PDF.');
  });
});

app.listen(3000, () => {
  console.log('🎉 Server running at http://localhost:3000');
});
