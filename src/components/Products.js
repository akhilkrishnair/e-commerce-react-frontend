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
            currentPage:1,
            itemPerPage:4,
            click:0,
        };
    }

    componentDidMount() {
        this.fetchCategory();
        this.fetchProductVariants();
    }

    componentDidUpdate(prevValue){
        const {category,search_item} = this.props
        if (this.props !== prevValue){
            this.filterByCategory();
            console.log('updated ',prevValue, this.props)
        }
        if (category === 'search' && search_item !== prevValue.search_item){
            axios
            .get(`http://127.0.0.1:8000/api/product-variants/?query=${search_item}`)
            .then((res) => {
                this.setState({productsStateFilter:res.data});
                console.log(this.state.productsStateFilter)
                console.log(res.data)
            }).catch((error)=> {
                console.log(error);
            });
        }
    };

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
        if (category!=='search'){
            productFilter = this.state.productVariants.filter((pv)=>{                
                return pv.product_color_variant.product.category.slug === category
            });
            this.setState({productsStateFilter:productFilter});
        };
        console.log(this.props)

     
        if (!category){
            this.setState({productsStateFilter:this.state.productVariants})
        }  
    };

    changePage = (page)=>{
        this.setState({currentPage:page});
    }

    render() { 
        const {search_item,category} = this.props
        const {productCategories,
            productsStateFilter,
            itemPerPage,
            currentPage,
            click}  = this.state
        let pages =  Math.round(productsStateFilter.length/itemPerPage)
        const pages_decimal_num = productsStateFilter.length/itemPerPage

        if (pages<pages_decimal_num){
            pages+=1
        }

        const current_page_last_index = currentPage*itemPerPage
        const current_page_first_index = current_page_last_index-itemPerPage
        const all_pages = [] 
        for (let i=1; i<=pages; i++){
            all_pages.push(i)
        }
        const productsFiltered = productsStateFilter.slice(current_page_first_index,current_page_last_index)
        console.log(click)
        return (
            <>
            {
                search_item&&category==='search'&&
                <h4 className="text-center mb-3" >searched for "{search_item}"</h4>
            }
            <div className="category-product-container">
                <div className="categories-container">
                {   
                    productCategories&&
                    productCategories.map((pc)=>(
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
                    productsFiltered&&
                    productsFiltered.map((product) => (
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

            <div className="d-flex justify-content-center" aria-label="...">
                <ul className="pagination">
                    {
                        <li className="page-item">
                            <Link 
                            className="page-link"
                            to={`/search/?query=${search_item}`}
                            onClick={()=>this.changePage(
                                currentPage!==1?
                                currentPage-1:currentPage
                                )}>
                                Previous
                            </Link>
                        </li>
                    }

                    {
                        all_pages.map((page)=>(
                            <li className="page-item">
                                <Link 
                                className={`page-link ${currentPage===page?'active':''}`} 
                                onClick={()=>this.changePage(page)}>
                                    {page}
                                </Link>
                            </li>
                        ))
                    }

                    {
                        <li className="page-item">
                            <Link 
                            className="page-link" 
                            to={`/search/?query=${search_item}`}
                            onClick={()=> this.changePage(
                                currentPage!==pages?
                                currentPage+1:currentPage
                                
                                )}>
                                Next
                            </Link>
                        </li>
                    }
                </ul>
            </div>

            </>
        );
    }
}

export default function FilterHandler({search_item}){
    const {category} = useParams();
    console.log("func ",search_item)
    return <Products search_item={search_item} category={category} />
};

