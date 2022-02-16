const { createPost, getAllPosts, getPostById, deletePost } = require('../controllers/post');

const router = require('express').Router();

router.route('/').post(createPost).get(getAllPosts);
router.route('/:postId').get(getPostById).delete(deletePost);

module.exports = router;