import axios from "axios"

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
};


export const createApiClient = (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
        withCredentials: true
    })
};

export const createApiAuthClient = (baseURL, token) => {
    // console.log(token, "2")
    const axiosInstanceApiAuth = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        withCredentials: true
    })
    //Add a response interceptor axios to refresh the JWT token if it's expired
    // axiosInstanceApiAuth.interceptors.response.use(
    //     (response) => response,
    //     async (error) => {
    //         const originalRequest = error.config
    //         // console.log(error.response.status)
    //         // if the error code is 401 and have refresh token, refresh jwt token
    //         if(
    //             error.response.status === 401 &&
    //             !originalRequest._retry
    //         ) {
    //             originalRequest._retry = true
    //             const newToken = await refreshToken()
    //             axiosInstanceApiAuth.defaults.headers.common["Authorization"] = `Bearer ${newToken.access_token}`
    //             setToken(newToken.user, newToken.access_token)
    //             // console.log(newToken)
    //             return axiosInstanceApiAuth(originalRequest)
    //         }
    //         console.log(error, "1");
    //         return Promise.reject(error)
    //     }
    // )
    return axiosInstanceApiAuth
    // return axios.create({
    //     baseURL,
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json",
    //         "Authorization": `Bearer ${token}` 
    //     },
    //     withCredentials: true
    // });
};

export const createApiImageClient = (baseURL, token) => {
    // console.log(token, "2")
    const axiosInstanceApiImageAuth = axios.create({
        baseURL,
        headers: {
            "Content-Type": "multipart/json",
            "Authorization": `Bearer ${token}` 
        },
        withCredentials: true
    })

    //Add a response interceptor axios to refresh the JWT token if it's expired
    // axiosInstanceApiImageAuth.interceptors.response.use(
    //     (response) => response,
    //     async (error) => {
    //         const originalRequest = error.config
    //         // console.log(error.response.status)
    //         // if the error code is 401 and have refresh token, refresh jwt token
    //         if(
    //             error.response.status === 401 &&
    //             !originalRequest._retry
    //         ) {
    //             originalRequest._retry = true
    //             const newToken = await refreshToken()
    //             axiosInstanceApiImageAuth.defaults.headers.common = {"Authorization": `Bearer ${newToken.access_token}`}
    //             originalRequest.headers["Authorization"] = "Bearer " + newToken.access_token
    //             setToken(newToken.access_token, newToken.user)
    //             // console.log(newToken)
    //             return axiosInstanceApiImageAuth(originalRequest)
    //         }
    //         console.log(error, "1");
    //         return Promise.reject(error)
    //     }
    // )
    return axiosInstanceApiImageAuth
    // return axios.create({
    //     baseURL,
    //     headers: {
    //         "Content-Type": "multipart/json",
    //         "Authorization": `Bearer ${token}` 
    //     },
    //     withCredentials: true
    // });
};