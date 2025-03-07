const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');

// POST /api/posts - Create a new post (requires authentication)
router.post('/', authenticate, postController.createPost);

// GET /api/posts - Get all posts
router.get('/', postController.getPosts);

// GET /api/posts/:id - Get a single post by ID
router.get('/:id', postController.getPostById);

// PUT /api/posts/:id - Update a post (requires authentication)
router.put('/:id', authenticate, postController.updatePost);

// DELETE /api/posts/:id - Delete a post (requires authentication)
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;

