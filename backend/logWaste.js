const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// POST /log-waste
app.post('/log-waste', upload.single('image'), (req, res) => {
  const { wasteType, weight } = req.body;
  const image = req.file ? req.file.filename : null;
  res.json({
    message: 'Waste logged (mock)',
    data: {
      wasteType,
      weight,
      image,
    },
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`LogWaste backend running on port ${PORT}`);
}); 