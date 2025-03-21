import {Server} from 'socket.io';
import http from 'http';
import express from 'express'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});


const userOnline = () => {
        
};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // get the user id
    // this is the query parameter that we are sending from the frontend
    const UserId = socket.handshake.query.UserIdserId;

    // if the user  exists then
    if(UserId) userOnline[UserId] = socket.id;

    // io emit will show the events to all the connected clients 
    // basically will show the status of online and offline easy peasy

    io.emit('gettingOnlineUsers', Object.keys(userOnline));

    socket.on('disconnect', () => {
        console.log('user disconnected',socket.id);

        // now same for the disconnection the fucking users should know that too 
        delete userOnline[UserId];
        io.emit('gettingOnlineUsers', Object.keys(userOnline));
    });

})

export {io, server, app};

