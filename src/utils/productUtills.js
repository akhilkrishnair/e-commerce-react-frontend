
// render product name with variants
export const renderProductName = (rp) => {
    if(!rp) return

    let productName = rp.product.product_color_variant.product.name
    let productVariantName = renderProductVariant(rp.product)
    if(productName.length > 40){
        return `${productName.slice(0,40)} ${productVariantName}`
    }
    return `${productName} ${productVariantName}`
}

// render product variants like size and color
export const renderProductVariant = (singleProduct) => {
    if(!singleProduct) return
    
    const color = singleProduct.product_color_variant.color.name
    const size = singleProduct.size.name

    let variantTitle = ""
          
    if (color !== 'no-color' && color !== null){
        variantTitle += `(${color}`
    }
    if (size !== 'no-size' && size !== null){
        if (variantTitle){
            variantTitle += `, ${size})`
        }else{
            variantTitle += `(${size})`
        }
    }else{
        variantTitle += ')'
    }

    return variantTitle
}

// render product price with calculated offer price
export const renderProductPrice = (productVariant) => {
    return <h6 className="card-title">Rs.{productVariant.price - (productVariant.price/100 * productVariant.offer)}
                <span className="text-secondary text-decoration-line-through ms-2">Rs.{productVariant.price}</span>
                <span className="text-success ms-2" >{productVariant.offer}%</span>
            </h6>                                   
}

// get product details url for href
export const getProductDetailsUrl = (productVariant) => {
    const category = productVariant.product_color_variant.product.category.slug
    const product = productVariant.product_color_variant.product.slug
    const color = productVariant.product_color_variant.color.name
    const size = productVariant.size.name
    const productId = productVariant.product_color_variant.product.id
    return `/${category}/${product}/${color}/${size}/${productId}/`
}

// get product image url

export const getProductImageUrl = (productVariant) => {
    if(productVariant.product_color_variant.image1) return productVariant.product_color_variant.image1
    return productVariant.product_color_variant.product.image_main
}
