import { createApiAuthClient } from "../config/config";

export const getNumberLike = async (postId, token) => {
    return (await createApiAuthClient("/api/like", token).get("/" + `${postId}`)).data
}

export const addNewLike = async (data, token) => {
    return (await createApiAuthClient("/api/like", token).post("/", data)).data
}

export const unLike = async (userID, postID,token) => {
    return (await createApiAuthClient("/api/like", token).delete("/?userID=" + userID + "&postID=" + postID)).data
}


