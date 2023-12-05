import { createApiAuthClient } from "../config/config";

export const getNumberComment = async (postId, token) => {
    return (await createApiAuthClient("/api/comment", token).get("/" + `${postId}`)).data
}

export const loadComment = async (postId, token) => {
    return (await createApiAuthClient("/api/comment", token).get("/?postID=" + postId)).data
}


export const addNewComment = async (data, token) => {
    return (await createApiAuthClient("/api/comment", token).post("/", data)).data
}

// export const unLike = async (userID, postID,token) => {
//     return (await createApiAuthClient("/api/like", token).delete("/?userID=" + userID + "&postID=" + postID)).data
// }


