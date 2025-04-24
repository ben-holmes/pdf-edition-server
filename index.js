const express = require('express');
const https = require('https');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

let counter = 0; // stored in memory

app.get('/download', (req, res) => {
  counter++;
  const edition = String(counter).padStart(3, '0');
  const filename = `KarenEliot_BenjaminHolmes_${edition}.pdf`;

  const fileUrl = 'https://pdf-edition-server.vercel.app/KarenEliot_BenjaminHolmes.pdf'; // Update with your actual URL if needed

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