import { axiosWithAuthentication } from "intersepter/axios"



export const deleteWishlistProduct = (wishlist) => {
    const data = {wishlist_id:wishlist.id}   
    return axiosWithAuthentication.post('wishlist/delete/',data)
}

export const checkProductInWishlist = (productVariantId) => {
    return  axiosWithAuthentication.post('wishlist/in-wishlist/',{ product_variant:productVariantId})
}

export const productAddToWishlist = (productVariantId) => {
    const wishlistData = {product_variant:productVariantId};
    return  axiosWithAuthentication.post('wishlist/add/',wishlistData)
}