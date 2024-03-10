import { PureComponent } from "react";
import { Link } from "react-router-dom";
import success from '../images/logos/order_success.png';
import './css/OrderSuccess.css';


class OrderSuccess extends PureComponent {
    
    constructor(){
        super()
        this.state = {
            imageView:false
        }
    }

    componentDidMount(){
        const container = document.getElementById('order-success-container')
        container.scrollIntoView({behavior:'smooth',block:'center'})
    }

    imageShow = () => {
        this.setState({imageView:true})
    }

    render() {

        setTimeout(this.imageShow,500);

        return (
            <div id="order-success-container" style={style.container}>

                    <div style={style.imageContainer}>
                        {
                            this.state.imageView&&
                            <img style={style.image} src={success}/>
                        }
                    </div>

                <h4>Your order is confirmed</h4>
                <p style={style.p} >We'll send you a shipping confirm email as soon as your order ships</p>
                <Link style={style.status} to={"/user/dashbord/orders/"} >CHECK STATUS</Link>
            </div>
        );

    }
}

const style = {
    container:{
        'width':`${window.innerWidth > 500?'40%':'95%'}`,
        'padding':'45px',
        'backgroundColor':'white',
        'display':'flex','flexDirection':'column','justifyContent':'center','alignItems':'center',
        'margin':'70px auto', 'marginBottom':'170px',

    },
    status:{
        'textDecoration':'none',
        'width':`${window.innerWidth > 500?'30%':'50%'}`,
        'padding':'10px',
        'backgroundColor':'#ec2d89',
        'color':'white',
        'marginCop':'15px',
        'textAlign':'center',
        'fontSize':'15px',
        'fontWeight':'500'
    },
    imageContainer:{
        'width':'70px',
        'height':'70px',
        'marginBottom':'15px',
        'transition':'0.5s lenear ease 2s'
    },
    image:{
        'width':'100%',
        'height':'auto',
    },
    p:{
        'textAlign':'center',
        'width':'80%',
        'padding':'8px'
    }
}



export default OrderSuccess;