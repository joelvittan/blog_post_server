const { Comment, User } = require('../models');

// Create a new comment
const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    
    const comment = await Comment.create({
      content,
      postId,
      userId: req.user.id
    });

    // Fetch the created comment with user information
    const newComment = await Comment.findByPk(comment.id, {
      include: {
        model: User,
        attributes: ['id', 'name', 'email']
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: newComment
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments for a post
const getCommentsByPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    
    const comments = await Comment.findAll({
      where: { postId },
      include: {
        model: User,
        attributes: ['id', 'name', 'email']
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// Update a comment
const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    
    // Get the comment
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is authorized to update the comment
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }
    
    // Update comment
    await comment.update({ content });

    // Fetch the updated comment with user information
    const updatedComment = await Comment.findByPk(comment.id, {
      include: {
        model: User,
        attributes: ['id', 'name', 'email']
      }
    });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    
    // Get the comment
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is authorized to delete the comment
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    // Delete comment
    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
};

