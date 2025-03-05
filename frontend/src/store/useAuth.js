import {create} from 'zustand';
import { instance } from '../lib/axios';

 const useAuth = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

// authenticate the user using already made check funtion in the backend
    checkAuth: async () => {
        try {
            const res = await instance.get("/auth/check");

            set({authUser: res.data});

// if the user is not found meaning there is no auth user meaning set the checking to false meaning user does not exist 
        } catch (error) {
         set({authUser: null});   
        }finally{
            set({isCheckingAuth: false});
        }
    }
}));

export default useAuth; 