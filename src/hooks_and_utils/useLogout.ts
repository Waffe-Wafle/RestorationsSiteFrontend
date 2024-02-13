import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import useFetch from "../hooks_and_utils/useFetch.js";
import {ProfilesAPI} from "../api";
import {
    storeIsAuthenticated,
    storeSearchValue,
    storeIsStaff,
    storeBasket,
    storePayments,
    storeDraftId,
} from "../redux/dataSlice";


const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {data, loading, error, doFetch} = useFetch(
        `${ProfilesAPI}logout/`,
        {method: 'GET'},
        null // We should do log out even if the server is unavailable
    );

    const handleLogout = () => {
        doFetch();
        dispatch(storeIsAuthenticated(false));
        dispatch(storeIsStaff(false));
        dispatch(storePayments({}));
        dispatch(storeBasket({}));
        dispatch(storeDraftId(null));
        dispatch(storeSearchValue(''));

        if (['#/basket', '#/my_payments', '#/update_restore', '#/manage'].includes(window.location.hash))
            navigate('/');
        localStorage.clear();
    };

    return handleLogout;

};


export default useLogout;