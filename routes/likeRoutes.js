const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middleware/authMiddleware');

// POST /api/likes - Like a post (requires authentication)
router.post('/', authenticate, likeController.likePost);

// DELETE /api/likes - Unlike a post (requires authentication)
router.delete('/', authenticate, likeController.unlikePost);

// GET /api/likes/post/:postId - Get like count for a post
router.get('/post/:postId', likeController.getLikesCount);

module.exports = router;

