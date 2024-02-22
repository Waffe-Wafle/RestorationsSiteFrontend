import React, { useEffect, useState, MouseEvent } from "react";
import { Col, Row, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    usePayments,
    storePayments,
    addPayment,
} from "../../redux/dataSlice";
import useFetch from "../../hooks_and_utils/useFetch";
import { RestoreAPI } from "../../api";
import CurrentPath from "../parts/CurrentPath";
import Header from "../parts_share/Header";
import LoadingPopUp from "../popups/LoadingPopUp";
import ManagerPaymentCard from "../parts/ManagerPaymentCard";

interface RequestsManagingProps {}

const RequestsManaging: React.FC<RequestsManagingProps> = () => {
    const storedPayments = Object.values(usePayments());
    const dispatch = useDispatch();

    const [loadingShown, setLoadingShown] = useState(false);

    // For fetching:
    const [specificDateFilter, setSpecificDateFilter] = useState("");
    const [dateStartFilter, setDateStartFilter] = useState("");
    const [dateEndFilter, setDateEndFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState(["", ""]); // Title of status and status itself

    const [countFilter, setCountFilter] = useState(false);
    const [sumFilter, setSumFilter] = useState(false);

    const [isLoadingFetch, setIsLoadingFetch] = useState(true);
    const [paymentProcessInfo, setPaymentProcessInfo] = useState<{
        status: string;
        id: string;
    }>({ status: "", id: "" });

    const link = (polling=false): string =>
        RestoreAPI +
        ((isLoadingFetch || polling) ?
            "payments/" +`?status=${statusFilter[1]}&specific_date=${specificDateFilter}
            &start_date=${dateStartFilter}&end_date=${dateEndFilter}&count=${countFilter}&sum=${sumFilter}`
            : `manage_payment_status_admin/${paymentProcessInfo.id}/`);

    const callback = (data: any): void => {
        if (isLoadingFetch) dispatch(storePayments(data));
        else dispatch(addPayment(data));
        setLoadingShown(false);
    };

    // Fetch logic:
    const { data, loading, error, doFetch } = useFetch(
        link(false),
        {
            method: isLoadingFetch ? "GET" : "PUT",
            data: isLoadingFetch ? "" : { status: paymentProcessInfo.status },
        },
        callback
    );

    const {data: pollingData, loading: pollingLoading, error: pollingError, doFetch: pollingDoFetc} = useFetch(
        link(true),
        {method: 'GET'},
        data => dispatch(storePayments(data))
    );

    // Internal
    useEffect(() => {
        if (storedPayments.length) doFetch();
    }, []);

    // Short polling:
    useEffect(() => {
        const intervalId = setInterval(() => {
            pollingDoFetc();
        }, 200); // Poll every 1 second

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [doFetch]);


    // Actions:
    // const handleSearch = (): void => {
    //     setIsLoadingFetch(true);
    //     doFetch();
    // };

    const handleSetStatus = (status: string, id: string): void => {
        setIsLoadingFetch(false);
        setPaymentProcessInfo({ status, id });
        doFetch();
    };

    // Popup logic:
    const handleClose = (): void =>
    loading ? undefined : setLoadingShown(false);

    useEffect(() => (loading || error) ? setLoadingShown(true) : undefined, [
        loading,
        error,
    ]);

    // @ts-ignore
    return (
        <div className="wrapper clear">
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
                    ["Менеджмент заявок", "/manage"],
                ]}
            />
            <div className=" ml-5 mr-5 mt-4 d-flex justify-content-between items-align-center">
                <div className="flex-column">
                    <NavDropdown
                        title={statusFilter[0] ? statusFilter[0] : "Сортировать по статусу"}
                        className="d-flex justify-content-between items-align-center "
                    >
                        <NavDropdown.Item onClick={() => setStatusFilter(["", ""])}>
                            все
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => setStatusFilter(["Оплаченные", "Paid"])}
                        >
                            оплаченные
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => setStatusFilter(["Принятые", "Completed"])}
                        >
                            принятые
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => setStatusFilter(["Отклоненные", "Rejected"])}
                        >
                            отклоненные
                        </NavDropdown.Item>
                    </NavDropdown>

                    <div className="mt-2">Фильтр даты:</div>
                    <input
                        className="mt-1"
                        type="date"
                        onChange={(e) => setDateStartFilter(e.target.value)}
                    />
                    <input
                        className="ml-1"
                        type="date"
                        onChange={(e) => setDateEndFilter(e.target.value)}
                    />
                    {/*<Button className="mr-15" onClick={handleSearch}>*/}
                    {/*    Show*/}
                    {/*</Button>*/}
                </div>
            </div>
            <div className="content ml-5 mr-5 mt-4">
                <div className="text-center">
                    {!storedPayments.length ? (
                        <h5>Заявки отсутствуют...</h5>
                    ) : (
                        <table className="table text-center table-bordered">
                            <thead>
                            <tr>
                                <th style={{ width: '10%' }}>Дата открытия</th>
                                <th style={{ width: '10%' }}>Код оплаты</th>
                                <th style={{ width: '10%' }}>Сумма ₽</th>
                                <th style={{ width: '10%' }}>Статус</th>
                                <th style={{ width: '15%' }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {storedPayments.map((payment: any, index) => (
                                <ManagerPaymentCard
                                    key={index}
                                    payment={payment}
                                    setStatus={handleSetStatus}
                                />
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>

    );
};

export default RequestsManaging;
