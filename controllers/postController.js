const { Post, User, Comment, Like } = require('../models');
const { Op } = require('sequelize');

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    
    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts with pagination and filtering
const getPosts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      tag = '', 
      userId = '' 
    } = req.query;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build where clause for filtering
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (tag) {
      whereClause.tags = { [Op.like]: `%${tag}%` };
    }
    
    if (userId) {
      whereClause.userId = userId;
    }

    // Get posts with count for pagination
    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get like counts for each post
    const postsWithLikes = await Promise.all(posts.map(async (post) => {
      const likesCount = await Like.count({ where: { postId: post.id } });
      const commentsCount = await Comment.count({ where: { postId: post.id } });
      
      return {
        ...post.toJSON(),
        likesCount,
        commentsCount
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithLikes,
        pagination: {
          total: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single post by ID
const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get like count
    const likesCount = await Like.count({ where: { postId: post.id } });
    
    // Check if the requesting user has liked this post
    let userLiked = false;
    if (req.user) {
      const userLike = await Like.findOne({
        where: { postId: post.id, userId: req.user.id }
      });
      userLiked = !!userLike;
    }

    res.status(200).json({
      success: true,
      data: {
        ...post.toJSON(),
        likesCount,
        userLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a post
const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, content, tags } = req.body;
    
    // Get the post
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is authorized to update the post
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Update post
    await post.update({
      title: title || post.title,
      content: content || post.content,
      tags: tags || post.tags
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    
    // Get the post
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is authorized to delete the post
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }
    
    // Delete post
    await post.destroy();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
};

