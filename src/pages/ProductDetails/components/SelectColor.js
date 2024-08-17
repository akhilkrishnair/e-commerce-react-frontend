import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'

export class SelectColor extends PureComponent {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <div key={'color'} className="color-selection" >
                <h6 className="me-4">Select Color :</h6>
                {
                    this.props.colorVariant && this.props.colorVariant.map((cv) => (
                        <NavLink 
                            key={cv.id} 
                            className="color-variant" 
                            to={
                                `/${cv.product_color_variant.product.category.slug}/${cv.product_color_variant.product.slug}/${cv.product_color_variant.color.name}/${cv.size.name}/${cv.product_color_variant.product.id}/`
                            }
                        >
                            <img 
                                src={
                                    cv.product_color_variant.image1?
                                    cv.product_color_variant.image1:
                                    cv.product_color_variant.product.image_main
                                }
                                alt={cv.product_color_variant.product.slug} 
                            />
                        </NavLink>
                    ))
                };

            </div>
        )
    }
}

export default SelectColor