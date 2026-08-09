const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
require("dotenv").config();

const authMiddleware = async(req, res, next) =>{
    const authHaeder = req.headers.authorization;

    try{
        if(!authHaeder||!authHaeder.startsWith("Bearer ")){
            return res
            .status(402).json({message:"Invalid token.", success:false})
        }

        const token = authHaeder.split(' ')[1];

        const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

        if(!verifiedToken){
            return res
            .status(401).json({message:"Invalid token.", success:false})
        }

        const verifiedUser = await User.findOne({email:verifiedToken.email}).select("-password");

        if(!verifiedUser){
            return res
            .status(401).json({message:"Not a valid user.", success:false})
        }

        req.User = verifiedUser;
        next();

    }catch(error){
        if(error.name =="TokenExpiredError"){
          return res
            .status(401).json({message:"Token Expired.", success:false})
        }
        if(error.name =="JsonWebTokenError"){
          return res
            .status(401).json({message:"Authentication Failed.", success:false})
        }
            return res
            .status(500).json({message:error.message, success:false})
        
    }
}

module.exports = authMiddleware;