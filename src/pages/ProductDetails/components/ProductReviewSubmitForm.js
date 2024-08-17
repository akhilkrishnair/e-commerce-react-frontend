import { PureComponent } from "react";

class ProductReviewSubmitForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {reviewSubmitHandle,
            productReviewError,
            productReviewLoading,
            productReviewSubmitted,
            handleReviewText} = this.props

        return (
            <div className='review-submit-form-container'>
                <h5>Give a review for this product</h5>
                <form onSubmit={reviewSubmitHandle}>
                    <div className='reveiw-text mb-2'>
                        <textarea 
                        onChange={handleReviewText}
                        name='productReviewText' 
                        className='form-control border border-secondary'
                        required 
                        rows={5}>
                        </textarea>
                    </div>

                    {
                        !productReviewLoading?
                        <div className='submit-btn-container'>
                            {
                                productReviewSubmitted&&
                                <div className='review-submit-response'>review submited</div>
                            }
                            {
                                productReviewError&&
                                <div className='text-danger review-submit-response'>!{productReviewError}</div>
                            }
                            <button type='submit' className='btn btn-sm btn-success w-25'>Submit</button>
                        </div>:
                        <div className=' submit-btn-container'>
                            <div className='btn btn-success d-flex justify-content-center w-25'>
                                <div className='review-submit-loader'></div>
                            </div>
                        </div>                                   
                    }
                </form>
            </div>
        );
    }
}

export default ProductReviewSubmitForm;