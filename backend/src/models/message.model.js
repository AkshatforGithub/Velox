import mongoose from "mongoose";


// structure of the database for the messages fucntionality
const messageschema = new mongoose.Schema(
    {
        senderId :{
            // the type is basically acts as a foreign key i.e it can generate the id of the user from the user collection 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text :{
            type: String,
        },
        image:{
            type: String,
        },
    },
    {timestamps:true}
);

const Message = mongoose.model("Message" , messageschema)

export default Message;