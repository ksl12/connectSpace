import { createApiAuthClient } from "../config/config";

export const listUser = async (token) => {
    return (await createApiAuthClient("/api/admin", token).get("/userManage")).data
}

export const listPost = async (token) => {
    return (await createApiAuthClient("/api/admin", token).get("/postManage")).data
}

export const getNumberUser = async (token) => {
    return (await createApiAuthClient("/api/admin", token).get("/user")).data
}

export const getNumberPost = async (token) => {
    return (await createApiAuthClient("/api/admin", token).get("/post")).data
}

export const getNumberComment = async (token) => {
    return (await createApiAuthClient("/api/admin", token).get("/comment")).data
}

export const getNumberGender = async (token) => {
    return (await createApiAuthClient("/api/admin", token).get("/gender")).data
}

export const checkBlock = async (id, token) => {
    return (await createApiAuthClient("/api/admin", token).get("/userBlock/" + `${id}`)).data
}

export const openBlocked = async (data, token) => {
    return (await createApiAuthClient("/api/admin", token).patch("/openBlock/", data)).data
}

export const Block = async (data, token) => {
    return (await createApiAuthClient("/api/admin", token).patch("/Block/", data)).data
}

