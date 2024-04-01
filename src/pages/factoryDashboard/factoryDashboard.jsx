// import ConsoleCard from "./component/consoleCard/consoleCard";
import './factoryDashboard.css';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import CryptoJS from 'crypto-js';
import Box from '@mui/material/Box';
// import BankCard from "../bankCard/bankCard";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import BankMenu from "./menu/menuBank";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import dayjs from 'dayjs';
import BranchCard from './branchCard/branchCard';
import MenuSuppiler from './menuSuppiler';
import MaterialCard from './branchCard/materialCard';
import DistributorCard from './branchCard/distributorCard';
// import ExportMenu from '../exportMenu/exportMenu';
// import BankTransactionMenu from "./menu/bankTransactionMenu";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const decryptData = (text) => {
    const key = process.env.REACT_APP_AES_KEY;
    console.log('key', process.env.REACT_APP_AES_KEY)
    const bytes = CryptoJS.AES.decrypt(text, key);
    const data = bytes.toString(CryptoJS.enc.Utf8) ? JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) : 0;
    return (data);
};
const encryptData = (text) => {
    const key = process.env.REACT_APP_AES_KEY;
    console.log('key', process.env.REACT_APP_AES_KEY)
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        key
    ).toString();

    return (data);
};
const styleIncome = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function FactoryDashboard() {
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [branchDdl, setBranchDdl] = React.useState([]);
    const [searchWord, setSearchWord] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [branch, setBranch] = useState();
    const [isEdit, setIsEdit] = React.useState(false);
    const [formDataBranch, setFormDataBranch] = useState({
        mfProductCategoryName: ''
    });
    const [formDataErrorBranch, setFormDataErrorBranch] = useState({
        mfProductCategoryName: false
    })
    const [fieldsBranch, setFieldsBranch] = useState([
        'mfProductCategoryName'
    ])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [tab, setTab] = React.useState(1);
    const [openModal, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    useEffect(() => {
        getBranches();
    }, [])
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    const decoded = jwt_decode(user.token);
    const expirationTime = (decoded.exp * 1000) - 60000

    const handleCloseModalBranch = () => {
        setOpen(false);
        setFormDataBranch({
            mfProductCategoryName: false
        })
        setFormDataErrorBranch({
            mfProductCategoryName: false
        })
        setIsEdit(false);
    };
    const handleOpen = () => setOpen(true);
    const onChangeBranch = (e) => {
        setFormDataBranch((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const getBranches = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfProductCategoryList`, config)
            .then((res) => {
                setBranch(res.data);
            })
    }
    const goToBranch = async (id, name) => {
        const data = {
            ...userInfo,
            categoryId: id,
            categoryName: name
        }
        await axios.post(`${BACKEND_BASE_URL}userrouter/getNewTokenByMfProductCategoryId`, data, config)
            .then((res) => {
                res.data.userRights = res.data.rights ? encryptData(res.data.rights) : res.data.rights;
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                role == 6 ? navigate('/inOut/factory/productTable') : role == 1 ? navigate('/factory/productTable') : navigate('/stock/factory/productTable');
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const deleteBranch = async (id) => {
        if (window.prompt("If you delete this Branch the all Data in Branch will be deleted... Enter Password to delete") == 'admin') {
            await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeMfProductCategory?mfProductCategoryId=${id}`, config)
                .then((res) => {
                    setSuccess(true);
                    getBranches();
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const handleEditBranch = (id, name) => {
        setIsEdit(true);
        setOpen(true);
        setFormDataBranch({
            mfProductCategoryId: id,
            mfProductCategoryName: name
        })
        setFormDataErrorBranch({
            mfProductCategoryName: false
        })
    }
    const addBranch = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addMfProductCategory`, formDataBranch, config)
            .then((res) => {
                setLoading(false);
                getBranches();
                setSuccess(true);
                setFormDataBranch({
                    mfProductCategoryName: ''
                })
                setFormDataErrorBranch({
                    mfProductCategoryName: false
                })
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editBranch = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateMfProductCategory`, formDataBranch, config)
            .then((res) => {
                setLoading(false);
                getBranches();
                setOpen(false);
                setSuccess(true);
                setIsEdit(false)
                setFormDataBranch({
                    mfProductCategoryName: ''
                })
                setFormDataErrorBranch({
                    mfProductCategoryName: false
                })
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitBranch = () => {
        if (loading || success) {

        } else {
            const isValidate = fieldsBranch.filter(element => {
                if (formDataErrorBranch[element] === true || formDataBranch[element] === '') {
                    setFormDataErrorBranch((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addBranch()
            }
        }
    }
    const submitEditBranch = () => {
        if (loading || success) {

        } else {
            const isValidate = fieldsBranch.filter(element => {
                if (formDataErrorBranch[element] === true || formDataBranch[element] === '') {
                    setFormDataErrorBranch((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                editBranch()
            }
        }
    }
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

    return (
        <div className='mainBody'>
            <div className='productListContainer'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='productTableSubContainer'>
                            <div className='h-full grid grid-cols-12'>
                                <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                    <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                        <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                            setTab(1);
                                            // getBranches();
                                        }}>
                                            <div className='statusTabtext'>Depatrments</div>
                                        </div>
                                    </div>
                                </div>
                                {role == 1 &&
                                    <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                        <div className='self-center justify-self-end'>
                                            <button className='addProductBtn' onClick={handleOpen}>Add Department</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cardWrp">
                <div className="grid lg:grid-cols-3 mobile:grid-cols-1 tablet1:grid-cols-2 tablet:grid-cols-2 cardTablet:grid-cols-3 laptop:grid-cols-3 laptopDesk:grid-cols-4 desktop1:grid-cols-4 desktop2:grid-cols-5 desktop2:grid-cols-5 gap-6">
                    <MaterialCard role={role} />
                    {(role == 1 || role == 6) &&
                        <DistributorCard role={role} />
                    }
                    {
                        branch && branch.map((data, index) => (
                            // <BankCard goToBank={gotToBankDetail} data={data} name={data.bankDisplayName} imgName={data.bankIconName} />
                            <BranchCard goToBranch={goToBranch} deleteBranch={deleteBranch} editBranch={handleEditBranch} data={data} role={role} />
                        ))
                    }
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModalBranch}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Branch' : 'Add Branch'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value.length || e.target.value.length < 2) {
                                        setFormDataErrorBranch((perv) => ({
                                            ...perv,
                                            mfProductCategoryName: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorBranch((perv) => ({
                                            ...perv,
                                            mfProductCategoryName: false
                                        }))
                                    }
                                }}
                                onChange={onChangeBranch}
                                value={formDataBranch.mfProductCategoryName ? formDataBranch.mfProductCategoryName : ''}
                                error={formDataErrorBranch.mfProductCategoryName}
                                inputRef={textFieldRef}
                                helperText={formDataErrorBranch.mfProductCategoryName ? "Please Enter Product Name" : ''}
                                name="mfProductCategoryName"
                                id="outlined-required"
                                label="Department Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? submitEditBranch() : submitBranch()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModalBranch();
                                setFormDataBranch({
                                    mfProductCategoryName: ''
                                });
                                setFormDataErrorBranch({
                                    mfProductCategoryName: false
                                })
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default FactoryDashboard;