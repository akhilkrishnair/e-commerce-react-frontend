import React, { PureComponent } from 'react'
import { accessToken } from 'intersepter/axios'
import { NavLink,Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'


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

    renderAddToCartComponent = () => {
        const {singleProduct,loaderAddCart,inCart} = this.props
        if(accessToken){
            if(loaderAddCart){
                return <div className="add-to-cart-loader btn btn-success">
                            <div className=" loader-in-button "></div>
                        </div> 
            }
            if(inCart){
                return <div className="add-to-cart ">
                            <NavLink to={'/user/cart/'} className="btn btn-success p-3" ><FaCheckCircle/> &nbsp; View Cart</NavLink>
                        </div> 
            }
            return <div className={`add-to-cart ${singleProduct.stock<1?'out-of-stock':''}`}>
                        <button 
                        className="btn btn-success p-3" 
                        onClick={() => this.handleAddToCart(singleProduct.id)} >
                            {singleProduct.stock<1?'Out of Stock':'Add to Cart'}
                        </button>
                    </div> 
           
        }
        return <div className="add-to-cart ">
                    <Link to={'/user/login/'} className="btn btn-success p-3" >Add to Cart</Link>
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