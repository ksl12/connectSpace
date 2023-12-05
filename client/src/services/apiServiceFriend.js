import { createApiAuthClient } from "../config/config";

export const getNumberFriend = async (userId, token) => {
    return (await createApiAuthClient("/api/friend", token).get("/?userID=" + userId)).data
}

export const loadFriend = async (userId, page, token) => {
    return (await createApiAuthClient("/api/friend", token).get("/loadFriend/?userID=" + userId + "&page=" + page)).data
}

export const checkFriend = async (userId, friendId, token) => {
    return (await createApiAuthClient("/api/friend", token).get("/checkFriend/?userID=" + userId + "&friendID=" + friendId)).data
}

export const checkSendRequest = async (userId, token) => {
    return (await createApiAuthClient("/api/friend", token).get("/checkSend/?userID=" + userId)).data
}

export const checkReceiveRequest = async (userId, token) => {
    return (await createApiAuthClient("/api/friend", token).get("/checkReceive/?userID=" + userId)).data
}

export const deleteFriend = async (data, token) => {
    return (await createApiAuthClient("/api/friend", token).delete("/deleteFriend", {data: data})).data
}

// notification in friend 

export const loadNoti = async (userId, token) => {
    return (await createApiAuthClient("/api/notification", token).get("/" + `${userId}`)).data
}

export const loadAllNoti = async (userId, token) => {
    return (await createApiAuthClient("/api/notification", token).get("/loadAll/" + `${userId}`)).data
}

export const readNoti = async (notificationId, token) => {
    return (await createApiAuthClient("/api/notification", token).get("/readNoti/" + `${notificationId}`)).data
}

export const readAllNoti = async (userId, token) => {
    return (await createApiAuthClient("/api/notification", token).get("/readAllNoti/" + `${userId}`)).data
}


