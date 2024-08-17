import { PureComponent } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

class ProductReviewsPaginator extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const {currentPage,
            all_pages,
            pages,
            reviewPaginator,
            changeReviewPage
        } = this.props
        return (
            <div className='review-paginator-container'>
                                    
            {
                pages !== 0&&
                <button
                onClick={() => changeReviewPage(
                    currentPage>1?currentPage-1:currentPage)} 
                className='btn btn-sm btn-outline-dark me-3'>
                    <FaArrowLeft/>
                </button>
            }
           
            {
                all_pages.map((page) => (
                    <button 
                    key={page}
                    onClick={() => changeReviewPage(page)}
                    className={`me-1 btn btn-sm ${reviewPaginator.currentPage===page?"btn-dark": "btn-outline-dark"} `}>
                    {page}</button>
                ))
            }

            {
                pages !==0&&
                <button 
                onClick={() => changeReviewPage(
                    currentPage !==pages?currentPage+1:currentPage
                )}
                className='btn btn-sm btn-outline-dark ms-2'>
                    <FaArrowRight/>
                </button>
            }
       </div>
        );
    }
}

export default ProductReviewsPaginator;