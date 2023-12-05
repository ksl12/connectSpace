import { Server } from "socket.io";
import { acceptRequest, addNewFriend, deleteOLDFriend, rejectRequest, sendRequest } from "./src/models/friendModel.js";
import { addNotification } from "./src/models/notificationModel.js";


let onlineUsers = [], admin = []
const addNewUser = (userID, socketId) => {
    if(!onlineUsers.some((user) => user.userID === userID)) {
        onlineUsers.push({ userID, socketId })
    }
}

const addAdmin = (adminID, socketId) => {
    if(!admin.some((ad) => ad.adminID === adminID)) {
        admin.push({ adminID, socketId })
    }
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

const removeAdmin = (socketId) => {
    admin = admin.filter((ad) => ad.socketId !== socketId)
}

const getUser = (userID) => {
    return onlineUsers.find((user) => user.userID == userID);
};

const getAdmin = (adminID) => {
    return admin.find((ad) => ad.adminID == adminID);
};


const socketServer = (server) => {
    // create server
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3001",
            credentials: true
        }
    })

    const adminSocket = io.of("/admin")

    //connect admin
    adminSocket.on("connection", (socket) => {
        socket.on("newAdmin", (adminID) => {
            addAdmin(adminID, socket.id)
            // console.log(onlineUsers)
        })
        socket.on("getActiveUsers", () => {
            const totalActive = onlineUsers.length;
            // console.log(totalActive, "4")
            adminSocket
              .to(admin[0].socketId)
              .emit("getActiveUsersToClient", totalActive);
        })

        // admin send block to user when user is online
        socket.on("adminBlockUser", (userID) => {
            const receiver = getUser(userID)
            if(receiver) {
                socket.to(receiver.socketId).emit("blockUser", {userID})
                io.to(receiver.socketId).emit("blockUser", {userID})
            }
        })

        // admin send delele post to user when user is online
        socket.on("adminDeletePost", (userID) => {
            const receiver = getUser(userID)
            if(receiver) {
                socket.to(receiver.socketId).emit("deletePost", {userID})
                io.to(receiver.socketId).emit("deletePost", {userID})
            }
        })
        socket.on("disconnect", () => {
            removeAdmin(socket.id)
            // console.log("admin log out", admin)
        })
    })


    // connect user
    io.on("connection", (socket) => {
        socket.on("newUser", (userID) => {
            addNewUser(userID, socket.id)
            let totalActive = onlineUsers.length
            // console.log(onlineUsers, "1")
            if(admin.length > 0) {
                socket.to(admin[0].socketId).emit("activeUsers", totalActive)
                adminSocket.to(admin[0].socketId).emit("activeUsers", totalActive)
            }
        });
        socket.on("sendRequest", async ({sendID, friendID, sendFirstName, sendLastName}) => {
            const receiver = getUser(friendID)
            let values = [sendID, friendID]
            // console.log(receiver)
            await sendRequest(values)
            await addNotification([sendID, friendID, `${sendFirstName} ${sendLastName} vừa gửi cho bạn một lời mời kết bạn`])
            if(receiver) {
                io.to(receiver.socketId).emit("getNotification", {sendID, friendID, type: "request"})
                io.to(receiver.socketId).emit("checkReceive", {friendID})
            } 
            socket.emit("checkSend", {sendID})

        })
        socket.on("deleteRequest", async ({sendID, friendID}) => {
            const receiver = getUser(friendID)
            await rejectRequest(sendID, friendID)
            // console.log(receiver)
            if(receiver) {
                io.to(receiver.socketId).emit("checkReceive", {friendID})
            } 
            socket.emit("checkSend", {sendID})
        })

        socket.on("deleteFriend", async ({sendID, friendID}) => {
            const receiver = getUser(friendID)
            await rejectRequest(sendID, friendID)
            await rejectRequest(friendID, sendID)
            await deleteOLDFriend(sendID, friendID)
            if(receiver) {
                io.to(receiver.socketId).emit("checkFriend", {sendID, friendID})
                io.to(receiver.socketId).emit("checkReceive", {friendID})
                io.to(receiver.socketId).emit("checkSend", {sendID})
            } 
            socket.emit("checkFriend", {sendID, friendID})
            socket.emit("checkSend", {sendID})
            socket.emit("checkReceive", {friendID})
        })

        socket.on("acceptFriend", async ({sendID, friendID, sendFirstName, sendLastName}) => {
            const receiver = getUser(sendID)
            let type = "friend"
            let values
            if(sendID < friendID) {
                values = [sendID, friendID, type]
            }
            else {
                values = [friendID, sendID, type]
            }
            await acceptRequest(sendID, friendID)
            await addNotification([friendID, sendID, `${sendFirstName} ${sendLastName} vừa chấp nhận lời mời kết bạn`])
            await addNewFriend(values)
            if(receiver) {
                io.to(receiver.socketId).emit("checkFriend", {friendID, sendID})
                io.to(receiver.socketId).emit("checkSend", {sendID})
                io.to(receiver.socketId).emit("getNotification")
            } 
            socket.emit("checkFriend", {sendID, friendID})
            socket.emit("checkReceive", {friendID})
        })

        socket.on("rejectRequest", async ({sendID, friendID}) => {
            const receiver = getUser(sendID)
            await rejectRequest(sendID, friendID)
            if(receiver) {
                io.to(receiver.socketId).emit("checkFriend", {friendID, sendID})
                io.to(receiver.socketId).emit("checkSend", {sendID})
            } 
            socket.emit("checkFriend", {sendID, friendID})
            socket.emit("checkReceive", {friendID})
        })

        // 
        // socket.on("getActiveUsers", () => {
        //     const totalActive = onlineUsers.length;
        //     // console.log(admin, "4")
        //     io
        //       .to(admin[0].socketId)
        //       .emit("getActiveUsersToClient", totalActive);
        // })
        //disconnect
        socket.on("disconnect", () => {
            if(admin.length > 0) {
                removeUser(socket.id)
                let totalActive = onlineUsers.length
                adminSocket.to(admin[0].socketId).emit("activeUsers", totalActive)
            }
            removeUser(socket.id)
            // console.log(onlineUsers)
        })
    })
}

export default socketServer;

