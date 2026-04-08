const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    renderLanding, 
    renderEditor, 
    generateBulk 
} = require('../controller/certController');

// Multer setup for Excel uploads
const upload = multer({ dest: 'uploads/' });

// Landing Page
router.get("/", renderLanding);

// Editor Page
router.get('/editor/:templateId', renderEditor);

// The Form Submission (Bulk Generation)
router.post('/generate-bulk', upload.single('excelFile'), generateBulk);

module.exports = router;