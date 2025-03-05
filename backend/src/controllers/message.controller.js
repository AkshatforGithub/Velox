import User from "../models/user.model.js";
import  Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

// function for getting the users on the left side
const getUsers = async (req,res) => {
    try {
        // this is used to get the logged in users id which are using the app
        const loggedInUserId = req.user._id;

        // this is used to filter out the logged in user from the list of users means we do not show the logged in user in the list of users
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}) .select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("error in getUsers ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

// function for recieving the messages from the user 
const getMessages = async (req,res) => {
    try {
        const { id: userInChatId } = req.params;
        const loggedInUserId = req.user._id; 
    
        if (!loggedInUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    
        const chat = await Message.find({
            participants: { $all: [loggedInUserId, userInChatId] }
        }).populate("messages"); // Populate the messages array
    
        if (!chat) {
            return res.status(200).json([]); // Return an empty array if no chat found
        }
    
        res.status(200).json(chat.messages);
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
    
}

// funciton for sending the messages to the user 
const sendMessages = async (req,res) => {
    try {
        const{text,image} = req.body;
        const{id:recieverId} = req.params;
        const senderId = req._id;

// now check if the user is sending the image or not 
let imageUrl;
if(image){
    // upload the image to cloudinary if the image is present 
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;   
}

const messageGenerated = messageGenerated({
    senderId,
    recieverId,
    text,
    image:imageUrl
});

// now just save the message in the database ;

await messageGenerated.save();
res.status(201).json(messageGenerated)

    } catch (error) {
        console.log("error in message controller:",error.message);
        res.status(500).json({error:"internal server error"});
        
    }
}

// export the functions
export {getUsers};
export{getMessages};
export{sendMessages};
