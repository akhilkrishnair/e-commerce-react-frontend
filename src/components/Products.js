import { PureComponent } from "react";
import axios from "axios";
import "./css/Products.css";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import { baseUrl } from "../App";


class Products extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            productVariants: [],
            productCategories:[],
            productLoader:true,
            totalItems:0,
            prevPage:null,
            nextPage:null,
            currentPage:1,
        };
    }

    componentDidMount() {
        window.scrollTo(0,0);
        this.fetchCategory();
        const {category} = this.props
        this.fetchProductVariants(category);
    }

    componentDidUpdate(prevValue){
        const {category,query} = this.props
        if (category === 'search' && query !== prevValue.query){
            this.searchProduct(query)
            this.setState({currentPage:1})
        }
    };


    fetchProductVariants = async (category,page=null) => {
        
        if (category==='search'){           
            this.searchProduct(this.props.query)
        }else{
            this.setState({productLoader:true})
    
            let url = baseUrl+"product-variants/"
    
            if (category){
                this.setState({currentPage:1})
                url = `${baseUrl}product-variants/?category=${category}`
            }
    
            if(page){
                this.setState({currentPage:page})
                url = `${baseUrl}product-variants/?category=${category}&page=${page}`
            }
    
            axios
                .get(url)
                .then((response) => {
                    this.setState({ productVariants: response.data.results });
                    this.setState({totalItems:response.data.count});
     
                })
                .catch((error) => {
                    console.log(error);
                }).then(()=>{
                    this.setState({productLoader:false})
                })

        }
        
    };


    fetchCategory = () => {
        axios.get(baseUrl+'categories/')
        .then((res) => {
            this.setState({productCategories:res.data})
        }).catch((error)=>{
            console.log(error)
        })
    };




    searchProduct = (search_item,page=null) => {
        let url = `${baseUrl}product-variants/?query=${search_item}`
        if(page){
            url = `${baseUrl}product-variants/?page=${page}&query=${search_item}`
        }else{
            this.setState({currentPage:1})
        }
        axios
        .get(url)
        .then((res) => {
            this.setState({productVariants:res.data.results});
            this.setState({totalItems:res.data.count})
        }).catch((error)=> {
            console.log(error);
        });
    }



    changePage = (page)=>{

        this.setState({currentPage:page})

        const {category,query} = this.props
        
        if (category){
            if (category==='search'){
                this.searchProduct(query,page)
            }else{
                this.fetchProductVariants(category,page)
            }
        }else{
            let url = `${baseUrl}product-variants/?page=${page}`
            axios
            .get(url)
            .then((response)=>{
                this.setState({productVariants: response.data.results});
                this.setState({totalItems:response.data.count});
            }).catch((error)=>{
                console.log(error)
            })
            window.scrollTo(0,0)           
        }

        
    }



    render() { 

        const {category,query} = this.props

        const {productCategories,
            productVariants,
            productLoader,
            totalItems,
            currentPage
        }  = this.state

        const item_per_page = 6
        let pages_nums = Math.ceil(totalItems/item_per_page)

        const pageRange = 2;
        
        let startPage = Math.max(1, currentPage - pageRange);
        let endPage = Math.min(pages_nums, currentPage + pageRange);
        
        const pageCount = pageRange * 2 + 1;
        if (endPage - startPage + 1 < pageCount) {
            if (currentPage < pages_nums - pageRange) {
            endPage = Math.min(pages_nums, startPage + pageCount - 1);
            } else {
            startPage = Math.max(1, endPage - pageCount + 1);
            }
        }

        let pages = []

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                currentPage===i?
                <button
                key={i} 
                className="btn btn-sm btn-outline-primary me-1 active">
                    {i}
                </button>
                :<button
                key={i} 
                className="btn btn-sm btn-outline-primary me-1"
                onClick={() => this.changePage(i)}>
                    {i}
                </button>                
            )
        }


        return (
            <>

                <div className="category-product-container">

                        <div className="categories-container">
                            <h5 className="text-center me-4 mb-3">All Categories</h5>
                            {   
                                productCategories&&
                                productCategories.map((pc)=>(
                                    <NavLink 
                                    key={pc.id} 
                                    to={`/${pc.slug}/`} 
                                    className="each-category" 
                                    onClick={()=> this.fetchProductVariants(pc.slug)} >
                                        <div>
                                            {pc.name}
                                        </div>
                                    </NavLink>
                                ))
                            }
                        
                        </div>
                    <div className="products-container pt-4">

                        {
                            query&&category==='search'&&
                            <h4 className="text-center mb-5 w-100" >searched for "{query}"</h4>
                        }


                        {
                            productVariants&&!productLoader&&
                            productVariants.map((product) => (
                                <Link
                                    className="product-details-link mt-3" 
                                    key={product.id}
                                    to={`/${product.product_color_variant.product.category.slug}/${product.product_color_variant.product.slug}/${product.product_color_variant.color.name}/${product.size.name}/${product.product_color_variant.product.id}/`}
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
                            ))
                        }

                        {
                            productLoader&&
                            <div className="products-loader-container">
                                <div className="products-loader "></div>
                            </div>
                        }

                            
                        {
                            !productLoader&&productVariants.length>0&&
                            <div className="w-100 d-flex justify-content-center mt-3">

                                <button 
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => this.changePage(
                                    currentPage!==1?currentPage-1:currentPage
                                )}>
                                    prev
                                </button>

                                {pages}

                                <button 
                                className="btn btn-sm btn-outline-primary ms-1"
                                onClick={()=>this.changePage(
                                    currentPage!==pages_nums?currentPage+1:currentPage
                                )}>
                                    next
                                </button>

                            </div>
                        }
                    </div>


                </div>
            </>
        );
    }
}

export default function FilterHandler(){
    const {category,} = useParams();
    const [searchParams] = useSearchParams();
    const query =  searchParams.get('query');
    return <Products query={query} category={category} />
};

