const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

// POST /api/comments - Create a new comment (requires authentication)
router.post('/', authenticate, commentController.createComment);

// GET /api/comments/post/:postId - Get all comments for a post
router.get('/post/:postId', commentController.getCommentsByPost);

// PUT /api/comments/:id - Update a comment (requires authentication)
router.put('/:id', authenticate, commentController.updateComment);

// DELETE /api/comments/:id - Delete a comment (requires authentication)
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;

