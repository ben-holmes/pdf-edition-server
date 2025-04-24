const fs = require('fs');
const path = require('path');

let counter = 0; // Edition counter (resets on redeploy)

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  counter++;
  const edition = String(counter).padStart(3, '0');
  const filename = `KarenEliot_BenjaminHolmes_${edition}.pdf`;

  const filePath = path.join(process.cwd(), 'public', 'KarenEliot_BenjaminHolmes.pdf');

  if (!fs.existsSync(filePath)) {
    return res.status(500).send('PDF not found on server.');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  fs.createReadStream(filePath).pipe(res);
};