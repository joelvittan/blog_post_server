const { Like, Post } = require('../models');

// Like a post
const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user already liked the post
    const existingLike = await Like.findOne({
      where: {
        postId,
        userId: req.user.id
      }
    });
    
    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this post'
      });
    }
    
    // Create like
    await Like.create({
      postId,
      userId: req.user.id
    });
    
    // Get updated like count
    const likesCount = await Like.count({ where: { postId } });

    res.status(201).json({
      success: true,
      message: 'Post liked successfully',
      data: { likesCount }
    });
  } catch (error) {
    next(error);
  }
};

// Unlike a post
const unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user has liked the post
    const like = await Like.findOne({
      where: {
        postId,
        userId: req.user.id
      }
    });
    
    if (!like) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this post'
      });
    }
    
    // Delete like
    await like.destroy();
    
    // Get updated like count
    const likesCount = await Like.count({ where: { postId } });

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: { likesCount }
    });
  } catch (error) {
    next(error);
  }
};

// Get like count for a post
const getLikesCount = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get like count
    const likesCount = await Like.count({ where: { postId } });
    
    // Check if the requesting user has liked this post
    let userLiked = false;
    if (req.user) {
      const userLike = await Like.findOne({
        where: { postId, userId: req.user.id }
      });
      userLiked = !!userLike;
    }

    res.status(200).json({
      success: true,
      data: { 
        likesCount,
        userLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikesCount
};

