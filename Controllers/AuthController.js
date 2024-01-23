import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt';


// Registering new User
export const registerUser = async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ username, password: hashedPass, firstName, lastName });

    try {
        await newUser.save();
        const { password, ...otherDetails } = newUser._doc;
        res.status(200).json(otherDetails);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Login User
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const User = await UserModel.findOne({ username });

        if (User) {
            const validate = await bcrypt.compare(password, User.password);

            validate ? res.status(200).json(User) : res.status(400).json({ message: "Incorrect username or password!" })
        } else {
            res.status(404).json({
                message: "user does not exits"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" })
    }

}
