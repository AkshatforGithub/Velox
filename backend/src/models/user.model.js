import mongoose from "mongoose";


// function for the database for the users
const userschema = new mongoose.Schema(
    {
        email :{
            type: String,
            required: true,
            unique:true,
        },
        fullname :{
            type: String,
            required: true,
        },
        password :{
            type: String,
            required: true,
            minlength: 6,
        },
        profilepicture:{
            type: String,
            default:"",
        },
    },
    {timestamps:true}
);

const User = mongoose.model("User" , userschema)

export default User;