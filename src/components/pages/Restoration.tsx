import React, {FC, useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import Header from "../parts_share/Header";
import RestorationWork from "../parts/RestorationWork";
import RestorationDonation from "../parts/RestorationDonation";
import CurrentPath from "../parts/CurrentPath";
import useFetch from "../../hooks_and_utils/useFetch";
import {RestoreAPI} from "../../api.js";
import {
    useIsAuthenticated,
    useIsStaff,
    useCurrentRestoration,
    storeBasket, storeCurrentRestoration,
} from "../../redux/dataSlice";
import imgPlaceholder from "../../hooks_and_utils/imgPlaceholder";
import percent from "../../hooks_and_utils/countPercent";
import displayInt from "../../hooks_and_utils/displayInt";
import LoadingPopUp from "../popups/LoadingPopUp";
import {RestorationType, DonationType, WorkType, RestorationDonationType, PaymentType} from "../../interfaces";
import InputValuePopUp from "../popups/InputValuePopUp";
import MessagePopup from "../popups/MessagePopUp";
import ConfirmationPopUp from "../popups/ConfirmationPopUp";


const Restoration: FC = () => {
    const {restore_id} = useParams();
    const restoreId = parseInt(restore_id, 10);

    const isAuthenticated = useIsAuthenticated();
    const isStaff = useIsStaff();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isAddDonationRequest, setIsAddDonationRequest] = useState<boolean>(false);
    const [donationProcessed, setDonationProcessed] = useState<DonationType>({} as DonationType);
    const [confirmMessageText, setConfirmMessageText] = useState<string>('');
    const restoration = useCurrentRestoration() as RestorationType;
    // const [restoration, setRestoration] = useState<RestorationType | any>({});

    const [inputValueShown, setInputValueShown] = useState<boolean>(false);
    const [messageInMessagePopUp, setMessageInMessagePopUp] = useState<string>(''); // Used in message popup which is
    const [errorMessageShown, setErrorMessageShown] = useState<boolean>(false); // Controlled by that
    const [confirmationMessageShown, setConfirmationMessageShown] = useState<boolean>(false);
    const [loadingShown, setLoadingShown] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    // Fetch logic (get restoration or put donation to basket):
    const callback = data => {
        setLoaded(true);
        if (isAddDonationRequest) dispatch(storeBasket(data));
        else dispatch(storeCurrentRestoration(data));
        setIsAddDonationRequest(false); // If there won't be unmounting later
        setLoadingShown(false);
    };

    const {data, loading, error, doFetch} = useFetch(
        RestoreAPI + (isAddDonationRequest ? "manage_payment_donation/": "restorations/" + restoreId),
        {method: isAddDonationRequest ? "PUT": "GET",
        data: isAddDonationRequest ? {
            work_id: donationProcessed.work_id,
            sum: donationProcessed.given_sum
        } : ''},
        callback
    );

    useEffect(() => {
        doFetch();
    }, []);

    // Loading popup logic:
    const handleClose = () => (loading ? undefined : setLoadingShown(false));

    useEffect(() => {
        if (loading || error) setLoadingShown(true);
    }, [loading, error]);

    // Adding to draft logic:
    // Chooses text and pushes confirmation if this work was requested before:
    const handleAddDonation = (work_id, inBasket, inPayments, isSuccesed) => {
        if (!isAuthenticated) {
            setMessageInMessagePopUp("Для оформления пожертвования надо авторизоваться");
            setErrorMessageShown(true);
            return
        }
        setDonationProcessed({work_id: work_id} as DonationType);
        if (inBasket) {
            setConfirmMessageText("Вы уже добавили пожертвование на эту работу ранее, изменить сумму?");
            setConfirmationMessageShown(true);
        } else if (isSuccesed) {
            setConfirmMessageText("Вы уже делали пожертваование на эту работу ранее, добавить еще одно?");
            setConfirmationMessageShown(true);
        } else if (inPayments) {
            setConfirmMessageText("Вы уже добавили пожертвование на эту работу " +
                "в одну из заявок ранее, добавить еще одно?");
            setConfirmationMessageShown(true);
        } else setInputValueShown(true);
    }

    // Opens sum window if user agree donate again:
    const handleRedonationConfirmed = is_confirmed => {
        if (is_confirmed) setInputValueShown(true);
        setConfirmationMessageShown(false);
    };

    // Handles got sum window result:
    const handleManageSumGot = (sum: string) => {
        const intSum = parseInt(sum);
        if (isNaN(intSum)) {
            setMessageInMessagePopUp("Не удалось преобразовать введенное значение в число...");
            setErrorMessageShown(true);
        }
        else {
            setDonationProcessed(donation => ({...donation, given_sum: intSum}))
            setIsAddDonationRequest(true);
            doFetch();
            setInputValueShown(false);
        }
    };
    return (
        <div className="wrapper clear">
            {inputValueShown && <InputValuePopUp show={true} title="Введите сумму пожертвования"
                             setResult={handleManageSumGot}
                             onClose={() => setInputValueShown(false)}/>
            }
            <MessagePopup title="Ошибка"
                          message={messageInMessagePopUp}
                          show={errorMessageShown} onClose={() => setErrorMessageShown(false)}/>
            <ConfirmationPopUp
                show={confirmationMessageShown}
                title="Подтвердить?"
                message={{
                    question: confirmMessageText,
                    confirm: "Да",
                    reject: "Нет",
                }}
                result={handleRedonationConfirmed}
            />
            <LoadingPopUp show={loadingShown} error={error} onClose={handleClose} message={'Идет загрузка...'}/>
            <Header/>
            <CurrentPath links={[['Главная', '/info'], ['Каталог', '/catalog'], [restoration.name, '']]}/>

            <div className="container mt-4">
                {loaded &&
                    <div className="row justify-content-center">
                    <div className="col-10 col-lg-9">
                        <div className="detail-description">
                            <h2>{restoration.name}</h2>
                            <img className="img-fluid mt-3 mb-3"
                                 src={restoration.image}
                                 onError={e => imgPlaceholder(e)}/>
                            <div className="description-text">
                                <h4 className="mt-3">Описание</h4>
                                <p>{restoration.description}</p>
                            </div>
                            <h4 className="d-flex justify-content-between mt-3">
                                Собрано: {percent(restoration.given_sum, restoration.total_sum)}%,
                                &nbsp;
                                {displayInt(restoration.given_sum)} / {displayInt(restoration.total_sum)} ₽
                                <div>
                                    {isStaff ?
                                        <Link className="btn btn-success"
                                              to={"/update_restoration/" + restoreId}>Редактировать</Link> :
                                        <>
                                        {isAuthenticated && <>
                                                <Link className="btn btn-success" to="/basket">В заявку</Link>
                                                <Link className="btn btn-success ml-2" to="/my_payments">В историю</Link>
                                            </>}
                                        </>
                                    }
                                    <Link className="btn btn-primary ml-2" to="/catalog">В каталог</Link>
                                </div>
                            </h4>

                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered">
                                <thead className="main-color text-white">
                                <tr>
                                    <th>Наименование работы</th>
                                    <th>Собрано, ₽</th>
                                    <th>Требуется, ₽</th>
                                    <th className="text-center">Доля, %</th>
                                    <th className="text-center">Статус</th>
                                    <th className="text-center">Пожертвовать</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {restoration.works && restoration.works.map(
                                        (work, index: number) => (
                                            <RestorationWork work={work} key={index}
                                                             handleAddDonation={handleAddDonation} />
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered">
                                <thead className="main-color text-white">
                                <tr>
                                    <th className="text-center">Имя</th>
                                    <th>Работа</th>
                                    <th>Донат, ₽</th>
                                    <th className="text-center">Доля, %</th>
                                    <th className="text-center">Всего доля, ₽</th>
                                    <th className="text-center">Всего, %</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {restoration.donaters && restoration.donaters.map(
                                        (donation: RestorationDonationType, index: number) => (
                                            <RestorationDonation donation={donation} index={index}/>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    );
};


export default Restoration;
