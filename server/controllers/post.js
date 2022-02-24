const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const uuid = require('uuid').v4;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  createPost
  .post('/') 
  req.body {text, location, picURL}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const createPost = async (req, res) => {
  const { text, location, picURL } = req.body;

  if (!text.length) return res.status(401).send('Text must be at least one character');

  try {
    const newPost = {
      user: req.userId,
      text,
    }

    if (location) newPost.location = location;
    if (picURL) newPost.picURL = picURL;

    const post = await new PostModel(newPost).save();
    const postCreated = await PostModel.findById(post._id).populate('user');

    return res.status(200).json(postCreated);
  } catch (error) {
    return res.status(500).send('Server error at createPost in server/controllers/post');
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getAllPosts
  .get('/')
  req.query {page} \\ help w/ pagination
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const getAllPosts = async (req, res) => {
  const { page } = req.query;

  const pageNum = Number(page);
  const size = 8;

  try {
    let posts;

    if (pageNum === 1) {
      posts = await PostModel.find()
        .limit(size)
        .sort({ createAt: -1 })
        .populate('user')
        .populate('comments.user');
    } else {
      const skips = size * (pageNum - 1);
      posts = await PostModel.find()
        .skip(skips)
        .limit(size)
        .sort({ createAt: -1 })
        .populate('user')
        .populate('comments.user');
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at getAllPosts in server/controllers/post");
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getPostById
  .get('/:postId')
  req.params {postId}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate('user')
      .populate('comments.user');
    if (!post) return res.status('403').send("Post not found");
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at getPostById in server/controllers/post");
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  deletePost
  .delete('/:postId')
  req.params {postId}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const deletePost = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(403).send("Post not found");

    const user = await UserModel.findById(userId);
    if (post.user.toString() !== userId) {
      if (user.role === 'admin') {
        await post.remove()
        return res.status(200).send("Post successfully deleted");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await post.remove();
    return res.status(200).send("Post successfully deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at deletePost in server/controllers/post");
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  likePost
  .post('/like/:postId')
  req.params {postId}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const likePost = async (req, res) => {
  console.log('Liked post');
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId)
    if (!post) return res.status(403).send("Post not found");

    const isLiked = post.likes.find((like) => like.user.toString() === userId);
    if (isLiked) return res.status(401).send('Post already liked')

    await post.likes.unshift({ user: userId });
    await post.save();

    return res.status(200).send("Post liked successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at likePost in server/controllers/post");
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  unlikePost
  .put('/like/:postId')
  req.params {postId}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send("Post not found");

    const likedIndex = post.likes.findIndex((like) => like.user.toString() === userId);

    if (likedIndex === -1) return res.status(403).send('Post not liked');

    await post.likes.splice(likedIndex, 1);
    await post.save();

    return res.status(200).send('Post unliked successfully');

  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at unlikePost in server/controllers/post");
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getAllPostLikes
  .get('/like/:postId')
  req.params {postId}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const getAllLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate('likes.user');
    if (!post) return res.status(403).send("Post not found");

    return res.status(200).json(post.likes);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at unlikePost in server/controllers/post");
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  createComment
  .post('/comment/:postId')
  req.params {postId}
  req.body {text}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const createComment = async (req, res) => {
  try {
    const {postId} = req.params;
    const {text} = req.body;

    if (!text) return res.status(403).send("Text is required");
    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send("Post not found");

    const newComment = {
      user: req.userId,
      _id: uuid(),
      text
    };

    await post.comments.unshift(newComment);
    await post.save();

    return res.status(200).json(newComment._id);

  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at createComment in server/controllers/post");
  }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  deleteComment
  .delete('/comment/:postId/:commentId')
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const deleteComment = async (req, res) => {
  try {
    const {postId, commentId} = req.params;
    const {userId} = req;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send("Post not found");

    const comment = post.comments.find((comment) => comment._id === commentId);
    if (!comment) return res.status(403).send("Comment not found");

    const user = await UserModel.findById(userId);

    const deleteComment = async () => {
      const indexOf = post.comments.indexOf(comment);
      await post.comments.splice(indexOf, 1);
      await post.save();

      return res.status(200).send("Comment deleted sucessfully");
    }

    if(comment.user.toString() !== userId) {
      if(user.role === 'admin') {
        await deleteComment();
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await deleteComment();

  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error at deleteComment in server/controllers/post")
  }
}

module.exports = { deleteComment, createComment, createPost, getAllPosts, getPostById, deletePost, likePost, unlikePost, getAllLikes };
