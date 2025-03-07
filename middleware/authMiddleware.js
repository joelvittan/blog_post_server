const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication middleware
const authenticate = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. No token provided or invalid token format.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid token.'
    });
  }
};

// Authorization middleware - Checks if user is the owner of the resource
const authorize = (model, idParamName) => {
  return async (req, res, next) => {
    try {
      // Get resource ID from request parameters
      const resourceId = req.params[idParamName];
      
      // Find the resource
      const resource = await model.findByPk(resourceId);
      
      // Check if resource exists
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Check if user is the owner of the resource
      if (resource.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to perform this action'
        });
      }
      
      // Add resource to request object
      req.resource = resource;
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize
};

