import {createSlice} from "@reduxjs/toolkit"
import {useSelector} from "react-redux";
import {RootState} from "./store"; // Wow, there is no recursion :)
import {RestorationType, PaymentType, DonationType, StoredRestorationType} from "../interfaces";
import {paymentStatusMap} from "../hooks_and_utils/statuses";


const dataSlice = createSlice({
    name: "data",
    initialState: {
        // User props:
        isAuthenticated: false,
        isStaff: false,

        // Organised like that to allow to append by one new:
        restorations: {} as {[id: number]: RestorationType},
        // To connect Restoration and Works api and elso during redirect from restoration to constructor:
        currentRestoration: {} as StoredRestorationType | RestorationType,
        lastRestorationId: null,                              // Used to redirect back if there was restoration reduction before
        basket: {}       as PaymentType,                      // Here stored draft object
        payments: {}     as {[id: number]: PaymentType},      // There are stored payments objects which contain

        searchValue: '',         // To save text in header
        draftId: null,           // Used to get draft
        refreshView: false,
    },
    reducers: {
        storeIsAuthenticated(state, {payload}){
            state.isAuthenticated = payload;
        },
        storeIsStaff(state, {payload}){
            state.isStaff = payload;
        },


        storeRestorations(state, {payload}) {
            state.restorations = {...state.restorations}
            if (payload.length > 0) {
                payload.forEach(restore => {
                    state.restorations[restore.id] = restore;
                })
            }
        },
        addRestoration(state, {payload}) {
            state.restorations = {...state.restorations, [payload.id]: payload};
        },
        deleteRestorationById(state, {payload}) {
            const {[payload]: value, ...newRestorations} = state.restorations;
            state.restorations = newRestorations;
        }, // Not really used because of filtering


        storeBasket(state, {payload}) {
            state.basket = payload;
        },


        storePayments(state, {payload}) {
            state.payments = {}; // To use it for clearing
            if (Object.keys(payload).length > 0) {
                payload.forEach(payment => {
                    state.payments[payment.id] = payment;
                })
            }
        },
        addPayment(state, {payload}) {
            state.payments = {...state.payments, [payload.id]: payload,};
        },
        deletePaymentByID(state, {payload}) {
            const {[payload]: value, ...newPayments} = state.payments;
            state.payments = newPayments;
        },


       storeSearchValue(state, {payload}) {
            state.searchValue = payload;
       },


        storeDraftId(state, {payload}) {
            state.draftId = payload;
        },


        storeRefreshView(state, {payload}) {
            state.refreshView = payload;
        },

        storeCurrentRestoration(state, {payload}) {
            state.currentRestoration = payload;
        },

        storeLastRestorationId(state, {payload}) {
            state.lastRestorationId = payload
        },

    }
})


export const useIsAuthenticated = () =>
    useSelector((state: RootState) => state.data.isAuthenticated)

export const useIsStaff = () =>
    useSelector((state: RootState) => state.data.isStaff)

export const useRestorations = () =>
    useSelector((state: RootState) => state.data.restorations);

export const useBasket = () =>
    useSelector((state: RootState) => state.data.basket);

export const usePayments = () =>
    useSelector((state: RootState) => state.data.payments);

export const useIsWorkDonationInBasketByWorkID = id => {
    const basket = useSelector((state: RootState) => state.data.basket) as PaymentType
    return basket.donations ? basket.donations.some(donation => donation.work_id === id) : false
}

export const useIsWorkDonationInPaymentsByWorkID = id =>
    Object.values(useSelector((state: RootState) => state.data.payments)).some(
        payment =>
            payment.donations && payment.status !== 'Rejected' &&
            payment.donations.includes(id)
    );

export const useIsWorkDonationSuccesedByWorkID = id =>
    Object.values(useSelector((state: RootState) => state.data.payments))
        .some(
            payment => payment.donations && payment.donations.includes(id) &&
                payment.status === 'Сompleted'
        );

export const useSearchValue = () =>
    useSelector((state: RootState) => state.data.searchValue)


export const useDraftId = () =>
    useSelector((state: RootState) => state.data.draftId);

export const useRefreshView= () =>
    useSelector((state: RootState) => state.data.refreshView);

export const useCurrentRestoration= () =>
    useSelector((state: RootState) => state.data.currentRestoration);

export const useLastRestorationId = () =>
    useSelector((state: RootState) => state.data.lastRestorationId);


export const {
    storeIsAuthenticated,
    storeIsStaff,

    storeRestorations,
    addRestoration,
    deleteRestorationById,

    storeBasket,

    storePayments,
    addPayment,
    deletePaymentByID,

    storeSearchValue,

    storeDraftId,

    storeRefreshView,

    storeCurrentRestoration,
    storeLastRestorationId

} = dataSlice.actions


export default dataSlice.reducer
