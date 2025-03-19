import {create} from 'zustand';
import { instance } from '../lib/axios.js';
import toast from 'react-hot-toast';
// import { UpdateProfile } from '../../../backend/src/controllers/auth.controller.js';
 


 const useAuth = create((set) => ({
    authUser: null,

    isCheckingAuth: true,
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],

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
       set({isSigningUp: true});
        try {
            const res = await instance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response ?.data ?.message || "Signup failed. Please try again");
        }finally{
            set({isSigningUp: false});
        }
    },

// logout function to logout the user
    logout: async () => {
        try {
         await instance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Try again!");
        }
      },

      
// login function to login the user
      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await instance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
        } catch (error) {
          toast.error(error.response.data.message || "Login failed. Please try again");
        } finally {
          set({ isLoggingIn: false });
        }
      },

// update profile function to update the profile of the user
 UpdateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await instance.put("/auth/profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
 },

}));

export default useAuth; 