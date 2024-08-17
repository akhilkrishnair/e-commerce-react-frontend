import { axiosWithAuthentication } from "intersepter/axios";



export const fetchCart = () => axiosWithAuthentication.get('cart/')

export const fetchCartCount = () => axiosWithAuthentication.get('cart/count/')

export const increamentCartProductQuantity = (cartAdnProdId) => {
    const {cartId, cartProductId} = cartAdnProdId
    return axiosWithAuthentication.post('cart/increament-qty/',
    {cart_id:cartId, product_variant_id:cartProductId}
    )
}

export const decreamentCartProductQuantity = (cartId) => {
    return axiosWithAuthentication.post('cart/decreament-qty/', {cart_id:cartId})
}

export const deleteCartProduct = (cartId) => {
    return axiosWithAuthentication.post('cart/delete-cart/', {cart_id:cartId})
}

export const checkProductInCart = (productVariantId) => {
    return axiosWithAuthentication.post('cart/in-cart/',{product_variant:productVariantId})
}

export const productAddToCart = (productVariantId) => {
    const addCartData = { product_variant:productVariantId};
    return axiosWithAuthentication.post('cart/add-cart/',addCartData)
}
