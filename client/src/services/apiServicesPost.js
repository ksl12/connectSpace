import { createApiAuthClient, createApiClient, createApiImageClient } from "../config/config";


export const getOLDPost = async (id, token) => {
    return (await createApiAuthClient("/api/post", token).get("/getPost/" + `${id}`)).data
}

export const getPostUser = async (id, token) => {
    return (await createApiAuthClient("/api/post", token).get("/getPostUser/" + `${id}`)).data
}

export const getOnlyOnePost = async (postId, token) => {
    return (await createApiAuthClient("/api/post", token).get("/getOnlyPost/" + `${postId}`)).data
}

export const addNewPost = async (data, token) => {
    return (await createApiAuthClient("/api/post", token).post("/addPost", data)).data
}

export const deletePost = async (id, token) => {
    return (await createApiAuthClient("/api/post", token).delete("/deletePost/" + `${id}`)).data
}

export const addImage = async (data, token) => {
    return (await createApiImageClient("/api/upload", token).post("/", data)).data
}

export const deleteImage = async (filename, token) => {
    return (await createApiAuthClient("/api/delete", token).delete("/" + `${filename}`)).data
}
