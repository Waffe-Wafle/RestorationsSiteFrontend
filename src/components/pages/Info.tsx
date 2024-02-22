import React, { FC, useState } from "react";
import {useNavigate} from "react-router-dom";
import Header from "../parts_share/Header";
import CurrentPath from "../parts/CurrentPath";
import {useIsAuthenticated, useIsStaff} from "../../redux/dataSlice";
import useLogout from "../../hooks_and_utils/useLogout";



const Info: FC = () => {
    const isAuthenticated = useIsAuthenticated();
    const isStaff = useIsStaff();

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const handleAuth = () => {
        if (isAuthenticated) handleLogout();
        else navigate("/login")
    };

    return (
        <div className="wrapper clear">
            <Header />
            <CurrentPath links={[['Главная', '/info']]}/>
            <div className="container mt-4">
                <p className="lead text-center d-none d-md-block">
                    Сайт сбора средств на осуществление реставрационных
                    работ культурных объектов России
                </p>
                <p className="lead text-center">Проект Заграничного Якова Дмитриевича, РТ5-51Б</p>
                <hr className="my-4"/>
                <div className="row justify-content-center text-center">
                    <div className="col-6 col-md-4 col-lg-3">
                        <div className="m-10">
                            <div className="d-flex flex-column align-items-center">
                                <a className="btn btn-primary btn-block mb-3"
                                   href="#/catalog">Каталог</a>
                                <button className="btn btn-primary btn-block mb-3" onClick={handleAuth}>
                                    {isAuthenticated ? 'Выйти' : 'Авторизоваться'}
                                </button>
                                {isAuthenticated && (
                                    isStaff ? <>
                                        <button onClick={() => navigate('/manage')}
                                                className="btn btn-primary btn-block mb-3">Менеджмент заявок
                                        </button>
                                        <button onClick={() => navigate('/new_restoration')}
                                                className="btn btn-primary btn-block">Добавить реставарцию
                                        </button>
                                    </> : <>
                                        <button onClick={() => navigate('/basket')}
                                                className="btn btn-primary btn-block mb-3">Черновик заявки
                                        </button>
                                        <button onClick={() => navigate('/my_payments')}
                                                className="btn btn-primary btn-block">История заявок
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Info;
