import { Component } from "react";
import axios from "axios";
import './css/Products.css'


class Products extends Component {
    constructor(props) {
        super(props);
        this.state = { 
             productVariants:[]
        };
    }
    

    componentDidMount(){
        this.fetchProductVariants();
    };


    fetchProductVariants = () => {
        axios
        .get('http://127.0.0.1:8000/api/product-variants/')
        .then((response) => {
           this.setState({productVariants:response.data}) 
        }).catch((error) => {
            console.log(error)
        });
    };
    


    render() {
        return (
           <div className="products-container pt-4">
            {
                this.state.productVariants.map((product) => (
                    <div className="card  mx-2 mb-5" style={{width: "14rem"}}>
                        <img 
                        style={{width: "8rem",margin:"10px auto"}}
                        src={
                            product.product_color_variant.image1?
                            product.product_color_variant.image1:
                            product.product_color_variant.product.image_main
                        } 
                        className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h6 className="card-title">
                                {
                                product.product_color_variant.product.name+" ("+
                                product.product_color_variant.color.name+", "+
                                product.size.name+")"
                                }
                            </h6>
                            <h6 className="card-title">
                                Rs.{product.price}
                             </h6>
                        </div>
                        
                    </div>
                ))
            }
           </div> 
        );
    }
}

export default Products;