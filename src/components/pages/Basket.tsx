import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import Header from "../parts_share/Header";
import CurrentPath from "../parts/CurrentPath";
import BasketDonationCard from "../parts/BasketDonationCard";
import Button from "react-bootstrap/Button";
import useFetch from "../../hooks_and_utils/useFetch";
import { RestoreAPI } from "../../api.js";
import {
    useBasket,
    storeBasket,
    useDraftId,
    storeDraftId,
    addPayment,
} from "../../redux/dataSlice";
import LoadingPopUp from "../popups/LoadingPopUp";
import ConfirmationPopUp from "../popups/ConfirmationPopUp";
import InputValuePopUp from "../popups/InputValuePopUp";
import MessagePopup from "../popups/MessagePopUp";
import {DonationType, PaymentType, RegroupedDonation} from "../../interfaces";
import summarizeDonations from "../../hooks_and_utils/groupWorksByRestoreInPayment";

const Basket: FC<{fetchBrake: boolean}> = ({fetchBrake = false}) => {
    const draftId: number = useDraftId();
    const storedBasket: PaymentType = useBasket();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [donationProcessed, setDonationProcessed] = useState<DonationType>({} as DonationType);
    // For data query or draft applying:
    const [isAppyRequest, setIsApplyRequest] = useState<boolean>(false);
    // For managing draft - delete or set donation:
    const [isAdddRequest, setIsAdddRequest] = useState<boolean>(true);
    // For switching in logic which way from upper wariants request goes:
    const [isManagingRequest, setIsmanagingRequest] = useState<boolean>(false);

    const [confirmationShown, setConfirmationShown] = useState<boolean>(false);
    const [inputValueShown, setInputValueShown] = useState<boolean>(false);
    const [wrongValueMessageShown, setWrongValueMessageShown] = useState<boolean>(false);
    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    // Regrouping donations structure logic:
    const [regroupedDonations, setRegroupedDonations] = useState<RegroupedDonation[]>(
        summarizeDonations(storedBasket.donations as DonationType[]));

    useEffect(() => {
        const donations = storedBasket.donations as DonationType[];
        const regroupedDonations = summarizeDonations(donations);
        setRegroupedDonations(regroupedDonations);
    }, [storedBasket]);



    // Fetch for get or apply draft logic:
    const loadDraftCallback = data => {
        if (isAppyRequest) {
            dispatch(addPayment(data));
            dispatch(storeDraftId(null));
            dispatch(storeBasket({}))
            navigate("/my_payments/");
        }
        dispatch(storeBasket(isAppyRequest ? {} : data));
        setIsApplyRequest(false); // If there won't be unmounting later
        setLoadingShown(false);
    };

    const {
        data: draftData,
        loading: draftLoading,
        error: draftError,
        doFetch: draftDoFetch,
    } = useFetch(
        RestoreAPI + (isAppyRequest ? "manage_payment_status/" : "payments/" + draftId + "/"),
        { method: isAppyRequest ?  "PUT" : "GET" }, loadDraftCallback
    );

    useEffect(() => {
        if (draftId && !fetchBrake) draftDoFetch();
    }, [draftId, fetchBrake]);

    // Fetch (for draft managing) logic:
    const manageDraftCallback = data => {
        dispatch(storeBasket(data));
        setLoadingShown(false);
    };

    const {
        data: manageDraftData,
        loading: manageDraftLoading,
        error: manageDraftError,
        doFetch: manageDraftDoFetch,
    } = useFetch(
        RestoreAPI + "manage_payment_donation/",
        {
            method: isAdddRequest ? "PUT" : "DELETE",
            data: {
                work_id: donationProcessed.work_id,
                ...(isAdddRequest ? { sum: donationProcessed.given_sum } : {})
            }
        }, manageDraftCallback
    );

    // Apply confiramation logic:
    const handleApply = () => {
        setIsmanagingRequest(false);
        setConfirmationShown(true);
    };

    const handleApplyConfirmation = (confirm: boolean) => {
        if (confirm) {
            setIsApplyRequest(true);
            draftDoFetch();
        }
        setConfirmationShown(false);
    };

    // Manage draft confirmation logic:
    // Deletes donation if confirmed:
    const handleManageDeleteConfirmation = (confirm: boolean) => {
        if (confirm) {
            setIsAdddRequest(false);
            manageDraftDoFetch();
        }
        setConfirmationShown(false);
    };

    // Changes sum if applied:
    const handleManageSumGot = (sum: string) => {
        const intSum = parseInt(sum);
        if (isNaN(intSum)) setWrongValueMessageShown(true);
        else {
            setDonationProcessed(donation => ({...donation, given_sum: intSum}))
            manageDraftDoFetch();
            setInputValueShown(false);
        }
    };

    // Chooses which one from upper windows to show:
    const handleManage = (donation, isAddRequest) => {
        setIsmanagingRequest(true);
        if (isAddRequest) setInputValueShown(true);
        else setConfirmationShown(true);

        setIsApplyRequest(isAddRequest);
        setDonationProcessed(donation);
    };

    // Popups logic:
    const loadingHandleClose = () => {
        if (!(draftLoading || manageDraftLoading)) setLoadingShown(false);
    };

    useEffect(() => {
        if (draftLoading || manageDraftLoading || draftError || manageDraftError)
            setLoadingShown(true);
    }, [draftLoading, manageDraftLoading, draftError, manageDraftError]);

    return (
        <div className="wrapper clear">
            {inputValueShown && <InputValuePopUp show={true} title="Изменение суммы пожертвования"
                             setResult={handleManageSumGot}
                             onClose={() => setInputValueShown(false)}/>
            }
            <MessagePopup title="Недопустимый ввод"
                          message="Не удалось преобразовать введенное значение в число..."
                          show={wrongValueMessageShown} onClose={() => setWrongValueMessageShown(false)}/>
            <ConfirmationPopUp
                show={confirmationShown}
                title="Подтвердить?"
                message={{
                    question: isManagingRequest ?
                        "Это пожертвование будет исключено" : "Заявка будет сформирована как оплаченная" ,
                    confirm: "Да",
                    reject: "Нет",
                }}
                result={isManagingRequest ? handleManageDeleteConfirmation : handleApplyConfirmation}
            />
            <LoadingPopUp
                show={loadingShown}
                error={manageDraftError ? manageDraftError : draftError}
                onClose={loadingHandleClose}
                message={"Пожалуйста, подождите..."}
            />
            <Header />
            <CurrentPath links={[["Главная", "/info"], ["Каталог", "/catalog"], ["Заявка", ""]]}/>
            <div className="content pt-md-4 pl-md-5 pr-md-5 table-responsive">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        {!regroupedDonations.length ?
                            <h5 className="m-20 text-center">Заявка пуста... </h5> :
                            <div className="d-inline-block">
                                <div>Код оплаты: {storedBasket.code}</div>
                                <div>Сумма заказа: {storedBasket.given_sum} ₽</div>
                            </div>
                        }
                        <div className="mb-3 d-flex">
                            <Link className="btn btn-success" to="/my_payments">В историю</Link>
                            <Link className="btn btn-primary ml-2" to="/catalog">В каталог</Link>
                        </div>
                    </div>
                {regroupedDonations.length > 0 &&
                    <div className="ml-40 mb-10">
                        {regroupedDonations.map(
                            donation => (
                                <BasketDonationCard key={donation.restore_id} donation={donation}
                                                    manageBasket={handleManage} />
                            )
                        )}
                        <div className="mt-35 d-flex justify-content-center ">
                            <Button className="col-sm-4 btn-success" onClick={handleApply}>
                                Заказать
                            </Button>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};


export default Basket;


// {/*    <div className="content pt-md-4 pl-md-5 pr-md-5 table-responsive">*/}
// {/*        {storedBasket.donations.length > 0 ? (*/}
// {/*            <h5 className="text-center m-20">Заявка пуста...</h5>*/}
// {/*        ) : (<>*/}
// {/*            <div>Код оплаты: {storedBasket.code}</div>*/}
// {/*            <div>Сумма заказа: {storedBasket.given_sum} ₽</div>*/}
// {/*            <table className="table text-center table-bordered">*/}
// {/*                <thead>*/}
// {/*                <tr>*/}
// {/*                    <th>Код</th>*/}
// {/*                    <th>Пожертвование, ₽</th>*/}
// {/*                    <th>Дата</th>*/}
// {/*                    <th>Статус</th>*/}
// {/*                    <th>Работы</th>*/}
// {/*                    <th>Действия</th>*/}
// {/*                </tr>*/}
// {/*                </thead>*/}
// {/*                <tbody>*/}
// {/*                {storedBasket.donations.map(*/}
// {/*                    donation => (*/}
// {/*                        <BasketDonationCard key={donation.id} donation={donation} manageBasket={handleManage}/>*/}
// {/*                    )*/}
// {/*                )}*/}
// {/*                </tbody>*/}
// {/*            </table>*/}
// {/*        </>)}*/}
// {/*    </div>*/}
// {/*</div>*/}
