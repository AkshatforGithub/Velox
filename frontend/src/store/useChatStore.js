import { create } from "zustand";
import toast from "react-hot-toast";
import {instance} from "../lib/axios"
import useAuth from "./useAuth";


export const useChatStore = create((set,get) => ({
    messages: [],
    users:[],
    selectedUser: null,
    isUserLoading : false,
    isMessagesLoading : false,

    getUsers: async () => {
        set({isUserLoading: true})
        try {
            const res = await instance.get("/messages/users")
            set({users: res.data})
        } catch (error) {
            toast.error("Failed to fetch users")
        }
        set({isUserLoading: false})
    },


    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
    
        try {
            const res = await instance.get(`/messages/${userId}`);
            set({ messages: Array.isArray(res.data) ? res.data : [] }); // ✅ Ensure it's always an array
        } catch (error) {
            toast.error("Failed to fetch messages");
            set({ messages: [] }); // ✅ Reset messages to an empty array on failure
        } finally {
            set({ isMessagesLoading: false }); // ✅ Ensures state is always updated
        }
    },
    

    sendMessage: async (messageData) => {
        const{selectedUser,messages} = get();
        try {
            const res = await instance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // subscribing the messages or sockets bhida rahe hai ek dsure users se after login
    subscribeToUser: async () => {

        // get the selected user from the store
        const{selectedUser} =get();

        // if there is no selected user then return 
        if(!selectedUser) return;

        // if the user is present then get the socket from the auth store

        const socket = useAuth.getState().socket;

        // now the socket is connected then we can emit the event to the user
        socket.on("newMessage", (message) => {

            // if the message is not sent to the selected user then can just return out from the function to avoid mixing the chats
            if(message.senderId !== selectedUser._id) return;

            // if the messsage is sent to the selected user then add the messages to the set
            set({messages: [...get().messages,message]});
        })
    },

    // this will unsubscribe the user from the socket when the user is not selected or the user is logged out
    // this will be called when the user is logged out or the user is not selected
    unsubscribeToUser: () => {
        const socket = useAuth.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({selectedUser: user}),
  }));