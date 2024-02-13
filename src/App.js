import {HashRouter, Route, Routes, Navigate} from "react-router-dom";
import useSetCSRFCookie from "./hooks_and_utils/useSetCSRFCookie";
import Catalog from "./components/pages/Catalog";
import Restoration from "./components/pages/Restoration";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Basket from "./components/pages/Basket";
import Payments from "./components/pages/Payments";
import Info from "./components/pages/Info";



const App = () => {
    useSetCSRFCookie();
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route exact path='/'                element={<Navigate to="/catalog" />}/>
                    <Route exact path="/catalog"         element={<Catalog/>}/>
                    <Route exact path="/restoration/:restore_id"  element={<Restoration/>}/>

                    <Route exact path="/register"       element={<Register/>}/>
                    <Route exact path='/login'          element={<Login/>}/>

                    <Route exact path="/basket"         element={<Basket/>}/>
                    <Route exact path='/my_payments'    element={<Payments/>}/>

                    <Route exact path="/info"           element={<Info/>}/>
                </Routes>
            </HashRouter>
        </div>
    );
}


export default App;