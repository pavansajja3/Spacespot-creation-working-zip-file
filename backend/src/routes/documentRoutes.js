const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
const Document = require('../models/Document');

const { 
  validateCreateDocument, 
  validateUpdateDocument 
} = require('../validations/validation');

const DocumentService = require('../services/documentService');


// ✅ UPLOAD DOCUMENT
router.post('/upload', authenticate, upload.single('documents'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document uploaded'
      });
    }

    const fileUrl = `/uploads/spaces/documents/${req.file.filename}`;

    const document = await Document.create({
      document_reference: `DOC-${Date.now()}`,
      lease_id: req.body.lease_id || null,
      customer_id: req.body.customer_id || null,
      document_type: req.body.document_type || 'other',
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      file_url: fileUrl,
      file_name: req.file.originalname,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      created_by: req.user.id,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ GET ALL DOCUMENTS
router.get('/', authenticate, async (req, res) => {
  try {
    const documents = await DocumentService.getAllDocuments(req.query);
    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ GET BY ID (KEEP LAST)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const document = await DocumentService.getDocumentById(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// OTHER ROUTES (NO CHANGE)
router.post('/', authenticate, validateCreateDocument, async (req, res) => {
  try {
    const document = await DocumentService.createDocument(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', authenticate, validateUpdateDocument, async (req, res) => {
  try {
    const document = await DocumentService.updateDocument(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await DocumentService.deleteDocument(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;