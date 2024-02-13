import React, {FC} from "react";
import {Link} from "react-router-dom";
import imgPlaceholder from "../../hooks_and_utils/imgPlaceholder";
import displayInt from "../../hooks_and_utils/displayInt"
import shortField from "../../hooks_and_utils/short_field";
import {RestorationType} from "../../interfaces";


const CatalogCard: FC<RestorationType> = ({
                                          id,
                                          name,
                                          image,
                                          description,
                                          given_sum,
                                          total_sum,
                                      }) => {
    return (
        <Link className="card_href" to={`/restoration/${id}`}>
            <div className="card mb-4 ">
                <div className="text-center">
                    <img
                        className="card-img-top img-fluid max-height-200"
                        src={image ? image : process.env.PUBLIC_URL + "/src/card_img_placeholder.jpg"}
                        alt="Restoration Image"
                        onError={imgPlaceholder}
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title ">{shortField(name)}</h5>
                    <p className="card-text small mb-2">{shortField(description)}</p>
                    <p className="card-text text-center">
                        {displayInt(given_sum)} / {displayInt(total_sum)}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default CatalogCard;
