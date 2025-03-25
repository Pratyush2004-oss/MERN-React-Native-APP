import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
}

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password is too short" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username is too short" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // check for email or username exists 
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // get random avatar
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`

        const user = new User({ username, email, password, profileImage });
        await user.save();

        const token = generateToken(user._id);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.log("Error in Signup controller : ", error);
        next(error);
    }

}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // generate token
        const token = generateToken(user._id);
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.log("Error in Login controller : ", error);
        next(error);
    }

}
