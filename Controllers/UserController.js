import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt';

// Get Single User
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const User = await UserModel.findById(id);
        if (User) {
            const { password, ...otherDetails } = User._doc;

            res.status(200).json(otherDetails);
        } else {
            res.status(404).json(
                {
                    message: "No such user exists!"
                }
            )
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" })
    }
}

// Update User
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const User = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

            res.status(200).json(User);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(403).json({
            message: "You are not authorized to access this resource!"
        })
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json({
                message: "User deleted successfully"
            })
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(403).json({
            message: "You are not authorized to access this resource!"
        })
    }

}

// Follow User
export const followUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;
    if (currentUserId === id) {
        res.status(403).json({
            message: "Action forbidden"
        })
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } });
                await followingUser.updateOne({ $push: { following: id } });

                res.status(200).json("User followed!");
            } else {
                res.status(403).json("Already following")
            }
        } catch (error) {
            res.status(403).json({
                message: "Something went wrong!"
            })
        }
    }
}

//  Unfollow User
export const unFollowUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;
    if (currentUserId === id) {
        res.status(403).json({
            message: "Action forbidden"
        })
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $pull: { followers: currentUserId } });
                await followingUser.updateOne({ $pull: { following: id } });

                res.status(200).json("User Unfollowed!");
            } else {
                res.status(403).json("You are not following this user")
            }
        } catch (error) {
            res.status(403).json({
                message: "Something went wrong!"
            })
        }
    }
}