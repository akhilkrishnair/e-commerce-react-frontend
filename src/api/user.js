import { axiosWithAuthentication,axiosWithoutAuthentication } from "intersepter/axios"

export const handleUserLogin = (LoginData) => {
    return axiosWithoutAuthentication.post("user/login/token/",LoginData)
}

export const fetchUserProfile = async () => {
    return axiosWithAuthentication.get('user/profile/')
}

export const refreshAccessToken = () => {
    return axiosWithoutAuthentication.post(
        `user/token/refresh/`,
        { refresh: localStorage.getItem("refreshToken") }
    )   
}