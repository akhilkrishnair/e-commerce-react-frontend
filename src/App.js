import React, { PureComponent } from "react";
import "App.css";
import PageRouter from "routes/PageRouter";
import { HashRouter } from "react-router-dom";
import { fetchUserProfile } from "api/user";
import { UserContext, CartContext } from "contexts/contexts";
import { fetchCartCount } from "api/cart";

export const webSocketUrl = `ws://akhilkrishna.pythonanywhere.com/ws/order-updates/`;

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            cart: [],
            cartCount: 0,
        };
    }

    async componentDidMount() {
        fetchUserProfile()
            .then((res) => {
                this.setState({ userProfile: res.data });
            })
            .catch((err) => {});

        this.handleFetchCartCount();
    }

    handleCartCountCalculate = (count) => {
        this.setState({ cartCount: count });
    };

    handleFetchCartCount = () => {
        fetchCartCount()
            .then((res) => {
                this.setState({ cartCount: res.data });
            })
            .catch((err) => {});
    };

    handleCartCountAfterOrder = () => {
        this.setState({ cartCount: 0 });
    };

    render() {
        const {
            handleFetchCartCount,
            handleCartCountCalculate,
            handleCartCountAfterOrder,
        } = this;

        const { userProfile, cartCount } = this.state;

        return (
            <HashRouter>
                <UserContext.Provider value={userProfile}>
                    <CartContext.Provider
                        value={{
                            cartCount,
                            handleFetchCartCount,
                            handleCartCountCalculate,
                            handleCartCountAfterOrder,
                        }}
                    >
                        <PageRouter />
                    </CartContext.Provider>
                </UserContext.Provider>
            </HashRouter>
        );
    }
}

export default App;
