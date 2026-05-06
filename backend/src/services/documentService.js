const { Op } = require('sequelize');
const Document = require('../models/Document');
const Lease = require('../models/Lease');
const Customer = require('../models/Customer');
const Notification = require('../models/Notification');

class DocumentService {
  static async createDocument(data, createdBy) {
    const documentReference = `DOC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const document = await Document.create({
      ...data,
      document_reference: documentReference,
      created_by: createdBy
    });

    // Send notification if document is ready
    if (document.status === 'approved' || document.status === 'active') {
      await Notification.create({
        user_id: createdBy,
        customer_id: data.customer_id,
        lease_id: data.lease_id,
        notification_type: 'document_ready',
        title: 'Document Ready',
        message: `Document "${document.title}" is now available`,
        action_url: `/documents/${document.id}`
      });
    }

    return document;
  }

  static async getDocumentById(id) {
    return Document.findByPk(id, {
      include: [{
        model: Lease,
        as: 'lease',
        attributes: ['id', 'lease_reference'],
        required: false
      }, {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'contact_person', 'email'],
        required: false
      }],
      paranoid: false
    });
  }

  static async getAllDocuments(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      document_type,
      lease_id,
      customer_id,
      sortBy = 'createdAt',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { document_reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }
    if (document_type) {
      where.document_type = document_type;
    }
    if (lease_id) {
      where.lease_id = lease_id;
    }
    if (customer_id) {
      where.customer_id = customer_id;
    }

    const { count, rows } = await Document.findAndCountAll({
      where,
      include: [{
        model: Lease,
        as: 'lease',
        attributes: ['id', 'lease_reference'],
        required: false
      }, {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'contact_person', 'email'],
        required: false
      }],
      limit,
      offset,
      order: [[sortBy === 'created_at' ? 'createdAt' : sortBy, order]],
      paranoid: false
    });

    return {
      documents: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async updateDocument(id, data, updatedBy) {
    const document = await Document.findByPk(id);
    if (!document) {
      throw new Error('Document not found');
    }

    if (data.status === 'approved') {
      document.approved_by = updatedBy;
    } else if (data.status === 'rejected') {
      document.reviewed_by = updatedBy;
    }

    if (data.version && data.version > document.version) {
      document.version = data.version;
    }

    await document.update({
      ...data,
      updated_by: updatedBy
    });

    return document;
  }

  static async approveDocument(id, reviewerId, approvalNotes) {
    const document = await Document.findByPk(id);
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.status !== 'pending_review') {
      throw new Error('Document is not pending review');
    }

    await document.update({
      status: 'approved',
      reviewed_by: reviewerId,
      approved_by: reviewerId,
      review_notes: document.review_notes || '',
      approval_notes: approvalNotes,
      updated_by: reviewerId
    });

    // Send notification
    await Notification.create({
      user_id: reviewerId,
      customer_id: document.customer_id,
      lease_id: document.lease_id,
      notification_type: 'document_ready',
      title: 'Document Approved',
      message: `Document "${document.title}" has been approved`,
      action_url: `/documents/${document.id}`
    });

    return document;
  }

  static async rejectDocument(id, reviewerId, reviewNotes) {
    const document = await Document.findByPk(id);
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.status !== 'pending_review') {
      throw new Error('Document is not pending review');
    }

    await document.update({
      status: 'rejected',
      reviewed_by: reviewerId,
      review_notes: reviewNotes,
      updated_by: reviewerId
    });

    return document;
  }

  static async deleteDocument(id, deletedBy) {
    const document = await Document.findByPk(id);
    if (!document) {
      throw new Error('Document not found');
    }

    await document.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Document deleted successfully' };
  }

  static async getDocumentStatistics() {
    const totalDocuments = await Document.count({
      where: { deleted_at: null }
    });

    const byStatus = await Document.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['status']
    });

    const byType = await Document.findAll({
      attributes: [
        'document_type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['document_type']
    });

    return {
      total: totalDocuments,
      by_status: byStatus,
      by_type: byType
    };
  }
}

module.exports = DocumentService;
