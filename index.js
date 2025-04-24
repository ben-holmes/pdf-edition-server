const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('downloads'));

const counterPath = path.join(__dirname, 'counter.txt');

// Make sure the counter file exists
if (!fs.existsSync(counterPath)) {
  fs.writeFileSync(counterPath, '0');
}

// Get current counter value
function getCounter() {
  return parseInt(fs.readFileSync(counterPath, 'utf8'), 10);
}

// Increment and save new counter value
function incrementCounter() {
  const count = getCounter() + 1;
  fs.writeFileSync(counterPath, count.toString());
  return count;
}

app.get('/download', (req, res) => {
  const count = incrementCounter();
  const edition = String(count).padStart(3, '0');
  const originalFile = path.join(__dirname, 'originals', 'KarenEliot_BenjaminHolmes.pdf');
  const renamedFile = path.join(__dirname, 'downloads', `KarenEliot_BenjaminHolmes_${edition}.pdf`);

  fs.copyFile(originalFile, renamedFile, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error processing download.');
    }

    res.download(renamedFile, (err) => {
      if (err) console.error(err);
      // Delete the renamed file after download
      fs.unlink(renamedFile, () => {});
    });
  });
});

app.listen(3000, () => {
  console.log('🎉 Server running at http://localhost:3000');
});
