import { PureComponent } from "react";
import { CollectionLoader } from "components/components";
import { Link } from "react-router-dom";

class OurCollection extends PureComponent {

    render() {

        const {categories} = this.props

        return (
            <div className="our-collection-container">
                    <h3 className="text-center w-100 mb-4">Our Collections</h3>

                    {
                        !categories?
                            <>
                                <CollectionLoader/>
                                <CollectionLoader/>
                                <CollectionLoader/>
                                <CollectionLoader/>
                            </>:
                                categories.map((c) => (
                                    <Link 
                                        key={c.id}
                                        className="each-collection-container"
                                        to={`/${c.slug}/`}>
                                        <div className="collection-img-container">
                                            <img src={c.image} alt={c.slug}/>
                                        </div>
                                        <h6 className="text-center">{c.name}</h6>

                                    </Link>
                                ))
                    }
                </div>
        );
    }
}

export default OurCollection;