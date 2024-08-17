import './Cart.css';
import { PureComponent } from "react";
import { Link } from "react-router-dom";
import CartItems from "./components/CartItems";
import CheckoutButton from "./components/CheckoutButton";
import withAuthentication from 'utils/withAuthentication';
import { CartContext } from 'contexts/contexts';
import { decreamentCartProductQuantity, deleteCartProduct, fetchCart, increamentCartProductQuantity } from 'api/cart';

class Cart extends PureComponent {

    static contextType = CartContext

    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            cartChecked: false,
            totalAmount:0,
        };
    };

    componentDidMount() {
        this.fetchCart();
    };

    fetchCart = async () => {
        fetchCart()
        .then(res => {
            this.setState({cart:res.data})
            this.amountCalculation(res.data)
            this.context.handleCartCountCalculate(res.data.length)
        })
        .catch(err => console.log(err))
        .finally(() => this.setState({cartChecked:true}))      
    };

    amountCalculation = (cart)=> {
        let total = 0
        cart.forEach((cp) => {
            total +=  cp.quantity*(cp.product_variant.price - cp.product_variant.price/100*cp.product_variant.offer)
        })
        this.setState({totalAmount:total})
    }

    increamentCart= async (cartAdnProdId)=>{    
        increamentCartProductQuantity(cartAdnProdId)
        .then((res)=>{
            this.fetchCart();
        })
        .catch((err)=>{
        })
    };

    decreamentCart = async (cart_id) => {       
        decreamentCartProductQuantity(cart_id)
        .then((res)=>{
            this.fetchCart();
        })
        .catch((err)=>{
        })
    };

    deleteCart = (cart_id) => {       
        deleteCartProduct(cart_id)
        .then((res) => {
            this.fetchCart();     
        }).catch((err) => {})
    };


    render() {

        const {cart,cartChecked,totalAmount} = this.state
        window.scrollTo(0,0)
        return (
            <div className="cart-main-container">
                {
                    !cartChecked &&
                    <div className="cart-loader-container">
                        <div className="cart-loader"></div>
                    </div>
                }
                
                {
                    cartChecked&&cart.length >0&&
                    <div className="each-cart-container">
                        <section className="h-100" style={{ backgroundColor: "#eee" }}>
                            <div className="container h-100 py-5">
                                <div className="row d-flex justify-content-center align-items-center h-100">
                                    <div className="col-10">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h3 className="fw-normal mb-0 text-black">Your Cart</h3>
                                        </div>

                                        <CartItems
                                        cart={cart}
                                        decreamentCart={this.decreamentCart}
                                        increamentCart={this.increamentCart}
                                        deleteCart={this.deleteCart} />

                                        <CheckoutButton totalAmount={totalAmount} />

                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                }

                {
                    cartChecked && cart.length === 0 && (
                        <div className="empty-cart-container">
                            <Link to={"/"} className="empty-cart">                             
                                Your Cart is Empty! Shop now                             
                            </Link>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default withAuthentication(Cart);
