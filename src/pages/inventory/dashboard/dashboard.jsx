import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js'
function Dashboard() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    const decoded = jwt_decode(user.token);
    const expirationTime = (decoded.exp * 1000) - 60000


    const goToUserList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 2) ? true : false
        if (auth) {
            navigate('/userTable')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToUserListOwner = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/userTableOwner')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToUnits = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/units')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToProductList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/dashboardOwner')
        } else {
            navigate('/productTable')
        }
    }
    const goToFactory = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 6) ? true : false
        if (auth) {
            navigate('/dashboardFactory')
        } else {
            navigate('/factory/productTable')
        }
    }
    return (
        <div className='mainBody'>
            <div className="cardWrp">
                <div className="grid lg:grid-cols-3 mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8' gap-6">
                    <ConsoleCard goToAddUSer={goToProductList} name={"Inventory"} imgName={'img11'} />
                    <ConsoleCard goToAddUSer={goToFactory} name={"Factory"} imgName={'factory'} />
                    {role == 2 && <ConsoleCard goToAddUSer={goToUserList} name={"User List"} imgName={'userList'} />}
                    {role == 1 && < ConsoleCard goToAddUSer={goToUserListOwner} name={"User List"} imgName={'userList'} />}
                    {role == 1 && < ConsoleCard goToAddUSer={goToUnits} name={"Unit List"} imgName={'units'} />}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;