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
    return axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        withCredentials: true
    });
};

export const createApiImageClient = (baseURL, token) => {
    return axios.create({
        baseURL,
        headers: {
            "Content-Type": "multipart/json",
            "Authorization": `Bearer ${token}` 
        },
        withCredentials: true
    });
};