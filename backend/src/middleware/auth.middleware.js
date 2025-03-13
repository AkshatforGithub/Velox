import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// a safety function which will check if the user is present in the database  or not and get the user id but not the password
 const protectRoute = async (req,res,next) => {
    try {

    // firstly check for the jwt token meaning check if the user is logged in or not

    const token =  req.cookies.jwt
    if(!token){
        return res.status(401).json({message:"Unauthorized access"})
    }

    // if it is present then we have to decode the user id from the token as token is difficult to understand on its own

    const decoded = jwt.verify(token,process.env.JWT_TOKEN);

    if(!decoded){
        return res.status(401).json({message:"Token is invalid"})
    }


    // find the user in the database and get the user id but without the password

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;

    // call the next funtion in line which is in this case is update profile 

    next();
}

    catch (error) {
        console.log("error in protectRoute middleware",error.message);
        res.status(500).json({message:"Its Our fault "});        
    }
}
export { protectRoute };