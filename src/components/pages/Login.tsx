import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useFetch from '../../hooks_and_utils/useFetch.js';
import {ProfilesAPI} from '../../api';
import {storeIsAuthenticated, storeIsStaff, storeRefreshView} from '../../redux/dataSlice';
import LoadingPopUp from '../popups/LoadingPopUp';
import MessagePopUp from '../popups/MessagePopUp';
import Header from '../parts_share/Header';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [popupError, setPopupError] = useState<string | null>(null); // Costil (other way error on the previous PopUp can be seen)
    const [messageShown, setMessageShown] = useState<boolean>(false);
    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Fetch logic:
    const handleLogged = data => {
        navigate('/catalog');
        dispatch(storeIsAuthenticated(true));
        dispatch(storeIsStaff(data.is_staff));
        dispatch(storeRefreshView(true));
        console.log(`user logged in, is staff:`, data.is_staff);
    };

    const {data, loading, error, doFetch} = useFetch(
        ProfilesAPI + 'login/',
        //@ts-ignore
        {data: {username, password}},
        handleLogged
    );

    // Popups logic:
    const handleClose = () => {
        if (!loading) {
            setLoadingShown(false);
            setMessageShown(false);
        }
    };

    useEffect(() => {
        let wrongCred = error && error.response.data.detail === 'authentication failed';
        if (wrongCred) {
            setLoadingShown(false);
            setMessageShown(true);
        } else if (error || loading) {
            setLoadingShown(true);
            setMessageShown(false);
            setPopupError(error); // Other way the error on the previous screen can be seen (
        } // data is there because of already having an error code can theoretically contain other detail message:
    }, [error, loading]);

    return (
        <div className="wrapper">
            <MessagePopUp
                show={messageShown}
                title={'Faild'}
                onClose={handleClose}
                message={'Неправильные учетные данные ('}
            />
            <LoadingPopUp
                show={loadingShown}
                error={popupError}
                onClose={handleClose}
                message={'Идет авторизация...'}
            />

            <Header authView={true}/>
            <div className="d-flex justify-content-center">
                <div className="content  m-3 col-10 col-sm-9 col-md-8 col-lg-7 col-xl-5 ">
                    <h1 className="text-center mb-4">Вход</h1>
                    <form>
                        <div className="form-group">
                            <label className="form-label">Никнейм:</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="enter username"
                                name="username"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Пароль:</label>
                            <input
                                className="form-control"
                                type="password"
                                placeholder="enter password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <div className="text-center text-sm-left"> {/* Центрируем кнопку на маленьких экранах */}
                            <Button className="btn btn-primary mt-3" onClick={doFetch}>
                                Войти
                            </Button>
                        </div>
                    </form>
                    <p className="mt-3 text-center">
                        Если у вас нет аккаунта, <Link to="/register">зарегистрируйтесь</Link>
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Login;
