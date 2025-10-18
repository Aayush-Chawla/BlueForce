// This file has been replaced by the new BlueForce backend service
// Please use server.js as the main entry point

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// POST /log-waste - Legacy endpoint for waste logging
app.post('/log-waste', upload.single('image'), (req, res) => {
  const { wasteType, weight } = req.body;
  const image = req.file ? req.file.filename : null;
  res.json({
    success: true,
    message: 'Waste logged successfully',
    data: {
      wasteType,
      weight,
      image,
      timestamp: new Date().toISOString()
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Legacy LogWaste service is running',
    note: 'This service is deprecated. Please use the main BlueForce backend service.'
  });
});

const PORT = 4001; // Changed port to avoid conflict with main service
app.listen(PORT, () => {
  console.log(`⚠️  Legacy LogWaste backend running on port ${PORT}`);
  console.log(`📝 Note: This is a legacy service. Use the main BlueForce backend for new features.`);
}); 