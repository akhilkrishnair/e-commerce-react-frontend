import { baseUrl } from "intersepter/axios";
import { PureComponent } from "react";


class ProductReviews extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {reviewFiltered} = this.props
        return (
            <>
             { reviewFiltered&&reviewFiltered.map((pr) => (
                <div key={pr.id} className='each-review-container'>
                    <div className='user-details'>
                        <div className='user-img'>
                            <img 
                            src={pr.user_info.user_image[1] !=='h'?baseUrl+pr.user_info.user_image:pr.user_info.user_image}
                            alt={pr.user_info.user_name} />
                        </div>
                        <h6 className='username'>{pr.user_info.user_name}</h6>
                        
                        <span style={{"marginLeft":"auto"}}>{pr.date}</span>
                        
                    </div>
                    <p className='user-review'>
                        {pr.review}
                    </p>
                </div>
                ))}
            </>
        );
    }
}

export default ProductReviews;