import { create } from "zustand";
import toast from "react-hot-toast";
import {instance} from "../lib/axios"


export const useChatStore = create((set,get) => ({
    messages: [],
    users:[],
    selectedUser: null,
    isUserLoading : false,
    isMessageLoading : false,

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
        set({isMessageLoading: true})
        try {
            const res = await instance.get(`/messages/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error("Failed to fetch messages")
        }
        set({isMessageLoading: false})
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


    setSelectedUser: (user) => set({selectedUser: user}),
  }));