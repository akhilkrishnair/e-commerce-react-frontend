import React, { PureComponent } from 'react'
import { accessToken } from 'intersepter/axios'
import { NavLink,Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import { IoBagAdd,IoBagCheck } from "react-icons/io5";



export class AddToCartButton extends PureComponent {
    constructor(props){
        super(props)
    }

    handleAddToCart = (singleProductId) => {
        if(this.props.singleProduct.stock < 1){
            return
        }
        this.props.addToCart(singleProductId)
    }

    renderAddToCartIcon = (stock) => {
        if (stock<1){
            return 'Out of Stock'
        }
        return (
            <><IoBagAdd/> Add to Cart</>
        )
    }

    renderAddToCartComponent = () => {
        const {singleProduct,loaderAddCart,inCart} = this.props
        if(accessToken){
            if(loaderAddCart){
                return <div className="add-to-cart-loader btn btn-warning p-2">
                            <div className=" loader-in-button "></div>
                        </div> 
            }
            if(inCart){
                return <div className="add-to-cart ">
                            <NavLink to={'/user/cart/'} className="btn btn-warning p-3" ><IoBagCheck/> View Cart</NavLink>
                        </div> 
            }
            return <div className={`add-to-cart ${singleProduct.stock<1?'out-of-stock':''}`}>
                        <button 
                        className="btn btn-warning p-3" 
                        onClick={() => this.handleAddToCart(singleProduct.id)} >
                            {this.renderAddToCartIcon(singleProduct.stock)}
                        </button>
                    </div> 
           
        }
        return <div className="add-to-cart ">
                    <Link to={'/user/login/'} className="btn btn-success p-3" ><IoBagAdd/> Add to Cart</Link>
                </div> 
    }


    render() {
        return (      
            <>
                {this.renderAddToCartComponent()}                                                     
            </>
        )
    }
}

export default AddToCartButton