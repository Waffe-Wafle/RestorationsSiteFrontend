import React, { FC, memo, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import useFetch from '../../hooks_and_utils/useFetch.js';
import { RestoreAPI } from '../../api';
import {DonationType, PaymentType} from "../../interfaces";
import {getPaymentStatus} from "../../hooks_and_utils/statuses";


interface PaymentCardProps {
    payment: PaymentType;
    handleDel: (paymentId: number) => void;
}


const PaymentCard: FC<PaymentCardProps> = memo(({ payment, handleDel }) => {
    const [donationsList, setDonationsList] = useState<DonationType[]>([]);

    const { data, loading, error, doFetch } = useFetch(
        RestoreAPI +  "payments/" + payment.id ,
        {method: 'GET'},
        data => setDonationsList(data.donations)
    );

    useEffect(() => {
        doFetch();
    }, []);

    return (
        <tr key={payment.id}>
            <td>{payment.code}</td>
            <td>{payment.given_sum}</td>
            {/*<td>{payment.donations[1}</td>*/}
            <td>{payment.date_pay}</td>
            <td>{getPaymentStatus(payment.status)[1]}</td>
            <td>
                <div className="d-flex flex-column align-items-center">
                    {donationsList.map(
                        donation => (
                            <Button
                                key={donation.work_id}
                                className="small btn btn-primary m-1 btn-sm  w-75"
                                href={"#/restoration/" + donation.restore_id}
                            >
                                {donation.work}
                            </Button>
                        )
                    )}
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center flex-column ">
                    <Button className=" btn-sm" variant="danger"
                            onClick={() => handleDel(payment.id)}>
                        Удалить
                    </Button>
                </div>
            </td>
        </tr>

    );
});


export default PaymentCard;
