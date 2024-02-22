import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    useIsAuthenticated,
    useSearchValue,
    storeSearchValue, useIsStaff,
} from '../../redux/dataSlice';
import useLogout from "../../hooks_and_utils/useLogout";


interface HeaderProps {
    doSearch?: Function;
    authView?: boolean;
}


const Header: FC<HeaderProps> = ({doSearch, authView = false}) => {
    const isAuthenticated = useIsAuthenticated();
    const isStaff = useIsStaff();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = useLogout();

    const search = useSearchValue();

    const searchValueChanged = e =>
        dispatch(storeSearchValue(e.target.value));

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-light navbar-sm justify-content-center justify-content-sm-start main-color">
            <div className="navbar-brand d-flex flex-wrap flex-sm-nowrap text-center align-items-center">
                <img className="logo" src={process.env.PUBLIC_URL + "/src/site_logo.png"} alt="Site Logo"/>
                <span className="site-title">Donations for Restorations</span>
            </div>

            {/* Поиск */}
            <div className="form-inline flex-nowrap">
                <input className="form-control search" value={search} placeholder="Search..."
                       onChange={searchValueChanged}/>
                <button className="btn btn-outline-light search-button ml-2 mr-2"
                        onClick={() => doSearch ? doSearch() : ''}>Search
                </button>
            </div>

            {/* Hamburger Menu */}
            <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    className="navbar-toggler ml-auto btn-light">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navbarSupportedContent" className="navbar-collapse text-right collapse">
                <div className="btn-group ml-auto hamburger-hidden">
                    <a className="btn btn-outline-light"
                       href="#/info">Главная</a>
                    <a className={"btn btn-outline-light"}
                       href="#/catalog">Каталог</a>
                    {authView ? '' :
                        <div className="btn-group">
                            <button type="button" data-toggle="dropdown"
                                    className="btn btn-light dropdown-toggle">Профиль
                            </button>
                            <div className="dropdown-menu dropdown-menu-right dropdown-menu-end">
                                {isAuthenticated && (
                                    isStaff ? <>
                                        <button onClick={() => navigate('/manage')}
                                                className="dropdown-item">Заявки
                                        </button>
                                        <button onClick={() => navigate('/new_restoration')}
                                                className="dropdown-item">Новая реставрация
                                        </button>
                                    </> : <>
                                        <button onClick={() => navigate('/basket')}
                                                className="dropdown-item">Корзина
                                        </button>
                                        <button onClick={() => navigate('/my_payments')}
                                                className="dropdown-item">Заказы
                                        </button>
                                    </>
                                )}
                                <button onClick={() => isAuthenticated ? handleLogout() : navigate('/login')}
                                        className="dropdown-item">
                                    {isAuthenticated ? 'Выход' : 'Вход'}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </nav>
    );
};


export default Header;
