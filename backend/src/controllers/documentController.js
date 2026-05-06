const DocumentService = require('../services/documentService');
const { validateCreateDocument } = require('../validations/validation');

class DocumentController {
  // GET /api/documents - Get all documents with filters
  static async getAllDocuments(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        documentType,
        customerId,
        unitId,
        leaseId,
        sortBy = 'createdAt'
        order = 'DESC'
      } = req.query;

      const documents = await DocumentService.getAllDocuments({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        documentType,
        customerId,
        unitId,
        leaseId,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error('Error in getAllDocuments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch documents',
        error: error.message
      });
    }
  }

  // GET /api/documents/:id - Get document by ID
  static async getDocumentById(req, res) {
    try {
      const { id } = req.params;
      const document = await DocumentService.getDocumentById(id);

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
      console.error('Error in getDocumentById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch document',
        error: error.message
      });
    }
  }

  // POST /api/documents - Create new document
  static async createDocument(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const document = await DocumentService.createDocument(body, userId);

      res.status(201).json({
        success: true,
        message: 'Document created successfully',
        data: document
      });
    } catch (error) {
      console.error('Error in createDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create document',
        error: error.message
      });
    }
  }

  // PUT /api/documents/:id - Update document
  static async updateDocument(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;
      const userId = req.user.id;

      const document = await DocumentService.updateDocument(id, body, userId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.json({
        success: true,
        message: 'Document updated successfully',
        data: document
      });
    } catch (error) {
      console.error('Error in updateDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update document',
        error: error.message
      });
    }
  }

  // DELETE /api/documents/:id - Soft delete document
  static async deleteDocument(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await DocumentService.deleteDocument(id, userId);

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete document',
        error: error.message
      });
    }
  }

  // PUT /api/documents/:id/upload - Upload document file
  static async uploadDocument(req, res) {
    try {
      const { id } = req.params;
      
      // Handle file upload logic here
      const uploadResult = await DocumentService.uploadFile(id, req.file);

      res.json({
        success: true,
        message: 'Document uploaded successfully',
        data: uploadResult
      });
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to upload document',
        error: error.message
      });
    }
  }

  // GET /api/documents/:id/download - Download document file
  static async downloadDocument(req, res) {
    try {
      const { id } = req.params;

      const file = await DocumentService.downloadFile(id);

      res.download(file.path, file.originalname);
    } catch (error) {
      console.error('Error in downloadDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to download document',
        error: error.message
      });
    }
  }

  // PUT /api/documents/:id/approve - Approve document
  static async approveDocument(req, res) {
    try {
      const { id } = req.params;
      const { approvalNotes } = req.body;
      const userId = req.user.id;

      const document = await DocumentService.approveDocument(id, approvalNotes, userId);

      res.json({
        success: true,
        message: 'Document approved successfully',
        data: document
      });
    } catch (error) {
      console.error('Error in approveDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to approve document',
        error: error.message
      });
    }
  }

  // PUT /api/documents/:id/reject - Reject document
  static async rejectDocument(req, res) {
    try {
      const { id } = req.params;
      const { rejectionReason, rejectionNotes } = req.body;
      const userId = req.user.id;

      const document = await DocumentService.rejectDocument(id, rejectionReason, rejectionNotes, userId);

      res.json({
        success: true,
        message: 'Document rejected',
        data: document
      });
    } catch (error) {
      console.error('Error in rejectDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to reject document',
        error: error.message
      });
    }
  }

  // GET /api/documents/related - Get related documents
  static async getRelatedDocuments(req, res) {
    try {
      const { customerId, unitId, leaseId } = req.query;

      const documents = await DocumentService.getRelatedDocuments(customerId, unitId, leaseId);

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error('Error in getRelatedDocuments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch related documents',
        error: error.message
      });
    }
  }

  // GET /api/documents/expiration - Get documents expiring soon
  static async getExpiringDocuments(req, res) {
    try {
      const { days = 30 } = req.query;

      const documents = await DocumentService.getExpiringDocuments(parseInt(days));

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error('Error in getExpiringDocuments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expiring documents',
        error: error.message
      });
    }
  }
}

module.exports = DocumentController;
