const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const qr = require('qr-image');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

// Generate QR Code for Text
app.post('/generate-qr-text', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Text is required');

  const qr_svg = qr.image(text, { type: 'svg' });
  res.type('svg');
  qr_svg.pipe(res);
});

// Generate QR Code for Image (upload first)
app.post('/generate-qr-image', upload.single('image'), (req, res) => {
    const imagePath = req.file?.path;
    
    if (!imagePath) {
      return res.status(400).send('Image file is required');
    }
  
    // Generate QR code with the image path or name encoded in it
    const qr_svg = qr.image(imagePath, { type: 'svg' });
    res.type('svg');
    qr_svg.pipe(res);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
