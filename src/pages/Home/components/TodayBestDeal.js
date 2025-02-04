import { PureComponent } from "react";
import "./TodayBestDeal.css";
import { Link } from "react-router-dom";
import { renderProductName } from "utils/productUtills";

class TodayBestDeal extends PureComponent {
    render() {
        const { bestDealProducts, imageChangeHandle, mouseLeaveHandle } =
            this.props;

        return (
            <>
                {bestDealProducts && (
                    <div className="today-best-deal-container">
                        <h3 className="mb-4 ms-3">Today's best deal</h3>

                        <div className="best-deal-product-variants-container">
                            {bestDealProducts.map((bdp) => (
                                <Link
                                    key={bdp.id}
                                    target="_blank"
                                    to={`/${bdp.product_color_variant.product.category.slug}/${bdp.product_color_variant.product.slug}/${bdp.product_color_variant.color.name}/${bdp.size.name}/${bdp.product_color_variant.product.id}/`}
                                    className="best-deal-each-product-variant"
                                >
                                    <div className="best-deal-product-image-container">
                                        <img
                                            onMouseOver={(e) =>
                                                imageChangeHandle(
                                                    e,
                                                    bdp.product_color_variant
                                                        .image3
                                                        ? bdp
                                                              .product_color_variant
                                                              .image3
                                                        : bdp
                                                              .product_color_variant
                                                              .product
                                                              .image_main
                                                )
                                            }
                                            onMouseLeave={(e) =>
                                                mouseLeaveHandle(
                                                    e,
                                                    bdp.product_color_variant
                                                        .image1
                                                        ? bdp
                                                              .product_color_variant
                                                              .image1
                                                        : bdp
                                                              .product_color_variant
                                                              .product
                                                              .image_main
                                                )
                                            }
                                            src={
                                                bdp.product_color_variant.image1
                                                    ? bdp.product_color_variant
                                                          .image1
                                                    : bdp.product_color_variant
                                                          .product.image_main
                                            }
                                            alt={
                                                bdp.product_color_variant
                                                    .product.slug
                                            }
                                        />
                                    </div>
                                    <div className="best-deal-product-variant-details">
                                        <h6 className="title">
                                            {renderProductName({
                                                product: bdp,
                                            })}
                                        </h6>
                                        <div className="price-and-offer">
                                            <span className="selling-price">
                                                Rs.
                                                {bdp.price -
                                                    (bdp.price / 100) *
                                                        bdp.offer}
                                            </span>
                                            <span className="orginal-price">
                                                Rs.{bdp.price}
                                            </span>
                                            <span className="offer">
                                                off {bdp.offer}%
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default TodayBestDeal;
