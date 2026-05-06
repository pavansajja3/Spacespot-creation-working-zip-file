const path = require('path');
const config = require('../config/app');

class LogUtils {
  // Get log directory
  static getLogDir() {
    return path.join(config.LOG_DIR || './logs');
  }

  // Create log directory if not exists
  static ensureLogDir() {
    const fs = require('fs').promises;
    const logDir = this.getLogDir();
    
    return fs.access(logDir)
      .catch(() => fs.mkdir(logDir, { recursive: true }));
  }

  // Get timestamp for filename
  static getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/:/g, '-').split('.')[0];
  }

  // Get date for filename
  static getDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  // Generate log filename
  static getLogFileName(type = 'app') {
    return `${type}-${this.getDate()}.log`;
  }

  // Get log file path
  static getLogFilePath(type = 'app') {
    const logDir = this.getLogDir();
    const fileName = this.getLogFileName(type);
    return path.join(logDir, fileName);
  }

  // Write to log file
  static async writeLog(message, level = 'INFO', type = 'app') {
    await this.ensureLogDir();
    
    const fs = require('fs').promises;
    const logFilePath = this.getLogFilePath(type);
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    return fs.appendFile(logFilePath, logEntry);
  }

  // Log to file
  static async log(message, level = 'INFO') {
    try {
      await this.writeLog(message, level);
    } catch (err) {
      console.error('Failed to write log:', err);
    }
  }

  // Log with stack trace
  static async logWithStack(message, error) {
    const stack = error?.stack || 'No stack trace available';
    await this.log(`${message}\n${stack}`, 'ERROR');
  }

  // Info log
  static async info(message) {
    await this.log(message, 'INFO');
    console.log(`[INFO] ${message}`);
  }

  // Error log
  static async error(message, error) {
    await this.logWithStack(message, error);
    console.error(`[ERROR] ${message}`, error);
  }

  // Debug log
  static async debug(message) {
    if (config.ENV === 'development' || config.ENV === 'test') {
      await this.log(message, 'DEBUG');
      console.debug(`[DEBUG] ${message}`);
    }
  }

  // Warning log
  static async warn(message) {
    await this.log(message, 'WARN');
    console.warn(`[WARN] ${message}`);
  }

  // Fatal log
  static async fatal(message, error) {
    await this.logWithStack(message, error);
    console.error(`[FATAL] ${message}`, error);
  }

  // Log request
  static async logRequest(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;
      this.log(logMessage, res.statusCode >= 400 ? 'WARN' : 'INFO');
    });

    next();
  }

  // Log database query
  static async logQuery(query, params = [], duration) {
    const message = `SQL: ${query}\nParams: ${JSON.stringify(params)}\nDuration: ${duration}ms`;
    await this.log(message, 'DEBUG');
  }

  // Log API call
  static async logApiCall(endpoint, method, responseTime, status) {
    const message = `${method} ${endpoint} ${status} ${responseTime}ms`;
    await this.log(message, status >= 400 ? 'WARN' : 'INFO');
  }

  // Log user action
  static async logUserAction(userId, action, details = {}) {
    const message = `User ${userId} performed action: ${action}`;
    if (Object.keys(details).length > 0) {
      message += ` Details: ${JSON.stringify(details)}`;
    }
    await this.log(message, 'INFO');
  }

  // Log security event
  static async logSecurityEvent(eventType, details = {}) {
    const message = `Security Event: ${eventType}`;
    if (Object.keys(details).length > 0) {
      message += ` Details: ${JSON.stringify(details)}`;
    }
    await this.log(message, 'WARN');
  }

  // Clear old logs
  static async clearOldLogs(daysToKeep = 30) {
    const fs = require('fs').promises;
    const logDir = this.getLogDir();
    const now = Date.now();
    const daysToKeepMs = daysToKeep * 24 * 60 * 60 * 1000;

    try {
      const files = await fs.readdir(logDir);
      
      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtimeMs > daysToKeepMs) {
            await fs.unlink(filePath);
            console.log(`Deleted old log: ${filePath}`);
          }
        }
      }
    } catch (err) {
      console.error('Error clearing old logs:', err);
    }
  }

  // Get log statistics
  static async getLogStats() {
    const fs = require('fs').promises;
    const logDir = this.getLogDir();
    const stats = {};

    try {
      const files = await fs.readdir(logDir);
      
      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const fileStats = await fs.stat(filePath);
          
          stats[file] = {
            size: fileStats.size,
            modified: fileStats.mtime,
            path: filePath
          };
        }
      }
    } catch (err) {
      console.error('Error getting log stats:', err);
    }

    return stats;
  }
}

module.exports = LogUtils;
