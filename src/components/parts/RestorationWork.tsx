import React, {FC} from "react";
import {
    useIsWorkDonationInBasketByWorkID,
    useIsWorkDonationInPaymentsByWorkID,
    useIsWorkDonationSuccesedByWorkID
} from "../../redux/dataSlice";
import percent from "../../hooks_and_utils/countPercent";
import {WorkType} from "../../interfaces";
import {getWorkStatus} from "../../hooks_and_utils/statuses"


interface RestorationWorkProps {
    work: WorkType;
    handleAddDonation: (work_id: number, inBasket: boolean,
                        inPayments: boolean, isSuccesed: boolean) => any
}


const RestorationWork: FC<RestorationWorkProps> = ({work, handleAddDonation}) => {
    const id = work.id
    const inBasket = useIsWorkDonationInBasketByWorkID(id);
    const inPayments = useIsWorkDonationInPaymentsByWorkID(id);
    const isSuccesed = useIsWorkDonationSuccesedByWorkID(id);

    const getButton = () => {
        if (inBasket || inPayments) return "/src/plus_blue.svg";
        if (isSuccesed) return "/src/plus_green.svg"
        return "/src/plus_stock.svg"
    };

    return (
        <tr key={id}>
            <td>{work.name}</td>
            <td>{work.given_sum}</td>
            <td>{work.total_sum}</td>
            <td className="text-center">{percent(work.given_sum, work.total_sum)}</td>
            <td className="text-center">{getWorkStatus(work.status)[1]}</td>
            <td className="text-center">
                <img
                    onClick={() => handleAddDonation(work.id, inBasket, inPayments, isSuccesed)}
                    width={30}
                    height={30}
                    src={process.env.PUBLIC_URL + getButton()}
                />
            </td>
        </tr>


    );
};


export default RestorationWork;
