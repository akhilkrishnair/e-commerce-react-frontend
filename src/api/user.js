const { axiosWithAuthentication, axiosWithoutAuthentication } = require("intersepter/axios")



export const handleUserLogin = (LoginData) => {
    return axiosWithoutAuthentication.post("user/login/token/",LoginData)
}

export const fetchUserProfile = async () => {
    return axiosWithAuthentication.get('user/profile/')
}
