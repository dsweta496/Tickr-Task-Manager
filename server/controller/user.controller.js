const User = require("../model/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const handleSignupUserController = async (req, res) => {
    const body = req.body;

    if (!body.firstName || !body.email || !body.password) {
        return res
            .status(500)
            .json({ message: "All fields are Required", status: false });
    }

    try {
        console.log("body item:", body);

        const saltCount = 10;

        const hashedPassword = await bcrypt.hash(
            body.password,
            saltCount
        );

        const signUp = await User.insertOne({ ...body, password: hashedPassword });
        console.log("hashed passkey:", hashedPassword);

        if (signUp) {
            return res
                .status(201)
                .json({ message: "User Created Successfully", success: true, id: signUp._id });
        }

    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message, success: false });
    }
}

const handleSigninUserController = async (req, res) => {
    const body = req.body;

    try {
        if (!body.email || !body.password) {
            return res.status(500)
                .json({ message: "Email and password are required.", success: false })
        }
        const user = await User.findOne({ email: body.email });

        if (!user) {
            return res.status(400)
                .json({ message: "User does not exist.", success: false })
        }

        const isPasswordMatched = await bcrypt.compare(body.password, user.password);
        console.log("is password matched", isPasswordMatched);

        if (!isPasswordMatched) {
            return res.status(400)
                .json({ message: "Password Incorrect.", success: false })
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY);

        return res.status(200)
            .json({ message: "Login Successful.", success: true, token: token, firstName: user.firstName,
    lastName: user.lastName, email: user.email})
    } catch(error){
        return res.status(500)
            .json({ message: error.message, success: false })
    }
};

module.exports = { handleSigninUserController, handleSignupUserController }