import {create} from 'zustand';
import { instance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';


 
const baseURL = "http://localhost:5071"

 const useAuth = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket:null,

// authenticate the user using already made check funtion in the backend
    checkAuth: async () => { 
        try {
            const res = await instance.get("/auth/check"); 
            set({authUser: res.data});

         // if the user is found meaning it is a auth user then we can connect to with socket 
            get().connectSocket();
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

            // when the user is signed in the user can connect to the socket
            get().connectSocket();
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

          // for disconnecting the socket
          get().disconnectSocket();
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

          // same socket for the login function as well
          get().connectSocket();
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


//  when the user will enter the app 
 connectSocket: () => {

  // if the user is not authenticated then don't connect 
  const{authUser} =get();

  // and if the user is connected then don't connect again
  if(!authUser || get().socket?.connected){
    return;
  }

   const socket = io(baseURL,{

    // the User id will be the authenticated user id which is going in the socket in the query of the backend file 
    query: {
      UserId: authUser._id,
    }
   });


   socket.connect();

  //  set the socket in the state
  set({ socket: socket });

  // listen for the event when the user will be online
  socket.on("gettingOnlineUsers", (UserIds) => {
    // set the online users in the state
    set({ onlineUsers: UserIds });
  });
 },


//  when the user wil leave the app then we have to disconnect the socket
 disconnectSocket: () => {

  // check if the user is connected then only disonnect 
   if(get().socket?.connected) get().socket.disconnect();
 },
}));

export default useAuth; 