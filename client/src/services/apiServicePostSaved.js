import { createApiAuthClient } from "../config/config";

export const getNumberPS = async (userId, token) => {
    return (await createApiAuthClient("/api/postSaved", token).get("/" + `${userId}`)).data
}

export const addNewPS = async (data, token) => {
    return (await createApiAuthClient("/api/postSaved", token).post("/", data)).data
}

export const deletePS = async (userID, postID, token) => {
    return (await createApiAuthClient("/api/postSaved", token).delete("/?userID=" + userID + "&postID=" + postID)).data
}


