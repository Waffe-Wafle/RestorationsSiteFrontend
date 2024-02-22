import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "../parts_share/Header";
import CurrentPath from "../parts/CurrentPath";
import { Col, Row, Button } from "react-bootstrap";
import PaymentCard from "../parts/PaymentCard";
import useFetch from "../../hooks_and_utils/useFetch.js";
import { RestoreAPI } from "../../api";
import {
    usePayments,
    storePayments,
    deletePaymentByID,
} from "../../redux/dataSlice";
import LoadingPopUp from "../popups/LoadingPopUp";
import ConfirmationPopUp from "../popups/ConfirmationPopUp";
import {PaymentType} from "../../interfaces";
import {Link} from "react-router-dom";


// @ts-ignore
const Payments: FC = ({fetchBrake = false, pollingBrake=false}) => {
    const storedPayments = Object.values(usePayments()) as PaymentType[];
    const dispatch = useDispatch();

    const [loadingShown, setLoadingShown] = useState<boolean>(false);
    const [confirmationShown, setConfirmationShown] = useState<boolean>(false);

    const [payId, setPayId] = useState<number | null>(null);

    // Fetch (for downloading payments) logic:
    const callback = data => {
        if (payId) {
            dispatch(deletePaymentByID(payId));
            setPayId(null);
        } else dispatch(storePayments(data));
        setLoadingShown(false);
    };

    const { data, loading, error, doFetch } = useFetch(
        RestoreAPI + "payments/" + (payId ? payId + "/" : ""),
        {method: payId ? "DELETE" : "GET"},
        callback
    );

    useEffect(() => {
        if (!storedPayments.length && !fetchBrake) doFetch();
    }, [fetchBrake]);

    // Short polling logic:
    const {data: pollingData, loading: pollingLoading, error: pollingError, doFetch: pollingDoFetch} = useFetch(
        RestoreAPI + "payments/",
        {method: 'GET'},
        data => dispatch(storePayments(data))
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            if(!fetchBrake && !pollingBrake) pollingDoFetch();
        }, 200); // Poll every 1 second

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [doFetch, fetchBrake, pollingBrake]);

    // Del logic:
    const handleDel = (id: number) => {
        setPayId(id);
        setConfirmationShown(true);
    };

    const handleConfirmation = (confirm: boolean) => {
        if (confirm) doFetch();
        setConfirmationShown(false);
    };

    // Popup logic:
    const handleClose = () =>
        loading ? undefined : setLoadingShown(false);

    useEffect(() => {
        if (loading || error) setLoadingShown(true);
        }, [loading, error]);

    return (
        <div className="wrapper clear">
            <ConfirmationPopUp
                show={confirmationShown}
                title="Подтвердить?"
                message={{
                    question: "Заявка будет удалена",
                    confirm: "Да",
                    reject: "Нет",
                }}
                result={handleConfirmation}
            />
            <LoadingPopUp
                show={loadingShown}
                error={error}
                onClose={handleClose}
                message={"Идет загрузка..."}
            />
            <Header />
            <CurrentPath
                links={[
                    ["Главная", "/info"],
                    ["Каталог", "/catalog"],
                    ["Мои заказы", "/my_payments"],
                ]}
            />
            <div className="content pt-md-4 pl-md-5 pr-md-5 table-responsive">
                <div className="mb-3 d-flex justify-content-end">
                    <Link className="btn btn-success" to="/basket">В заявку</Link>
                    <Link className="btn btn-primary ml-2" to="/catalog">В каталог</Link>
                </div>
                {!storedPayments.length ? (
                    <h5 className="text-center m-20">Заказы отсутствуют...</h5>
                ) : (
                    <table className="table text-center table-bordered">
                        <thead>
                        <tr>
                            <th>Код</th>
                            <th>Пожертвование, ₽</th>
                            <th>Дата</th>
                            <th>Статус</th>
                            <th>Работы</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {storedPayments.map((payment: any) => (
                            <PaymentCard key={payment.id} payment={payment} handleDel={handleDel} />
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};


export default Payments;
