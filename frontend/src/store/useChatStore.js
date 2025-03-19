import { create } from "zustand";
import toast from "react-hot-toast";
import {instance} from "../lib/axios"


export const useChatStore = create((set) => ({
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

    setSelectedUser: (user) => set({selectedUser: user}),
  }));