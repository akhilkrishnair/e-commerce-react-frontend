const { axiosWithoutAuthentication, axiosWithAuthentication, accessToken } = require("intersepter/axios")



export  const fetchProductCategories = () => {
    return axiosWithoutAuthentication.get('categories/')
}

export  const fetchProductVariants = (url) => {
    if(accessToken){
        return axiosWithAuthentication.get(url)
    }
    return axiosWithoutAuthentication.get(url)
}

export  const changeProductVariantsPage = (page) => {
    if(accessToken){
        return axiosWithAuthentication.get(`product-variants/?page=${page}`)
    }
    return axiosWithoutAuthentication.get(`product-variants/?page=${page}`)
}

export  const fetchSearchingProductVariants = (url) => {
    if(accessToken){
        return axiosWithAuthentication.get(url)
    }
    return axiosWithoutAuthentication.get(url)
}