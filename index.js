const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('downloads'));

let count = 0;

function getCounter() {
  return count;
}

function incrementCounter() {
  count += 1;
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
