import { PureComponent } from "react";
import "./Products.css";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { accessToken, axiosWithAuthentication } from "intersepter/axios";
import { UserContext } from "contexts/contexts";
import { changeProductVariantsPage, 
    fetchProductCategories, fetchProductVariants, 
    fetchSearchingProductVariants } from "api/products";
import { deleteWishlistProduct } from "api/wishlist";
import { renderProductName, renderProductPrice } from "utils/productUtills";
import ProductList from "./components/ProductList";


class Products extends PureComponent {

    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            productVariants: [],
            productCategories:[],
            productLoader:false,
            totalItems:0,
            prevPage:null,
            nextPage:null,
            currentPage:1,
            wishlist:null,
            wishlistActionLoader:false,
            activeFilter:'',
        };
    };

    componentDidMount() {
        window.scrollTo(0,0);
        this.fetchCategory();
        this.fetchWishlist();
        const {category,price,page} = this.props
        this.fetchProductVariants(category,page?parseInt(page):false,price);
        this.handleActiveClass(price);
    };

    componentDidUpdate(prevProps){
        const {category,page,price} = this.props

        if(this.props !== prevProps){
            this.fetchProductVariants(category,page?parseInt(page):false,price);
        };
    };

    changeCategory = (category) => {
        this.setState({currentPage:1})
        this.setState({activeFilter:''})
        let url = `product-variants/?category=${category}`
        this.productVariantFetch(url)
    };

    fetchProductVariants = (category,page=null,price=null) => {

        this.setState({activeFilter:price});

        const _page = parseInt(this.props.page)
        const price_filter = this.props.price

        if (category==='search'){  
            if(_page){
                this.setState({currentPage:_page})
            } 
            this.searchProduct(this.props.query,_page)
        }else{
            this.setState({currentPage:1})

            this.setState({productLoader:true})           
            let url = ''

            if (category) {
                if (category&&page){
                    this.setState({currentPage:page})
                    if(price_filter){
                        url = `product-variants/?category=${category}&page=${page?page:_page}&price=${price_filter}` 
                    }else{
                        url = `product-variants/?category=${category}&page=${page?page:_page}` 
                    }               
                }
                if (category&&!page){
                    this.setState({currentPage:1})
                    if(price){
                        if (price_filter){
                            this.setState({currentPage:page===false?1:page?page:_page})
                            url = `product-variants/?category=${category}${_page?`&page=${page===false?1:page?page:_page}`:''}&price=${price?price:price_filter}`                   
                        }else{
                            url = `product-variants/?category=${category}${page?`&page=${page}`:''}&price=${price}` 
                        }
                    }else{
                        url = `product-variants/?category=${category}`
                    }
                }
            }          
            this.productVariantFetch(url)
        }      
    };

    productVariantFetch = (url) => {
        fetchProductVariants(url)
        .then((response) => {
            this.setState({ productVariants: response.data.results });
            this.setState({totalItems:response.data.count});
            if (this.props.currentUser){
                this.fetchWishlist()
            }
        })
        .catch((error) => {
        }).then(()=>{
            this.setState({productLoader:false})
            window.scrollTo(0,0)
        })
    };

    fetchCategory = () => {
        fetchProductCategories()
        .then((res) => {
            this.setState({productCategories:res.data})
        })
        .catch((error)=>{
        })
    };

    handleActiveClass = (filter) => {
        this.setState({activeFilter:filter})
    };

    searchProduct = (search_item,page=null) => {
        this.setState({productLoader:true})
        let url = `product-variants/?query=${search_item}`
        if(page){
            url = `product-variants/?page=${page}&query=${search_item}`
        }else{
            this.setState({currentPage:1})
        }

        fetchSearchingProductVariants(url)
        .then((res) => {
            this.setState({productVariants:res.data.results});
            this.setState({totalItems:res.data.count})
        }).catch((error)=> {
        }).then(() => {
            this.setState({productLoader:false});
        });
    };

    fetchWishlist = async () => { 
        if(!accessToken){
            return 
        }  
        await axiosWithAuthentication
        .get('wishlist/')
        .then((res)=>{
            this.setState({wishlist:res.data});
        }).catch((error)=>{
        }).then(()=>{
            this.setState({wishlistActionLoader:false})    
        })

    };

    createPopUp = (message, duration) => {
        const popUpElement = document.createElement('div');
        popUpElement.textContent = message;
        popUpElement.id = 'wishlist-message-box'
        popUpElement.style.position = 'fixed';
        popUpElement.style.bottom = '20%';
        popUpElement.style.left = '50%';
        popUpElement.style.transition = '0.4s lenear'
        popUpElement.style.transform = 'translate(-50%, -50%)';
        popUpElement.style.backgroundColor = '#292929';
        popUpElement.style.fontWeight = 'bold'
        popUpElement.style.color = '#14ab4f';
        popUpElement.style.padding = '15px';
        popUpElement.style.borderRadius = '5px';
        popUpElement.style.zIndex = '99';
      
        document.body.appendChild(popUpElement);
      
        setTimeout(() => {
          popUpElement.remove();
        }, duration);
    };
      
    addToWishlist = (event,product_variant_id) => {
        
        event.preventDefault();
        
        let loaderElement = event.currentTarget.parentNode.childNodes[0]
        let iconElement = event.currentTarget.parentNode.childNodes[1]

        iconElement.hidden = true
        loaderElement.hidden = false

        const wishlistData = {            
            product_variant:product_variant_id,
        };
    
        setTimeout(() => {
            axiosWithAuthentication
            .post('wishlist/add/',
            wishlistData        
            ).then((res)=>{
                this.fetchWishlist()
                const prodVar = this.state.productVariants.map((pv) => 
                    pv.id===product_variant_id? {...pv, in_wishlist:true}:pv
                );
                this.setState({productVariants:prodVar})
            }).catch((err) => {
            }).finally(()=>{

                iconElement.hidden = false
                loaderElement.hidden = true
        
                this.createPopUp('Added to your wishlist',2000)

            })
        }, 1000);
    };

    removeWishlist =  (event,product_id)=> {  
        
        event.preventDefault();

        let loaderElement = event.currentTarget.parentNode.childNodes[0]
        let iconElement = event.currentTarget.parentNode.childNodes[1]

        iconElement.hidden = true
        loaderElement.hidden = false


        let wishlist = null

        try{
            wishlist = this.state.wishlist.find(ws => ws.product_variant.id === product_id)
        }catch (error){
        }
        
        setTimeout(() => {  

            if(wishlist){  
                deleteWishlistProduct(wishlist)
                .then((res)=>{
                    this.fetchWishlist();
                    const prodVar = this.state.productVariants.map((pv) => 
                        pv.id===product_id? {...pv, in_wishlist:false}:pv
                    );
                    this.setState({productVariants:prodVar})
    
                }).catch((err)=>{
                }).finally(()=>{

                    iconElement.hidden = false
                    loaderElement.hidden = true
                        
                    this.createPopUp('Removed from your wishlist',2000)

                })
            }else{
                iconElement.hidden = false
                loaderElement.hidden = true
            }
        }, 1000);
    };

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
            changeProductVariantsPage(page)
            .then((response)=>{
                this.setState({productVariants: response.data.results});
                this.setState({totalItems:response.data.count});
            })
            .catch((error)=>{
            })
            window.scrollTo(0,0)           
        }    
    };

    wishlistCheck = (product) => {
        if(this.context){
            if (product.in_wishlist){               
                return <span onClick={ event => this.removeWishlist(event,product.id)} >
                            <FaHeart style={{color:"rgb(229 4 80)"}} className='wishlist-remove-btn' />
                        </span>
            }else{
                return <span onClick={ event => this.addToWishlist(event,product.id)} >
                            <FaHeart className='wishlist-remove-btn' />
                        </span>
            }
        }else{
            return <Link to={'/user/login/'} className='wishlist-remove-btn'>
                       <FaHeart className='wishlist-remove-btn'/>
                   </Link>
        }    
    };


    render() { 
        const {category,query,price} = this.props
        const {
            productCategories,
            productVariants,
            productLoader,
            totalItems,
            currentPage,
            activeFilter
        }  = this.state

        const item_per_page = 8

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
                <Link
                key={i}
                to={category==='search'?`/search/?query=${query}`:
                    category===undefined?`/?page=${i}`:`/${category}/?page=${i}`}
                className="btn btn-sm btn-outline-primary me-1 active">{i}</Link>

                :<Link
                key={i} 
                to={
                    category==='search'?
                    `/search/?query=${query}`:
                    category&&price?`/${category}/?page=${i}&price=${price}`:
                    `/${category}/?page=${i}`}
                className="btn btn-sm btn-outline-primary me-1"
                onClick={() => this.changePage(i)}>{i}</Link>                
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
                                    onClick={()=> this.changeCategory(pc.slug)} >
                                        <div>
                                            {pc.name}
                                        </div>
                                    </NavLink>
                                ))
                            }
                        
                        </div>


                        <div className="products-container pt-4">
                            
                            {
                                category !== 'search'&&
                                <div className="product-filter-container w-100 ms-2 mb-5">  
                                    <Link
                                    className={`filter-by-price ${activeFilter==='low'?'active':''}`}
                                    to={`/${category}/?page=1&price=low`}
                                    onClick={
                                        () => {this.fetchProductVariants(category,false,'low')}
                                    } 
                                    >
                                        Price low to high
                                    </Link>
                                
                                    <Link
                                    className={`filter-by-price ${activeFilter==='high'?'active':''}`}
                                    to={`/${category}/?page=1&price=high`}
                                    onClick={() => {this.fetchProductVariants(category,false,'high')}}
                                    >
                                        Price high to low
                                    </Link>               
                               </div>
                            }


                            {query&&category==='search'&&
                                <h4 className="text-center mb-5 w-100" >searched for "{query}"</h4>}

                            <ProductList 
                               productVariants={productVariants} 
                               productLoader={productLoader}
                               wishlistCheck={this.wishlistCheck} />

                            {
                                productLoader&&
                                <div className="products-loader-container">
                                    <div className="products-loader "></div>
                                </div>
                            }

                                
                            {
                                !productLoader&&productVariants.length>0&&
                                <div className="w-100 d-flex justify-content-center mt-3">

                                    <Link 
                                    to={
                                        category==='search'?
                                        `/search/?query=${query}&page=${currentPage!==1?currentPage-1:currentPage}`:
                                        category===undefined?`/?page=${currentPage!==1?currentPage-1:currentPage}`:
                                        price?`/${category}/?page=${currentPage!==1?currentPage-1:currentPage}&price=${price}`:
                                        `/${category}/?page=${currentPage!==1?currentPage-1:currentPage}`
                                    }
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => this.changePage(
                                        currentPage!==1?currentPage-1:currentPage
                                    )}>
                                        prev
                                    </Link>

                                    {pages}

                                    <Link 
                                    to={
                                        category==='search'?
                                        `/search/?query=${query}&page=${currentPage!==pages_nums?currentPage+1:currentPage}`:
                                        category===undefined?`/?page=${currentPage!==pages_nums?currentPage+1:currentPage}`:
                                        price?`/${category}/?page=${currentPage !==pages_nums?currentPage+1:currentPage}&price=${price}`:
                                        `/${category}/?page=${currentPage!==pages_nums?currentPage+1:currentPage}`
                                    }
                                    className="btn btn-sm btn-outline-primary ms-1"
                                    onClick={()=>this.changePage(
                                        currentPage!==pages_nums?currentPage+1:currentPage
                                    )}>
                                        next
                                    </Link>

                                </div>
                            }
                        </div>


                </div>
            </>
        );
    }
}

export default function FilterHandler(){
    const {category} = useParams();
    const [searchParams] = useSearchParams();
    const query =  searchParams.get('query');
    const page = searchParams.get('page');
    const price = searchParams.get('price');
    return <Products query={query} category={category} page={page} price={price} />
};

