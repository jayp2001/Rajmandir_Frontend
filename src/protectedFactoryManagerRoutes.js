import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom"; 
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js'

const ProtectedFactoryManagerRoutes = () => {

    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return(data);
      };

    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if(!user){
        return(<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights):'';
    console.log("ROLE",role)
    try{
        const decoded = jwt_decode(user.token);
        const expirationTime = (decoded.exp * 1000) - 60000
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 6 ||role == 7)? true : false
        console.log('auth>>LL',auth,decoded)
        // console.log('<<>>',new Date(expirationTime),decoded,new Date(expirationTime) > new Date() ? true : false)
        return(
            auth?
            <Outlet />:
            <Navigate to="/login" state={{ from: location }} replace />
        )
    } 
    catch(error){
        console.log('auth>> error')
        return(
            <Navigate to="/login" state={{ from: location }} replace />
        )
    }
};

export default ProtectedFactoryManagerRoutes;