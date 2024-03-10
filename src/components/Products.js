import { PureComponent } from "react";
import axios from "axios";
import "./css/Products.css";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import { baseUrl } from "../App";
import { FaHeart } from "react-icons/fa";


class Products extends PureComponent {
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
 
        if(category !== prevValue.category||query!==prevValue.query){
            if (category === 'search' && query !== prevValue.query){
                this.searchProduct(query)
                this.setState({currentPage:1})
            }else{
                this.fetchProductVariants(category);
            }
        }
    };


    fetchProductVariants = async (category,page=null) => {
        
        if (category==='search'){  
            const search_page = parseInt(this.props.page)
            if(search_page){
                this.setState({currentPage:search_page})
            } 
            this.searchProduct(this.props.query,this.props.page)
        }else if(category===undefined&&this.props.page){
            this.setState({currentPage:this.props.page})
            this.changePage(this.props.page)
        }else{
            this.setState({productLoader:true})
            this.setState({currentPage:1})
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
                    if (this.props.currentUser){
                        this.fetchWishlist()
                    }
     
                })
                .catch((error) => {
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
        })
    };




    searchProduct = (search_item,page=null) => {
        this.setState({productLoader:true})
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
        }).then(() => {
            this.setState({productLoader:false});
        });

    }



    fetchWishlist = async () => {   
        await axios
        .get(baseUrl+'wishlist/')
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
      }


    addToWishlist = (event,product_variant_id) => {
        
        let message_box = document.getElementById('wishlist-message-box')
        if (message_box){
            message_box.remove()
        }
        event.preventDefault();

        let loader_element = document.getElementsByClassName('wishlist-action-loader '+product_variant_id)[0]
        let wishlist_button_container = document.getElementsByClassName('wishlist-button-container '+product_variant_id)[0]
        loader_element.style.display = 'block'
        wishlist_button_container.style.display = 'none'
        

        const wishlistData = {            
            product_variant:product_variant_id,
        };
    
        axios.post(baseUrl+'wishlist/add/',
        wishlistData        
        ).then((res)=>{
            this.fetchWishlist()
            const prodVar = this.state.productVariants.map((pv) => 
                pv.id===product_variant_id? {...pv, in_wishlist:true}:pv
            );
            this.setState({productVariants:prodVar})
        }).catch((err) => {
        }).then(()=>{
            loader_element.style.display = 'none'
            wishlist_button_container.style.display = 'block'
            this.createPopUp('Added to your wishlist',2000)
        })
    };


    removeWishlist =  (event,product_id)=> {  
        
        let message_box = document.getElementById('wishlist-message-box')
        if (message_box){
            message_box.remove()
        }

        event.preventDefault();
        let loader_element = document.getElementsByClassName('wishlist-action-loader '+product_id)[0]
        let wishlist_button_container = document.getElementsByClassName('wishlist-button-container '+product_id)[0]
        loader_element.style.display = 'block'
        wishlist_button_container.style.display = 'none'
     
        let wishlist = null


        try{
            wishlist = this.state.wishlist.find(ws => ws.product_variant.id === product_id)
        }catch (error){
        }
        


        if(wishlist){

            const data = {
                wishlist_id:wishlist.id
            }
    
            axios
            .post(baseUrl+'wishlist/delete/',
            data)
            .then((res)=>{
                this.fetchWishlist();
                const prodVar = this.state.productVariants.map((pv) => 
                    pv.id===product_id? {...pv, in_wishlist:false}:pv
                );
                this.setState({productVariants:prodVar})
            }).catch((err)=>{
            }).then(()=>{
                loader_element.style.display = 'none'
                wishlist_button_container.style.display = 'block' 
                this.createPopUp('Removed from your wishlist',2000)
   
            })
            
        }else{
            loader_element.style.display = 'none'
            wishlist_button_container.style.display = 'block'
        }
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
            })
            window.scrollTo(0,0)           
        }
       
    }


    wishlistCheck = (product) => {
        
        if(this.props.currentUser){
            if (product.in_wishlist){               
                return <FaHeart className={`text-success wishlist-remove-btn ${product.id}`} onClick={ event => this.removeWishlist(event,product.id)}/>
            }else{
                return <FaHeart className={`wishlist-remove-btn ${product.id}`} onClick={ event => this.addToWishlist(event,product.id)}/>
            }
        }else{
            return <Link to={'/user/login/'} className={`text-success wishlist-remove-btn ${product.id}`}>
                       <FaHeart className={`wishlist-remove-btn ${product.id}`}/>
                   </Link>
        }
      
    }



    render() { 

        const {category,query} = this.props
        parseInt(category)
        const {productCategories,
            productVariants,
            productLoader,
            totalItems,
            currentPage
        }  = this.state
        const item_per_page = 3
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
                currentPage==i?
                <Link
                key={i}
                to={
                    category==='search'?
                    `/search/?query=${query}`:
                    category===undefined?`/?page=${i}`:
                    `/${category}/?page=${i}`
                }
                className="btn btn-sm btn-outline-primary me-1 active">
                    {i}
                </Link>

                :<Link
                key={i} 
                to={
                    category==='search'?
                    `/search/?query=${query}`:
                    category===undefined?`/?page=${i}`:
                    `/${category}/?page=${i}`
                }
                className="btn btn-sm btn-outline-primary me-1"
                onClick={() => this.changePage(i)}>
                    {i}
                </Link>                
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
                                    className={`product-details-link mb-5 ${window.innerWidth > 500?"mt-3":"mt1"}` }
                                    key={product.id}
                                    to={`/${product.product_color_variant.product.category.slug}/${product.product_color_variant.product.slug}/${product.product_color_variant.color.name}/${product.size.name}/${product.product_color_variant.product.id}/`}
                                >
                                    <div className="each-product-container card  mx-2" >
                                      
                                        <div className={`product-add-wishlist-icon`}>

                                            {<div className={`wishlist-action-loader ${product.id}`}></div>}
                                             
                                            <div className={`wishlist-button-container ${product.id}`}>
                                                {this.wishlistCheck(product)}
                                            </div>

                                        </div>

                                        <img
                                            
                                            src={
                                                product.product_color_variant.image1
                                                    ? product.product_color_variant.image1
                                                    : product.product_color_variant.product.image_main
                                            }
                                            className="card-img-top"
                                            alt="..."
                                        />

                                        
                        
                                        <div className={window.innerWidth > 500?"card-body":""}>

                                            <h6 className="card-title">Rs.{
                                                    product.price-
                                                    product.price/100*product.offer                                    
                                                }
                                                <span className="text-secondary text-decoration-line-through ms-2">Rs.{product.price}</span>
                                                <span className="text-success ms-2" >{product.offer}%</span>
                                            </h6>

                                            <p className="card-title">
                                                {product.product_color_variant.product.name +
                                                    " (" +
                                                    product.product_color_variant.color.name+
                                                    ", " +
                                                    product.size.name +
                                                    ")"}
                                            </p>

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

                                <Link 
                                 to={
                                    category==='search'?
                                    `/search/?query=${query}&page=${currentPage!==1?currentPage-1:currentPage}`:
                                    category===undefined?`/?page=${currentPage!==1?currentPage-1:currentPage}`:
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

export default function FilterHandler({currentUser}){
    const {category,} = useParams();
    const [searchParams] = useSearchParams();
    const query =  searchParams.get('query');
    const page = searchParams.get('page')
    return <Products query={query} category={category} page={page} currentUser={currentUser} />
};

