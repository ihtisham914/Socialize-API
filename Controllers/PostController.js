import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js";
import mongoose from "mongoose";

// Create new Post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

// Get Single Post
export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const Post = await PostModel.findById(id);
        res.status(200).json(Post)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

// Update Post
export const updatePost = async (req, res) => {
    const PostId = req.params.id;
    const { userId } = req.body;

    try {
        const Post = await PostModel.findById(PostId);

        if (Post.userId === userId) {
            await Post.updateOne({ $set: req.body });
            res.status(200).json({ message: "Post Updated" })
        } else {
            res.status(403).json({
                message: "Action forbidden"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const Post = await PostModel.findById(id);
        if (Post.userId === userId) {
            await Post.deleteOne();
            res.status(200).json({
                message: "Post deleted"
            })
        } else {
            res.status(403).json({
                message: "Action forbidden"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

// like/dislike a post
export const likePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const Post = await PostModel.findById(postId);

        if (!Post.likes.includes(userId)) {
            await Post.updateOne({ $push: { likes: userId } });
            res.status(200).json({
                message: "Post liked"
            })
        } else {
            await Post.updateOne({ $pull: { likes: userId } });
            res.status(200).json({
                message: "Post unLiked"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

// Get Timeline Posts
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPosts = await PostModel.find({ userId: userId });
        const followingPosts = await UserModel.aggregate([
            {

                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a, b) => b.createdAt - a.createdAt));

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }

}