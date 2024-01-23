import express from 'express';
import { deleteUser, followUser, getUser, unFollowUser, updateUser } from '../Controllers/UserController.js';

const router = express.Router();

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

router.route('/follow/:id').patch(followUser);
router.route('/unfollow/:id').patch(unFollowUser);


export default router;