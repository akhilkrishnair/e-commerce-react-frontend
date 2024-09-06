import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom';

export class SelectSize extends PureComponent {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div key={'size'} className="size-selection">
                <h6 className="me-4">Size </h6>
                {
                    this.props.sizeVariant && this.props.sizeVariant.map((sv) => (
                        <NavLink 
                            key={sv.id}
                            className="size-variant" 
                            to={
                                `/${sv.product_color_variant.product.category.slug}/${sv.product_color_variant.product.slug}/${sv.product_color_variant.color.name}/${sv.size.name}/${sv.product_color_variant.product.id}/`
                            }
                        >
                            {sv.size.name}
                        </NavLink>
                    ))
                }
            </div>
        )
    }
}

export default SelectSize