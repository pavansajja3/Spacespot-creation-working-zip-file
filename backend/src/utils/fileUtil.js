const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileUtil {
  // Generate unique filename
  static generateUniqueFilename(originalName, extension = null) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const baseName = path.basename(originalName, path.extname(originalName));
    
    return `${baseName}-${timestamp}-${random}${extension || path.extname(originalName)}`;
  }

  // Create directory if not exists
  static async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (err) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  // Read file as buffer
  static async readFile(filePath) {
    return fs.readFile(filePath);
  }

  // Write file
  static async writeFile(filePath, data, options = {}) {
    const dirPath = path.dirname(filePath);
    await this.ensureDirectory(dirPath);
    
    return fs.writeFile(filePath, data, options);
  }

  // Delete file
  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }

  // Delete multiple files
  static async deleteFiles(filePaths) {
    return Promise.all(filePaths.map(filePath => this.deleteFile(filePath)));
  }

  // Move file
  static async moveFile(sourcePath, destPath) {
    await this.ensureDirectory(path.dirname(destPath));
    return fs.rename(sourcePath, destPath);
  }

  // Copy file
  static async copyFile(sourcePath, destPath) {
    await this.ensureDirectory(path.dirname(destPath));
    return fs.copyFile(sourcePath, destPath);
  }

  // Check if file exists
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Get file size
  static async getFileSize(filePath) {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  // Get file extension
  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  // Get file MIME type
  static getFileMimeType(filename) {
    const ext = this.getFileExtension(filename);
    
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.rtf': 'application/rtf',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  // Sanitize filename
  static sanitizeFilename(filename) {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/(^_)|(_$)/g, '');
  }

  // Get file info
  static async getFileInfo(filePath) {
    const stats = await fs.stat(filePath);
    
    return {
      name: path.basename(filePath),
      size: stats.size,
      mimeType: this.getFileMimeType(path.basename(filePath)),
      created: stats.birthtime,
      modified: stats.mtime,
      accessed: stats.atime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  }

  // Get relative path from base directory
  static getRelativePath(filePath, baseDir) {
    return path.relative(baseDir, filePath);
  }

  // Join paths safely
  static safeJoin(base, ...parts) {
    return path.join(base, ...parts.map(p => this.sanitizeFilename(path.basename(p))));
  }

  // Clean up old files based on age
  static async cleanupOldFiles(directory, maxAgeDays = 30) {
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    try {
      const files = await fs.readdir(directory);
      
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          console.log(`Deleted old file: ${filePath}`);
        }
      }
    } catch (err) {
      console.error('Error cleaning up old files:', err);
    }
  }

  // Hash file content
  static async hashFile(filePath, algorithm = 'sha256') {
    const fileContent = await this.readFile(filePath);
    return crypto.createHash(algorithm).update(fileContent).digest('hex');
  }

  // Generate checksum
  static generateChecksum(data, algorithm = 'md5') {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  // Validate file against MIME type
  static validateMimeType(filePath, allowedMimeTypes) {
    const mimeType = this.getFileMimeType(path.basename(filePath));
    return allowedMimeTypes.includes(mimeType);
  }

  // Get unique ID for filename
  static generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  // Encode file path for URL
  static encodePath(filePath) {
    return Buffer.from(filePath).toString('base64');
  }

  // Decode file path from URL
  static decodePath(encodedPath) {
    return Buffer.from(encodedPath, 'base64').toString('utf8');
  }
}

module.exports = FileUtil;
