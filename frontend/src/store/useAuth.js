import {create} from 'zustand';
import { instance } from '../lib/axios.js';
import toast from 'react-hot-toast';

 const useAuth = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,

// authenticate the user using already made check funtion in the backend
    checkAuth: async () => { 
        try {
            const res = await instance.get("/auth/check");
            set({authUser: res.data});

// if the user is not found meaning there is no auth user meaning set the checking to false meaning user does not exist 
        } catch (error) {
            console.log("error in check auth", error);
         set({authUser: null});   
        }finally{
            set({isCheckingAuth: false});
        }
    },

// signin function to signin the user
    signup:async(data) =>{
        try {
            set({isSigningUp: true});
            const res = await instance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response ?.data ?.message || "Signup failed. Please try again");
        }finally{
            set({isSigningUp: false});
        }
    }
}));

export default useAuth; 