import React, { use } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useEffect } from 'react';
import MessageInput from './skeletons/MessageInput';
import ChatHeader from './skeletons/chatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton'
import useAuth from '../store/useAuth';
import Image from '../assets/avatar.png'
import { formatTime } from '../lib/moreutils';


const ChatContainer = () => {
const{messages,getMessages,isMessagesLoading,selectedUser,subscribeToUser,unsubscribeToUser} = useChatStore();
const {authUser} = useAuth();

useEffect(() => {
  getMessages(selectedUser._id);
  subscribeToUser();
  return () =>unsubscribeToUser();
  },[selectedUser._id,getMessages])

 if(isMessagesLoading) return(
  <div className='flex-1 flex flex-col overflow-auto'>
    <ChatHeader/>
    <MessageSkeleton/>
    <MessageInput/>
  </div>
 );

  return (
    <div className='flex-1 flex flex-col overflow-auto'>

      <ChatHeader/>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilepicture || Image
                      : selectedUser.profilepicture || Image
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput/>
    </div>
  )
}

export default ChatContainer
