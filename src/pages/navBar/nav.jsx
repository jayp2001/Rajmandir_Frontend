import './nav.css'
// import bhagwatiHeaderLogo from '../../assets/bhagwatiHeaderLogo.png';
import LogoWithDate from '../../assets/branch/RAJMANDIR_withDate.png'
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import * as React from 'react';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { Navigate, Outlet } from "react-router-dom";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import jwt_decode from 'jwt-decode';
import SavingsIcon from '@mui/icons-material/Savings';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
function NavBar() {
    const location = useLocation();
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    const [state, setState] = React.useState({
        left: false,
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [dashboardCategory, setDashboardCategory] = React.useState();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo && userInfo.token ? userInfo.token : ''}`,
        },
    };
    const [banks, setBanks] = React.useState();
    const user = JSON.parse(localStorage.getItem('userInfo'))
    var greetMsg = 'Hello';
    var data = [
        [22, 'Working late'],
        [18, 'Good evening'],
        [12, 'Good afternoon'],
        [5, 'Good morning'],
        [0, 'Whoa, early bird']
    ],
        hr = new Date().getHours();
    for (var i = 0; i < data.length; i++) {
        if (hr >= data[i][0]) {
            greetMsg = data[i][1];
            break;
        }
    }
    // const getMainCategoies = async () => {
    //     await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryDashboard`, config)
    //         .then((res) => {
    //             setDashboardCategory(res.data);
    //         })
    //         .catch((error) => {
    //             setError(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    // const getBanks = async () => {
    //     await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankDashboardData`, config)
    //         .then((res) => {
    //             setBanks(res.data);
    //         })
    //         .catch((error) => {
    //             setError(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    useEffect(() => {
        // getMainCategoies();
        // getBanks();
    }, [])
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    console.log("location", location.pathname, location.pathname.split('/').length)
    const navigate = useNavigate();
    const logout = () => {
        if (window.confirm("Are you sure !,you want to logout")) {
            localStorage.removeItem('userInfo');
            navigate(`/login`)
        }
    }
    if (location.pathname.toLowerCase() === "/login") {
        return null;
    }
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    console.log('rights??', role)
    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }

    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "top-right",
                toastId: 'error',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false)
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
            toastId: 'error',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setError(false);
    }
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;{role == 5 ? 'Manager' : location.pathname.split('/')[1] == 'staff' ? 'Employes' : location.pathname.split('/')[1] == 'expense' ? 'Expense' : location.pathname.split('/')[1] == 'bank' ? 'Banks' : location.pathname.split('/')[1] == 'businessReport' ? 'Business' : 'Inventory'}</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>

                {role == 5 ?
                    <ListItem key={3}>
                        <ListItemButton to="/stockOut">
                            <ListItemIcon>
                                <CompareArrowsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Stock In/Out'} />
                        </ListItemButton>
                    </ListItem>
                    : role == 4 ? <>
                        <ListItem key={'inout9'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout3'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                    </> : role == 3 ? <>
                        <ListItem key={'inout91'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout31'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout32'}>
                            <ListItemButton to="/InOutNpayment/supplierTable">
                                <ListItemIcon>
                                    <DomainAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Suppliers'} />
                            </ListItemButton>
                        </ListItem>
                    </> :
                        location.pathname.split('/')[1] == 'dashboardOwner' || location.pathname.split('/')[1] == 'userTableOwner' || location.pathname.split('/')[1] == 'units' || location.pathname.split('/')[1] == 'supplierDetailsOwner' || (location.pathname.split('/')[1] == 'addSupplier' && role == 1) ? <>
                            <ListItem key={'branchDashboard1'}>
                                <ListItemButton to="/dashboard">
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>
                            </ListItem>
                            {(location.pathname.split('/')[1] == 'supplierDetailsOwner' || location.pathname.split('/')[1] == 'addSupplier') &&
                                <ListItem key={'ownerDashboard'}>
                                    <ListItemButton to="/dashboardOwner">
                                        <ListItemIcon>
                                            <WorkspacesIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={'Branches'} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </> :
                            location.pathname.split('/')[1] == 'staff' ?
                                <>
                                    <ListItem key={'staff1'}>
                                        <ListItemButton to="/dashboard">
                                            <ListItemIcon>
                                                <DashboardIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Dashboard'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff2'}>
                                        <ListItemButton to="/staff/staffList">
                                            <ListItemIcon>
                                                <StyleOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff List'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff5'}>
                                        <ListItemButton to="/staff/addStaff">
                                            <ListItemIcon>
                                                <GroupAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Add Staff'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/allPayments">
                                            <ListItemIcon>
                                                <AccountBalanceWalletIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'All Payments'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/leaves">
                                            <ListItemIcon>
                                                <EventBusyIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Leaves'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff3'}>
                                        <ListItemButton to="/staff/staffCategory">
                                            <ListItemIcon>
                                                <ListAltOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff Categorires Table'} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                                :
                                location.pathname.split('/')[1] == 'expense' && location.pathname.split('/')[2] == 'dashboard' ?
                                    <>
                                        <ListItem key={'staff1'}>
                                            <ListItemButton to="/dashboard">
                                                <ListItemIcon>
                                                    <DashboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Dashboard'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff2'}>
                                            <ListItemButton to="/bank/dashboard">
                                                <ListItemIcon>
                                                    <AccountBalanceIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Banks'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff5'}>
                                            <ListItemButton to="/businessReport">
                                                <ListItemIcon>
                                                    <AssessmentIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Business Report'} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                    :
                                    location.pathname.split('/')[1] == 'bank' && location.pathname.split('/')[2] == 'dashboard' ?
                                        <>
                                            <ListItem key={'staff1'}>
                                                <ListItemButton to="/dashboard">
                                                    <ListItemIcon>
                                                        <DashboardIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Dashboard'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem>
                                        </>
                                        :
                                        location.pathname.split('/')[1] == 'businessReport' ?
                                            <>
                                                <ListItem key={'staff1'}>
                                                    <ListItemButton to="/dashboard">
                                                        <ListItemIcon>
                                                            <DashboardIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Dashboard'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff2'}>
                                                    <ListItemButton to="/expense/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceWalletIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Expense'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff3'}>
                                                    <ListItemButton to="/bank/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Banks'} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                            :
                                            location.pathname.split('/')[1] == 'expense' || location.pathname.split('/')[1] == 'bank' || location.pathname.split('/')[1] == 'businessReport' ? <>
                                                <>
                                                    <ListItem key={'staff1'}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    {/* <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/bank/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Banks'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem> */}
                                                </>
                                                {location.pathname.split('/')[1] == 'expense' ?
                                                    <><ListItem key={'staff2'}>
                                                        <ListItemButton to="/expense/dashboard">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Expense'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                        {location.pathname.split('/').length == 8 ?
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[6]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem> :
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[4]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        }
                                                        {dashboardCategory?.map((data, index) => (
                                                            <ListItem key={data.categoryId}>
                                                                <ListItemButton to={`/expense/mainCategory/${data.categoryName}/${data.categoryId}`}>
                                                                    <ListItemIcon>
                                                                        <MoneyOffIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={data.categoryName} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))}
                                                    </>
                                                    : location.pathname.split('/')[1] == 'bank' ?
                                                        <>
                                                            <ListItem key={'staff3'}>
                                                                <ListItemButton to="/bank/dashboard">
                                                                    <ListItemIcon>
                                                                        <AccountBalanceIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={'Banks'} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            {banks?.map((data, index) => (
                                                                <ListItem key={data.bankId}>
                                                                    <ListItemButton to={`/bank/detail/${data.bankId}`}>
                                                                        <ListItemIcon>
                                                                            <SavingsIcon />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={data.bankDisplayName} />
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            ))}
                                                        </> :
                                                        <></>}
                                            </>
                                                :
                                                <>
                                                    <ListItem key={1}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    {
                                                        role == 1 && <ListItem key={'ownerDashboard'}>
                                                            <ListItemButton to="/dashboardOwner">
                                                                <ListItemIcon>
                                                                    <WorkspacesIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary={'Branches'} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    }
                                                    {/* <ListItem key={2}>
                                                    <ListItemButton to="/productList">
                                                        <ListItemIcon>
                                                            <StyleOutlinedIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Products'} />
                                                    </ListItemButton>
                                                </ListItem> */}
                                                    <ListItem key={9}>
                                                        <ListItemButton to="/productTable">
                                                            <ListItemIcon>
                                                                <ListAltOutlinedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Product Table'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={3}>
                                                        <ListItemButton to="/stockInOut">
                                                            <ListItemIcon>
                                                                <CompareArrowsIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Stock In/Out'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={4}>
                                                        <ListItemButton to="/supplierTable">
                                                            <ListItemIcon>
                                                                <DomainAddIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Suppliers'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={5}>
                                                        <ListItemButton to="/categories">
                                                            <ListItemIcon>
                                                                <CategoryIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Categories'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={6}>
                                                        <ListItemButton to="/transactionTable">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Transaction History'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </>
                }
            </List>
        </Box>
    );
    const factoryList = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Factory</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>

                {role == 5 ?
                    <ListItem key={3}>
                        <ListItemButton to="/stockOut">
                            <ListItemIcon>
                                <CompareArrowsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Stock In/Out'} />
                        </ListItemButton>
                    </ListItem>
                    : role == 4 ? <>
                        <ListItem key={'inout9'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout3'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                    </> : role == 3 ? <>
                        <ListItem key={'inout91'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout31'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout32'}>
                            <ListItemButton to="/InOutNpayment/supplierTable">
                                <ListItemIcon>
                                    <DomainAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Suppliers'} />
                            </ListItemButton>
                        </ListItem>
                    </> :
                        location.pathname.split('/')[1] == 'dashboardFactory' || location.pathname.split('/')[1] == 'dashboardOwner' || location.pathname.split('/')[1] == 'userTableOwner' || location.pathname.split('/')[1] == 'supplierDetailsOwner' || (location.pathname.split('/')[1] == 'addSupplier' && role == 1) ? <>
                            <ListItem key={'branchDashboard1'}>
                                <ListItemButton to="/dashboard">
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>
                            </ListItem>
                            {(location.pathname.split('/')[1] == 'supplierDetailsOwner' || location.pathname.split('/')[1] == 'addSupplier') &&
                                <ListItem key={'ownerDashboard'}>
                                    <ListItemButton to="/dashboardOwner">
                                        <ListItemIcon>
                                            <WorkspacesIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={'Branches'} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </> :
                            location.pathname.split('/')[1] == 'staff' ?
                                <>
                                    <ListItem key={'staff1'}>
                                        <ListItemButton to="/dashboard">
                                            <ListItemIcon>
                                                <DashboardIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Dashboard'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff2'}>
                                        <ListItemButton to="/staff/staffList">
                                            <ListItemIcon>
                                                <StyleOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff List'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff5'}>
                                        <ListItemButton to="/staff/addStaff">
                                            <ListItemIcon>
                                                <GroupAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Add Staff'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/allPayments">
                                            <ListItemIcon>
                                                <AccountBalanceWalletIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'All Payments'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/leaves">
                                            <ListItemIcon>
                                                <EventBusyIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Leaves'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff3'}>
                                        <ListItemButton to="/staff/staffCategory">
                                            <ListItemIcon>
                                                <ListAltOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff Categorires Table'} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                                :
                                location.pathname.split('/')[1] == 'expense' && location.pathname.split('/')[2] == 'dashboard' ?
                                    <>
                                        <ListItem key={'staff1'}>
                                            <ListItemButton to="/dashboard">
                                                <ListItemIcon>
                                                    <DashboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Dashboard'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff2'}>
                                            <ListItemButton to="/bank/dashboard">
                                                <ListItemIcon>
                                                    <AccountBalanceIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Banks'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff5'}>
                                            <ListItemButton to="/businessReport">
                                                <ListItemIcon>
                                                    <AssessmentIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Business Report'} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                    :
                                    location.pathname.split('/')[1] == 'bank' && location.pathname.split('/')[2] == 'dashboard' ?
                                        <>
                                            <ListItem key={'staff1'}>
                                                <ListItemButton to="/dashboard">
                                                    <ListItemIcon>
                                                        <DashboardIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Dashboard'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem>
                                        </>
                                        :
                                        location.pathname.split('/')[1] == 'businessReport' ?
                                            <>
                                                <ListItem key={'staff1'}>
                                                    <ListItemButton to="/dashboard">
                                                        <ListItemIcon>
                                                            <DashboardIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Dashboard'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff2'}>
                                                    <ListItemButton to="/expense/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceWalletIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Expense'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff3'}>
                                                    <ListItemButton to="/bank/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Banks'} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                            :
                                            location.pathname.split('/')[1] == 'expense' || location.pathname.split('/')[1] == 'bank' || location.pathname.split('/')[1] == 'businessReport' ? <>
                                                <>
                                                    <ListItem key={'staff1'}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    {/* <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/bank/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Banks'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem> */}
                                                </>
                                                {location.pathname.split('/')[1] == 'expense' ?
                                                    <><ListItem key={'staff2'}>
                                                        <ListItemButton to="/expense/dashboard">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Expense'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                        {location.pathname.split('/').length == 8 ?
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[6]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem> :
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[4]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        }
                                                        {dashboardCategory?.map((data, index) => (
                                                            <ListItem key={data.categoryId}>
                                                                <ListItemButton to={`/expense/mainCategory/${data.categoryName}/${data.categoryId}`}>
                                                                    <ListItemIcon>
                                                                        <MoneyOffIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={data.categoryName} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))}
                                                    </>
                                                    : location.pathname.split('/')[1] == 'bank' ?
                                                        <>
                                                            <ListItem key={'staff3'}>
                                                                <ListItemButton to="/bank/dashboard">
                                                                    <ListItemIcon>
                                                                        <AccountBalanceIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={'Banks'} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            {banks?.map((data, index) => (
                                                                <ListItem key={data.bankId}>
                                                                    <ListItemButton to={`/bank/detail/${data.bankId}`}>
                                                                        <ListItemIcon>
                                                                            <SavingsIcon />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={data.bankDisplayName} />
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            ))}
                                                        </> :
                                                        <></>}
                                            </>
                                                :
                                                <>
                                                    <ListItem key={1}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={'ownerDashboard'}>
                                                        <ListItemButton to="/dashboardFactory">
                                                            <ListItemIcon>
                                                                <WorkspacesIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Departments'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={9}>
                                                        <ListItemButton to="/factory/productTable">
                                                            <ListItemIcon>
                                                                <ListAltOutlinedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Product Table'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={3}>
                                                        <ListItemButton to="/factory/production">
                                                            <ListItemIcon>
                                                                <CompareArrowsIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Production In/Out'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={23}>
                                                        <ListItemButton to="/factory/categoryWiseOut">
                                                            <ListItemIcon>
                                                                <ShoppingCartCheckoutIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'StockOut Report'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={5}>
                                                        <ListItemButton to="/factory/rawMaterialTable">
                                                            <ListItemIcon>
                                                                <CategoryIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Material List'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </>
                }
            </List>
        </Box>
    );
    const factoryListOwner = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Factory</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>

                {role == 5 ?
                    <ListItem key={3}>
                        <ListItemButton to="/stockOut">
                            <ListItemIcon>
                                <CompareArrowsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Stock In/Out'} />
                        </ListItemButton>
                    </ListItem>
                    : role == 4 ? <>
                        <ListItem key={'inout9'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout3'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                    </> : role == 3 ? <>
                        <ListItem key={'inout91'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout31'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout32'}>
                            <ListItemButton to="/InOutNpayment/supplierTable">
                                <ListItemIcon>
                                    <DomainAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Suppliers'} />
                            </ListItemButton>
                        </ListItem>
                    </> :
                        location.pathname.split('/')[1] == 'dashboardFactory' || location.pathname.split('/')[1] == 'dashboardOwner' || location.pathname.split('/')[1] == 'userTableOwner' || location.pathname.split('/')[1] == 'supplierDetailsOwner' || (location.pathname.split('/')[1] == 'addSupplier' && role == 1) ? <>
                            <ListItem key={'branchDashboard1'}>
                                <ListItemButton to="/dashboard">
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>
                            </ListItem>
                            {(location.pathname.split('/')[1] == 'supplierDetailsOwner' || location.pathname.split('/')[1] == 'addSupplier') &&
                                <ListItem key={'ownerDashboard'}>
                                    <ListItemButton to="/dashboardOwner">
                                        <ListItemIcon>
                                            <WorkspacesIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={'Branches'} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </> :
                            location.pathname.split('/')[1] == 'staff' ?
                                <>
                                    <ListItem key={'staff1'}>
                                        <ListItemButton to="/dashboard">
                                            <ListItemIcon>
                                                <DashboardIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Dashboard'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff2'}>
                                        <ListItemButton to="/staff/staffList">
                                            <ListItemIcon>
                                                <StyleOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff List'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff5'}>
                                        <ListItemButton to="/staff/addStaff">
                                            <ListItemIcon>
                                                <GroupAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Add Staff'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/allPayments">
                                            <ListItemIcon>
                                                <AccountBalanceWalletIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'All Payments'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/leaves">
                                            <ListItemIcon>
                                                <EventBusyIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Leaves'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff3'}>
                                        <ListItemButton to="/staff/staffCategory">
                                            <ListItemIcon>
                                                <ListAltOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff Categorires Table'} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                                :
                                location.pathname.split('/')[1] == 'expense' && location.pathname.split('/')[2] == 'dashboard' ?
                                    <>
                                        <ListItem key={'staff1'}>
                                            <ListItemButton to="/dashboard">
                                                <ListItemIcon>
                                                    <DashboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Dashboard'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff2'}>
                                            <ListItemButton to="/bank/dashboard">
                                                <ListItemIcon>
                                                    <AccountBalanceIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Banks'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff5'}>
                                            <ListItemButton to="/businessReport">
                                                <ListItemIcon>
                                                    <AssessmentIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Business Report'} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                    :
                                    location.pathname.split('/')[1] == 'bank' && location.pathname.split('/')[2] == 'dashboard' ?
                                        <>
                                            <ListItem key={'staff1'}>
                                                <ListItemButton to="/dashboard">
                                                    <ListItemIcon>
                                                        <DashboardIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Dashboard'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem>
                                        </>
                                        :
                                        location.pathname.split('/')[1] == 'businessReport' ?
                                            <>
                                                <ListItem key={'staff1'}>
                                                    <ListItemButton to="/dashboard">
                                                        <ListItemIcon>
                                                            <DashboardIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Dashboard'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff2'}>
                                                    <ListItemButton to="/expense/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceWalletIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Expense'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff3'}>
                                                    <ListItemButton to="/bank/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Banks'} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                            :
                                            location.pathname.split('/')[1] == 'expense' || location.pathname.split('/')[1] == 'bank' || location.pathname.split('/')[1] == 'businessReport' ? <>
                                                <>
                                                    <ListItem key={'staff1'}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    {/* <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/bank/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Banks'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem> */}
                                                </>
                                                {location.pathname.split('/')[1] == 'expense' ?
                                                    <><ListItem key={'staff2'}>
                                                        <ListItemButton to="/expense/dashboard">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Expense'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                        {location.pathname.split('/').length == 8 ?
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[6]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem> :
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[4]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        }
                                                        {dashboardCategory?.map((data, index) => (
                                                            <ListItem key={data.categoryId}>
                                                                <ListItemButton to={`/expense/mainCategory/${data.categoryName}/${data.categoryId}`}>
                                                                    <ListItemIcon>
                                                                        <MoneyOffIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={data.categoryName} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))}
                                                    </>
                                                    : location.pathname.split('/')[1] == 'bank' ?
                                                        <>
                                                            <ListItem key={'staff3'}>
                                                                <ListItemButton to="/bank/dashboard">
                                                                    <ListItemIcon>
                                                                        <AccountBalanceIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={'Banks'} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            {banks?.map((data, index) => (
                                                                <ListItem key={data.bankId}>
                                                                    <ListItemButton to={`/bank/detail/${data.bankId}`}>
                                                                        <ListItemIcon>
                                                                            <SavingsIcon />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={data.bankDisplayName} />
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            ))}
                                                        </> :
                                                        <></>}
                                            </>
                                                :
                                                <>
                                                    <ListItem key={'ownerDashboard'}>
                                                        <ListItemButton to="/dashboardFactory">
                                                            <ListItemIcon>
                                                                <WorkspacesIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Departments'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={9}>
                                                        <ListItemButton to="/inOut/factory/productTable">
                                                            <ListItemIcon>
                                                                <ListAltOutlinedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Product Table'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={3}>
                                                        <ListItemButton to="/inOut/factory/production">
                                                            <ListItemIcon>
                                                                <CompareArrowsIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Production In/Out'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={5}>
                                                        <ListItemButton to="/inOut/factory/rawMaterialTable">
                                                            <ListItemIcon>
                                                                <CategoryIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Material List'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </>
                }
            </List>
        </Box>
    );
    const factoryMaterialListStock = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Factory</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>
                <ListItem key={'ownerDashboard'}>
                    <ListItemButton to="/dashboardFactory">
                        <ListItemIcon>
                            <WorkspacesIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Departments'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={9}>
                    <ListItemButton to="/stock/material/materialTable">
                        <ListItemIcon>
                            <ListAltOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Material Table'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
    const factoryProductListStock = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Factory</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>
                <ListItem key={'ownerDashboard'}>
                    <ListItemButton to="/dashboardFactory">
                        <ListItemIcon>
                            <WorkspacesIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Departments'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={9}>
                    <ListItemButton to="/stock/factory/productTable">
                        <ListItemIcon>
                            <ListAltOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Product Table'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
    const materialList = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Material</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>

                {role == 5 ?
                    <ListItem key={3}>
                        <ListItemButton to="/stockOut">
                            <ListItemIcon>
                                <CompareArrowsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Stock In/Out'} />
                        </ListItemButton>
                    </ListItem>
                    : role == 4 ? <>
                        <ListItem key={'inout9'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout3'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                    </> : role == 3 ? <>
                        <ListItem key={'inout91'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout31'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout32'}>
                            <ListItemButton to="/InOutNpayment/supplierTable">
                                <ListItemIcon>
                                    <DomainAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Suppliers'} />
                            </ListItemButton>
                        </ListItem>
                    </> :
                        location.pathname.split('/')[1] == 'dashboardFactory' || location.pathname.split('/')[1] == 'dashboardOwner' || location.pathname.split('/')[1] == 'userTableOwner' || location.pathname.split('/')[1] == 'supplierDetailsOwner' || (location.pathname.split('/')[1] == 'addSupplier' && role == 1) ? <>
                            <ListItem key={'branchDashboard1'}>
                                <ListItemButton to="/dashboard">
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>
                            </ListItem>
                            {(location.pathname.split('/')[1] == 'supplierDetailsOwner' || location.pathname.split('/')[1] == 'addSupplier') &&
                                <ListItem key={'ownerDashboard'}>
                                    <ListItemButton to="/dashboardOwner">
                                        <ListItemIcon>
                                            <WorkspacesIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={'Branches'} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </> :
                            location.pathname.split('/')[1] == 'staff' ?
                                <>
                                    <ListItem key={'staff1'}>
                                        <ListItemButton to="/dashboard">
                                            <ListItemIcon>
                                                <DashboardIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Dashboard'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff2'}>
                                        <ListItemButton to="/staff/staffList">
                                            <ListItemIcon>
                                                <StyleOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff List'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff5'}>
                                        <ListItemButton to="/staff/addStaff">
                                            <ListItemIcon>
                                                <GroupAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Add Staff'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/allPayments">
                                            <ListItemIcon>
                                                <AccountBalanceWalletIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'All Payments'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/leaves">
                                            <ListItemIcon>
                                                <EventBusyIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Leaves'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff3'}>
                                        <ListItemButton to="/staff/staffCategory">
                                            <ListItemIcon>
                                                <ListAltOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff Categorires Table'} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                                :
                                location.pathname.split('/')[1] == 'expense' && location.pathname.split('/')[2] == 'dashboard' ?
                                    <>
                                        <ListItem key={'staff1'}>
                                            <ListItemButton to="/dashboard">
                                                <ListItemIcon>
                                                    <DashboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Dashboard'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff2'}>
                                            <ListItemButton to="/bank/dashboard">
                                                <ListItemIcon>
                                                    <AccountBalanceIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Banks'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff5'}>
                                            <ListItemButton to="/businessReport">
                                                <ListItemIcon>
                                                    <AssessmentIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Business Report'} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                    :
                                    location.pathname.split('/')[1] == 'bank' && location.pathname.split('/')[2] == 'dashboard' ?
                                        <>
                                            <ListItem key={'staff1'}>
                                                <ListItemButton to="/dashboard">
                                                    <ListItemIcon>
                                                        <DashboardIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Dashboard'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem>
                                        </>
                                        :
                                        location.pathname.split('/')[1] == 'businessReport' ?
                                            <>
                                                <ListItem key={'staff1'}>
                                                    <ListItemButton to="/dashboard">
                                                        <ListItemIcon>
                                                            <DashboardIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Dashboard'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff2'}>
                                                    <ListItemButton to="/expense/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceWalletIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Expense'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff3'}>
                                                    <ListItemButton to="/bank/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Banks'} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                            :
                                            location.pathname.split('/')[1] == 'expense' || location.pathname.split('/')[1] == 'bank' || location.pathname.split('/')[1] == 'businessReport' ? <>
                                                <>
                                                    <ListItem key={'staff1'}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    {/* <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/bank/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Banks'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem> */}
                                                </>
                                                {location.pathname.split('/')[1] == 'expense' ?
                                                    <><ListItem key={'staff2'}>
                                                        <ListItemButton to="/expense/dashboard">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Expense'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                        {location.pathname.split('/').length == 8 ?
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[6]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem> :
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[4]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        }
                                                        {dashboardCategory?.map((data, index) => (
                                                            <ListItem key={data.categoryId}>
                                                                <ListItemButton to={`/expense/mainCategory/${data.categoryName}/${data.categoryId}`}>
                                                                    <ListItemIcon>
                                                                        <MoneyOffIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={data.categoryName} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))}
                                                    </>
                                                    : location.pathname.split('/')[1] == 'bank' ?
                                                        <>
                                                            <ListItem key={'staff3'}>
                                                                <ListItemButton to="/bank/dashboard">
                                                                    <ListItemIcon>
                                                                        <AccountBalanceIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={'Banks'} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            {banks?.map((data, index) => (
                                                                <ListItem key={data.bankId}>
                                                                    <ListItemButton to={`/bank/detail/${data.bankId}`}>
                                                                        <ListItemIcon>
                                                                            <SavingsIcon />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={data.bankDisplayName} />
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            ))}
                                                        </> :
                                                        <></>}
                                            </>
                                                :
                                                <>
                                                    <ListItem key={1}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={'ownerDashboard'}>
                                                        <ListItemButton to="/dashboardFactory">
                                                            <ListItemIcon>
                                                                <WorkspacesIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Departments'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={9}>
                                                        <ListItemButton to="/material/materialTable">
                                                            <ListItemIcon>
                                                                <ListAltOutlinedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Material Table'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={3}>
                                                        <ListItemButton to="/material/materialInOut">
                                                            <ListItemIcon>
                                                                <CompareArrowsIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Stock In/Out'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={4}>
                                                        <ListItemButton to="/material/supplierTable">
                                                            <ListItemIcon>
                                                                <DomainAddIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Suppliers'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={5}>
                                                        <ListItemButton to="/material/categories">
                                                            <ListItemIcon>
                                                                <CategoryIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Categories'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={6}>
                                                        <ListItemButton to="/material/transactionTable">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Transaction History'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </>
                }
            </List>
        </Box>
    );
    const materialListOwner = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Material</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>

                {role == 5 ?
                    <ListItem key={3}>
                        <ListItemButton to="/stockOut">
                            <ListItemIcon>
                                <CompareArrowsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Stock In/Out'} />
                        </ListItemButton>
                    </ListItem>
                    : role == 4 ? <>
                        <ListItem key={'inout9'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout3'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                    </> : role == 3 ? <>
                        <ListItem key={'inout91'}>
                            <ListItemButton to="/InOut/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout31'}>
                            <ListItemButton to="/InOut/stockInOut">
                                <ListItemIcon>
                                    <CompareArrowsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Stock In/Out'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'inout32'}>
                            <ListItemButton to="/InOutNpayment/supplierTable">
                                <ListItemIcon>
                                    <DomainAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Suppliers'} />
                            </ListItemButton>
                        </ListItem>
                    </> :
                        location.pathname.split('/')[1] == 'dashboardFactory' || location.pathname.split('/')[1] == 'dashboardOwner' || location.pathname.split('/')[1] == 'userTableOwner' || location.pathname.split('/')[1] == 'supplierDetailsOwner' || (location.pathname.split('/')[1] == 'addSupplier' && role == 1) ? <>
                            <ListItem key={'branchDashboard1'}>
                                <ListItemButton to="/dashboard">
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>
                            </ListItem>
                            {(location.pathname.split('/')[1] == 'supplierDetailsOwner' || location.pathname.split('/')[1] == 'addSupplier') &&
                                <ListItem key={'ownerDashboard'}>
                                    <ListItemButton to="/dashboardOwner">
                                        <ListItemIcon>
                                            <WorkspacesIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={'Branches'} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </> :
                            location.pathname.split('/')[1] == 'staff' ?
                                <>
                                    <ListItem key={'staff1'}>
                                        <ListItemButton to="/dashboard">
                                            <ListItemIcon>
                                                <DashboardIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Dashboard'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff2'}>
                                        <ListItemButton to="/staff/staffList">
                                            <ListItemIcon>
                                                <StyleOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff List'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff5'}>
                                        <ListItemButton to="/staff/addStaff">
                                            <ListItemIcon>
                                                <GroupAddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Add Staff'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/allPayments">
                                            <ListItemIcon>
                                                <AccountBalanceWalletIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'All Payments'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff6'}>
                                        <ListItemButton to="/staff/leaves">
                                            <ListItemIcon>
                                                <EventBusyIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Leaves'} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem key={'staff3'}>
                                        <ListItemButton to="/staff/staffCategory">
                                            <ListItemIcon>
                                                <ListAltOutlinedIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={'Staff Categorires Table'} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                                :
                                location.pathname.split('/')[1] == 'expense' && location.pathname.split('/')[2] == 'dashboard' ?
                                    <>
                                        <ListItem key={'staff1'}>
                                            <ListItemButton to="/dashboard">
                                                <ListItemIcon>
                                                    <DashboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Dashboard'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff2'}>
                                            <ListItemButton to="/bank/dashboard">
                                                <ListItemIcon>
                                                    <AccountBalanceIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Banks'} />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem key={'staff5'}>
                                            <ListItemButton to="/businessReport">
                                                <ListItemIcon>
                                                    <AssessmentIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'Business Report'} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                    :
                                    location.pathname.split('/')[1] == 'bank' && location.pathname.split('/')[2] == 'dashboard' ?
                                        <>
                                            <ListItem key={'staff1'}>
                                                <ListItemButton to="/dashboard">
                                                    <ListItemIcon>
                                                        <DashboardIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Dashboard'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem>
                                        </>
                                        :
                                        location.pathname.split('/')[1] == 'businessReport' ?
                                            <>
                                                <ListItem key={'staff1'}>
                                                    <ListItemButton to="/dashboard">
                                                        <ListItemIcon>
                                                            <DashboardIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Dashboard'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff2'}>
                                                    <ListItemButton to="/expense/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceWalletIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Expense'} />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem key={'staff3'}>
                                                    <ListItemButton to="/bank/dashboard">
                                                        <ListItemIcon>
                                                            <AccountBalanceIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={'Banks'} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                            :
                                            location.pathname.split('/')[1] == 'expense' || location.pathname.split('/')[1] == 'bank' || location.pathname.split('/')[1] == 'businessReport' ? <>
                                                <>
                                                    <ListItem key={'staff1'}>
                                                        <ListItemButton to="/dashboard">
                                                            <ListItemIcon>
                                                                <DashboardIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Dashboard'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    {/* <ListItem key={'staff2'}>
                                                <ListItemButton to="/expense/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expense'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff2'}>
                                                <ListItemButton to="/bank/dashboard">
                                                    <ListItemIcon>
                                                        <AccountBalanceIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Banks'} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem key={'staff5'}>
                                                <ListItemButton to="/businessReport">
                                                    <ListItemIcon>
                                                        <AssessmentIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Business Report'} />
                                                </ListItemButton>
                                            </ListItem> */}
                                                </>
                                                {location.pathname.split('/')[1] == 'expense' ?
                                                    <><ListItem key={'staff2'}>
                                                        <ListItemButton to="/expense/dashboard">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Expense'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                        {location.pathname.split('/').length == 8 ?
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[6]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem> :
                                                            <ListItem key={'common'}>
                                                                <ListItemButton to={`/expense/mainCategory/${location.pathname.split('/')[3].replace(/20|%20/g, ' ')}/expenses/${location.pathname.split('/')[4]}`}>
                                                                    <ListItemIcon>
                                                                        <AllInboxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={`${location.pathname.split('/')[3].replace(/20|%20/g, ' ') + ' ' + 'Expense'}`} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        }
                                                        {dashboardCategory?.map((data, index) => (
                                                            <ListItem key={data.categoryId}>
                                                                <ListItemButton to={`/expense/mainCategory/${data.categoryName}/${data.categoryId}`}>
                                                                    <ListItemIcon>
                                                                        <MoneyOffIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={data.categoryName} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))}
                                                    </>
                                                    : location.pathname.split('/')[1] == 'bank' ?
                                                        <>
                                                            <ListItem key={'staff3'}>
                                                                <ListItemButton to="/bank/dashboard">
                                                                    <ListItemIcon>
                                                                        <AccountBalanceIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={'Banks'} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            {banks?.map((data, index) => (
                                                                <ListItem key={data.bankId}>
                                                                    <ListItemButton to={`/bank/detail/${data.bankId}`}>
                                                                        <ListItemIcon>
                                                                            <SavingsIcon />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={data.bankDisplayName} />
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            ))}
                                                        </> :
                                                        <></>}
                                            </>
                                                :
                                                <>
                                                    <ListItem key={'ownerDashboard'}>
                                                        <ListItemButton to="/dashboardFactory">
                                                            <ListItemIcon>
                                                                <WorkspacesIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Departments'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={9}>
                                                        <ListItemButton to="/inOut/material/materialTable">
                                                            <ListItemIcon>
                                                                <ListAltOutlinedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Material Table'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={3}>
                                                        <ListItemButton to="/inOut/material/materialInOut">
                                                            <ListItemIcon>
                                                                <CompareArrowsIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Stock In/Out'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={4}>
                                                        <ListItemButton to="/inOut/material/supplierTable">
                                                            <ListItemIcon>
                                                                <DomainAddIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Suppliers'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={5}>
                                                        <ListItemButton to="/inOut/material/categories">
                                                            <ListItemIcon>
                                                                <CategoryIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Categories'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <ListItem key={6}>
                                                        <ListItemButton to="/inOut/material/transactionTable">
                                                            <ListItemIcon>
                                                                <AccountBalanceWalletIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={'Transaction History'} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </>
                }
            </List>
        </Box>
    );
    const distributorList = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Distributor</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>
                <ListItem key={1}>
                    <ListItemButton to="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'ownerDashboard'}>
                    <ListItemButton to="/dashboardFactory">
                        <ListItemIcon>
                            <WorkspacesIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Departments'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={9}>
                    <ListItemButton to="/distributor/distributorTable">
                        <ListItemIcon>
                            <ListAltOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Distributor Table'} />
                    </ListItemButton>
                </ListItem>
                {/* <ListItem key={3}>
                    <ListItemButton to="/material/materialInOut">
                        <ListItemIcon>
                            <CompareArrowsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Stock In/Out'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={4}>
                    <ListItemButton to="/material/supplierTable">
                        <ListItemIcon>
                            <DomainAddIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Suppliers'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={5}>
                    <ListItemButton to="/material/categories">
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Categories'} />
                    </ListItemButton>
                </ListItem> */}
                <ListItem key={6}>
                    <ListItemButton to="/distributor/transactionTable">
                        <ListItemIcon>
                            <AccountBalanceWalletIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Transaction History'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
    const distributorListOwner = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Distributor</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>
                <ListItem key={'ownerDashboard'}>
                    <ListItemButton to="/dashboardFactory">
                        <ListItemIcon>
                            <WorkspacesIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Departments'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={9}>
                    <ListItemButton to="/inOut/distributor/distributorTable">
                        <ListItemIcon>
                            <ListAltOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Distributor Table'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={6}>
                    <ListItemButton to="/inOut/distributor/transactionTable">
                        <ListItemIcon>
                            <AccountBalanceWalletIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Transaction History'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div className="navBar grid content-center">
            <div className='flex justify-between h-full'>
                <div className='logoWrp flex h-full'>
                    {
                        location.pathname.split('/')[1] != 'dashboard' ?
                            <div className='h-full grid content-center'>
                                <div>
                                    {['left'].map((anchor) => (
                                        <React.Fragment key={anchor}>
                                            <Button onClick={toggleDrawer(anchor, true)}><MenuIcon fontSize='large' style={{ color: 'black' }} /></Button>
                                            <Drawer
                                                anchor={anchor}
                                                open={state[anchor]}
                                                onClose={toggleDrawer(anchor, false)}
                                            >
                                                {
                                                    (location.pathname.split('/')[1] == 'inOut' && location.pathname.split('/')[2] == 'distributor')
                                                        ? distributorListOwner(anchor) : (location.pathname.split('/')[1] == 'inOut' && location.pathname.split('/')[2] == 'material')
                                                            ? materialListOwner(anchor) : (location.pathname.split('/')[1] == 'inOut' && location.pathname.split('/')[2] == 'factory')
                                                                ? factoryListOwner(anchor) : (location.pathname.split('/')[1] == 'stock' && location.pathname.split('/')[2] == 'factory')
                                                                    ? factoryProductListStock(anchor) : (location.pathname.split('/')[1] == 'stock' && location.pathname.split('/')[2] == 'material')
                                                                        ? factoryMaterialListStock(anchor) : location.pathname.split('/')[1] == 'factory' || location.pathname.split('/')[1] == 'dashboardFactory'
                                                                            ? factoryList(anchor) : location.pathname.split('/')[1] == 'material' ? materialList(anchor) : location.pathname.split('/')[1] == 'distributor'
                                                                                ? distributorList() : list(anchor)
                                                }
                                            </Drawer>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            : null
                    }
                    <div>
                        <img className='headerImg' src={LogoWithDate} alt='No Image Found' />
                    </div>
                </div>
                {
                    !(location.pathname.split('/')[1] == 'dashboardOwner' || (location.pathname.split('/')[1] == 'dashboard' && role == 1) || location.pathname.split('/')[1] == 'material' || location.pathname.split('/')[1] == 'factory' || location.pathname.split('/')[1] == 'stock' || location.pathname.split('/')[1] == 'distributor' || location.pathname.split('/')[1] == 'dashboardFactory') ? <div className='BranchName flex'>
                        <div className='self-center'>
                            {userInfo.branchName}
                        </div>
                    </div> : ''
                }

                <div className='logoutWrp flex justify-end'>
                    <div className='greeting h-full grid content-center mr-24'>
                        {role != 5 ? greetMsg + ', ' + user?.userName : ''}
                    </div>
                    <button className='h-full grid content-center' onClick={logout}>
                        <LogoutIcon fontSize='medium' />
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default NavBar;