import axios from "axios";
import { Component } from "react";
import { NavLink, useParams } from "react-router-dom";
import './css/product_details.css';



class Product_Details extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            allProducts:[]
        };
    }

    componentDidMount(){
        this.fetchProduct();
    }

    
    fetchProduct(){
        axios
        .get('http://127.0.0.1:8000/api/product-variants/')
        .then((response) => {
            this.setState({allProducts:response.data})
        })
        .catch((error) => {
            console.log("eerroorr "+error)
        });
    };

    changeImage(e){
        let current_img = document.getElementsByClassName("current-image")[0].children[0]       
        current_img.src = e.target.src   
    }

    
    render() {

        const {slug,color,size} = this.props;

        const singleProduct = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color && 
                    p.size.name === size
        });

        const colorVariant = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.size.name === size                   
        }).sort();

        const sizeVariant = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color                  
        }).sort((a,b) => a.size.name[0]-b.size.name[0]) ;
        

        return (
            <>
            
                
                <div className="product-main-container mt-5">
                {   
                    singleProduct && singleProduct.map((p) => (
                        
                           <>
                                <div className="product-image-container">
                                    <div className="current-image">
                                        <img 
                                           src={
                                            p.product_color_variant.image1?
                                            p.product_color_variant.image1:
                                            p.product_color_variant.product.image_main
                                           }
                                           alt={p.product_color_variant.product.slug}
                                        />
                                    </div>
                                    <div className="available-images">
                                        {
                                            p.product_color_variant.image1?
                                            <div  className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image1
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image2?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image2
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image3?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image3
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image4?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image4
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image5?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image5
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image6?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image6
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image7?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image7
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }

                                    </div>
                                </div>
                                <div className="product-details-container">
                                    <h5>
                                        {
                                            p.product_color_variant.product.name +" ("+
                                            p.product_color_variant.color.name+", "+
                                            p.size.name+")"
                                        }
                                    </h5>
                                    <br/>
                                    <h6>Rs.
                                        {
                                            p.price-
                                            p.price/100*p.offer
                                        }
                                        <span className="ms-4 text-secondary text-decoration-line-through" >Rs.{p.price}</span>
                                        <span className="ms-4 text-success">{p.offer}% off</span>
                                    </h6>
  

                             {/* variant selection section starts */}
                                    <div className="product-variant-selection">

                                        <div className="color-selection">
                                            <h6 className="me-4">Colors available : </h6>
                                            {
                                                colorVariant && colorVariant.map((cv => (
                                                    <NavLink className="color-variant" key={cv.id} value={cv.product_color_variant.color.name} to={
                                                        `/${cv.product_color_variant.product.category.slug}/${cv.product_color_variant.product.slug}/${cv.product_color_variant.color.name}/${cv.size.name}/`
                                                        } >
                                                        <img 
                                                        src={
                                                            cv.product_color_variant.image1?
                                                            cv.product_color_variant.image1:
                                                            cv.product_color_variant.product.image_main
                                                        }
                                                        alt={p.product_color_variant.product.slug} 
                                                        />
                                                    </NavLink>
                                                )))
                                            }

                                        </div>

                                        <div className="size-selection">
                                            <h6 className="me-4">Size available : </h6>
                                            {
                                                sizeVariant && sizeVariant.map((sv => (
                                                    <NavLink className="size-variant" key={sv.id}
                                                    to={
                                                        `/${sv.product_color_variant.product.category.slug}/${sv.product_color_variant.product.slug}/${sv.product_color_variant.color.name}/${sv.size.name}/` 
                                                    }
                                                    >
                                                        {sv.size.name}
                                                    </NavLink>
                                                )))

                                            }

                                        </div>

                                    </div>

                                    <div className="add-to-cart-add-to-wishlist-container">
                                        <div className="add-to-cart me-3">
                                              <button className="btn btn-success" >Add to Cart</button>
                                        </div>
                                        <div className="add-to-wishlist">
                                            <button className="btn btn-primary">Add to Wishlist</button>
                                        </div>
                                    </div>

                                </div>
                            </>
                           ))
                           
                        }
            
              </div>
              <hr/>
              <div className="product-description-container mt-5" >
                <h5 className="text-center">Product Description</h5>
                
                    <div className="container mt-4">
                    {
                        singleProduct[0]&& 
                        singleProduct[0].product_color_variant.product.description
                    }
                        
                    </div>
            
              </div>

            </>
        );
    };
};

function UserDetailWrapper() {
    const { category,slug,color,size } = useParams();
  
    return <Product_Details category={category} slug={slug} color={color} size={size} />;
}
  
export default UserDetailWrapper;

// export default Product_Details;