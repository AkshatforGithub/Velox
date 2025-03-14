import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


// function for the signing up the new user 
export const signup = async(req,res) => {
    const {fullname,email,password} = req.body
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
          }
      
        if(password.length < 6){
            return res.status(400).json({message :"You are bigger than 6 but it is not good here:shorten your pass "});
        }

        const user = await User .findOne({email})

        if(user){
            return res.status(400).json({message :"You already exist lil bro try diff one"});

        }

        // hashing the password

            const salt  = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)


        const newUser = new User({
            fullname,
            email,
            password:hashedPassword
        })
        if(newUser){
            // jwt token in utils
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id : newUser ._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilepicture:newUser.profilepicture,  
            });
        }
        else{
            return res.status(400).json({message :"details are wrong buddy try again"});
        }

    } catch (error) {
        console.log("error in signup controller",error.message);
        res.status(500).json({message:"Its Our fault "});
    }
};


// function for the loging in the existing user by using jwt authentication 
export const login = async(req,res) => {
    const{password,email} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})//we do not pass the "incorrect password aur username so that fraud do not know what they are entering wrong "
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }
// if email and password is correct 
        generateToken(user ._id,res)
        res.status(201).json({
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilepicture: user.profilepicture,
        });

    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({message:"Its Our fault "});
    }
};


// function for loggingout which will not delete the data but just remove the cookies sent to the user making it easier to login again
export const logout = async(req,res) => {
    
    // for logout we will just remove the cookies

    try {
        res.cookie("jwt" , "" ,{maxAge:0})
        return res.status(200).json({message:"Logged Out Succesfully"})
    } catch (error) {
        console.log("error in logout controller",error.message);
        if(!res.headersSent){
            res.status(500).json({message:"Its Our fault "});
        }
    }
};


// function for updating the profile by the existing user it also checks for the existence
export const UpdateProfile = async(req,res) =>{
    try {
        const{profilepicture} = req.body;
        const userId = req.user._id;


        if(!profilepicture){
            return res.status(400).json({message:"profile picture is required"});
        } 

       const uploadResponse= await cloudinary.uploader.upload(profilepicture);
       await User.findByIdAndUpdate(userId ,
        {profilepicture:uploadResponse.secure_url},
        {new:true}
       );

       res.status(200).json({message:"Profile pictures has been updated"})

    } catch (error) {
        console.log("error in update porfile controller :",error);
        res.status(500).json({message:"Internal server error that is it us our fault"});
        
    }
};


export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);    
    } catch (error) {
        console.log("error in checkAuth:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

};