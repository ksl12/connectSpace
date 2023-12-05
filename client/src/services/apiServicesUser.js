import { createApiAuthClient } from "../config/config";

export const getInfo = async (id, token) => {
    return (await createApiAuthClient("/api/user", token).get("/find/" + `${id}`)).data
}

export const getInfoUpdate = async (id, token) => {
    return (await createApiAuthClient("/api/user", token).get("/getUserUpdate/" + `${id}`)).data
}

export const searchUser = async (data, token) => {
    return (await createApiAuthClient("/api/user", token).post("/search", data)).data
}

export const updateUser = async (data, id, token) => {
    return (await createApiAuthClient("/api/user", token).patch("/update/" + `${id}`, data)).data
}

export const suggestionFriend = async (id, token) => {
    return (await createApiAuthClient("/api/user", token).get("/suggestionUser/" + `${id}`)).data
}
