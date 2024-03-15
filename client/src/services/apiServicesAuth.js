import {createApiClient} from "../config/config"

export const register = async (data) => {
    return (await createApiClient("/api/auth").post("/register", data)).data
}

export const login = async (data) => {
    return (await createApiClient("/api/auth").post("/login", data)).data
}

export const logout = async () => {
    return (await createApiClient("/api/auth").post("/logout")).data
}

export const refreshToken = async () => {
    return (await createApiClient("/api/auth").post("/refresh_token", { withCredentials: true })).data
}
