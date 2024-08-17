import { PureComponent } from "react";

class ProductDiscription extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            this.props.productDescription&&!this.props.productDescriptionLoading
            &&<div className="product-description-container mt-5" >
                <h3 className="section-title">Product Description</h3>
                
                {
                    this.props.productDescription.map((pd, index) => (
                        <div key={pd.id} className={`each-description ${index % 2 === 0?"right":"left"}`}>
                            {
                                pd.image?
                                <div className='description-img'>
                                    <img src={pd.image} alt={pd.discription_title} />
                                </div>:null
                            }
                            <div className='description-details'>
                                <h6>{pd.discription_title}</h6>
                                <p>{pd.description}</p>
                            </div>
                        </div>
                    ))  
                }
            </div>
        );
    }
}

export default ProductDiscription;