import React, { FC, useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import useFetch from "../../hooks_and_utils/useFetch";
import { RestoreAPI } from '../../api';
import { DonationType, PaymentType, RegroupedDonation } from "../../interfaces";
import { getPaymentStatus } from "../../hooks_and_utils/statuses";
import { paymentStatusMap } from "../../hooks_and_utils/statuses";
import summarizeDonations from "../../hooks_and_utils/groupWorksByRestoreInPayment";

interface ManagerPaymentCardProps {
    payment: PaymentType;
    setStatus: (status: string, id: string) => void;
}

const ManagerPaymentCard: FC<ManagerPaymentCardProps> = ({ payment, setStatus }) => {
    const isPaid = payment.status === 'Paid';
    const paymentId = payment.id.toString();

    const [works_data, setWorksData] = useState([] as DonationType[]);
    const [showData, setShowData] = useState(false);
    const regroupedDonations: RegroupedDonation[] = summarizeDonations(works_data);

    const { data, loading, error, doFetch } = useFetch(
        RestoreAPI + "payments/" + payment.id,
        { method: 'GET' },
        data => setWorksData(data.donations)
    );

    const handleConfirm = () => {
        setStatus(paymentStatusMap[3][0], paymentId);
    };

    const handleReject = () => {
        setStatus(paymentStatusMap[2][0], paymentId);
    };

    const toggleShowData = () => {
        if (!regroupedDonations.length) doFetch();
        setShowData(prevState => !prevState);
    };

    return (
        <>
            <tr key={payment.id}>
                <td>{payment.date_open}</td>
                <td>{payment.code}</td>
                <td>{payment.given_sum}</td>
                <td>{getPaymentStatus(payment.status)[1]}</td>
                <td>
                    <div className="d-flex justify-content-center">
                        {isPaid && (
                            <>
                                <Button className="btn-sm " onClick={toggleShowData}>
                                    {showData ? 'Скрыть данные' : 'Открыть данные'}
                                </Button>

                                <Button
                                    className="btn-sm ml-1"
                                    variant="success"
                                    onClick={() => handleConfirm()}
                                >
                                    Принять
                                </Button>
                                <Button
                                    className="btn-sm  ml-1"
                                    variant="danger"
                                    onClick={() => handleReject()}
                                >
                                    Отклонить
                                </Button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
            {showData && regroupedDonations.length > 0 && (
                <tr className="text-center">
                    <td colSpan={5} className="align-middle">
                        <table>
                            <tbody>
                            {regroupedDonations.map((donation, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={donation.worksDonations.length}>{donation.restore_name}</td>
                                        <td rowSpan={donation.worksDonations.length}>{donation.restore_bank}</td>
                                        <td>{donation.worksDonations[0].work}</td>
                                        <td>{donation.worksDonations[0].given_sum}</td>
                                    </tr>
                                    {donation.worksDonations.slice(1).map((work, idx) => (
                                        <tr key={idx}>
                                            <td>{work.work}</td>
                                            <td>{work.given_sum}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}
        </>
    );
};

export default ManagerPaymentCard;
