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

        // set the user loading state to be true meaning we are fetching the users
        set({isUserLoading: true})
        try {
            // now try to get the users from the api
            const res = await instance.get("/messages/users")

            // if we get the users then set the users state to be the users we got from the api
            set({users: res.data})
        } catch (error) {

            // if we get an error then set the toast to failed to fetch users 
            toast.error("Failed to fetch users")
        }

        // now the set the loading state to be false as we got the users 
        set({isUserLoading: false})
    },


    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
    
        try {
            const res = await instance.get(`/messages/${userId}`);

            // ensures it is an always array 
            set({ messages: Array.isArray(res.data) ? res.data : [] }); 

            // if the messages are not an array then set the messages to an empty array
            toast.error("Failed to fetch messages");

            // and if it is then set the messages to the state
            set({ messages: [] }); 
        } finally {
            // then set the message loading to false as we fetched the messages
            set({ isMessagesLoading: false }); 
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