import { PureComponent } from "react";
import axios from "axios";
import "./css/Products.css";
import { Link, NavLink, useParams } from "react-router-dom";

class Products extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            productVariants: [],
            productCategories:[],
            productsStateFilter:[],
        };
    }

    componentDidMount() {
        this.fetchCategory();
        this.fetchProductVariants();
    }

    componentDidUpdate(prevValue){
        if (this.props !== prevValue){
            this.filterByCategory();
            console.log('updated ',prevValue, this.props)
        }
    }

    fetchProductVariants = () => {
        axios
            .get("http://127.0.0.1:8000/api/product-variants/")
            .then((response) => {
                this.setState({ productVariants: response.data });
                this.setState({productsStateFilter:response.data});
            })
            .catch((error) => {
                console.log(error);
            });
    };

    fetchCategory = () => {
        axios.get('http://127.0.0.1:8000/api/categories/')
        .then((res) => {
             this.setState({productCategories:res.data})
        }).catch((error)=>{
            console.log(error)
        })
    };

    filterByCategory (pc=null){
        let productFilter = null
        const {category} = this.props
        if (category){
            productFilter = this.state.productVariants.filter((pv)=>{                
                return pv.product_color_variant.product.category.slug=== category
            });
            console.log('filter area ', category)
            this.setState({productsStateFilter:productFilter});
        };
    };

    render() { 
        console.log(this.props)
         
        return (
            <div className="category-product-container">
                <div className="categories-container">
                {   
                    this.state.productCategories&&
                    this.state.productCategories.map((pc)=>(
                        <NavLink to={`/${pc.slug}/`} className="each-category" onClick={()=> this.filterByCategory(pc.slug)} >
                            <p>
                                {pc.name}
                            </p>
                        </NavLink>
                    ))
                }
                   
                </div>
                <div className="products-container pt-4">
                    {
                    this.state.productsStateFilter&&
                    this.state.productsStateFilter.map((product) => (
                        <Link
                            className="product-details-link"
                            key={product.id}
                            to={`/${product.product_color_variant.product.category.slug}/${product.product_color_variant.product.slug}/${product.product_color_variant.color.name}/${product.size.name}/`}
                        >
                            <div className="each-product-container card  mx-2 mb-5" style={{ width: "14rem" ,height:"360px"}}>
                                <img
                                    style={{ width: "8rem", margin: "10px auto" }}
                                    src={
                                        product.product_color_variant.image1
                                            ? product.product_color_variant.image1
                                            : product.product_color_variant.product.image_main
                                    }
                                    className="card-img-top"
                                    alt="..."
                                />
                                <div className="card-body">
                                    <h6 className="card-title">
                                        {product.product_color_variant.product.name +
                                            " (" +
                                            product.product_color_variant.color.name +
                                            ", " +
                                            product.size.name +
                                            ")"}
                                    </h6>
                                    <h6 className="card-title">Rs.{
                                            product.price-
                                            product.price/100*product.offer                                    
                                        }
                                    </h6>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

export default function FilterHandler(){
    const {category} = useParams();
    return <Products category={category} />
};

