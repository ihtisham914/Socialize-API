import express from 'express';
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from '../Controllers/PostController.js';

const router = express.Router();

router.route('/').post(createPost).get(getPost);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);

router.route('/like/:id').patch(likePost);
router.route('/timeline/:id').get(getTimelinePosts);

export default router;