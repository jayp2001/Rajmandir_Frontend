// import ConsoleCard from "./component/consoleCard/consoleCard";
import './unitTable.css';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { BACKEND_BASE_URL } from '../../../url';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { ToastContainer, toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
// import Menutemp from './menuUser';
import CryptoJS from 'crypto-js';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import dayjs from 'dayjs';
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
const encryptData = (text) => {
    const key = process.env.REACT_APP_AES_KEY;
    console.log('key', process.env.REACT_APP_AES_KEY)
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        key
    ).toString();

    return (data);
};
function UnitsTable() {
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
    const [bankError, setBankError] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [sourceFormData, setSourceFormData] = React.useState({
        sourceName: ''
    });
    const [sourceFormDataError, setSourceFormDataError] = React.useState({
        sourceName: false
    });
    const [expanded, setExpanded] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsSuppilers, setTotalRowsSuppilers] = React.useState(0);
    const [totalRowsIncome, setTotalRowsIncome] = React.useState(0);
    const [totalRowsTransaction, setTotalRowsTransaction] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [rights, setRights] = useState();
    const [branch, setBranch] = useState();
    const [isEdit, setIsEdit] = React.useState(false);
    const [data, setData] = React.useState();
    const [suppilers, setSuppilers] = React.useState();
    const [bankTransaction, setBankTranaction] = React.useState();
    const [banks, setBanks] = React.useState();
    const [openPayment, setOpenPayment] = React.useState(false);
    const [incomeSources, setIncomeSources] = React.useState();
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [formDataPayment, setFormDataPayment] = React.useState({
        supplierId: '',
        receivedBy: '',
        paidAmount: '',
        transactionNote: '',
        remainingAmount: '',
        supplierName: '',
        branchId: ''
    });
    const [formDataErrorPayment, setFormDataErrorPayment] = React.useState({
        receivedBy: false,
        paidAmount: false,
        branchId: false
    });
    const [formDataErrorFeildPayment, setFormDataErrorFeildPayment] = React.useState([
        'receivedBy',
        'paidAmount',
        'branchId'
    ]);

    const [formDataBranch, setFormDataBranch] = useState({
        unitName: ''
    });
    const [formDataErrorBranch, setFormDataErrorBranch] = useState({
        unitName: false
    })
    const [fieldsBranch, setFieldsBranch] = useState([
        'unitName'
    ])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [filter, setFilter] = React.useState(false);
    const id = open ? 'simple-popover' : undefined;
    const [sourceList, setSourceList] = React.useState();
    const [destinationList, setDestinationList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [subCategories, setSubCategories] = React.useState();
    const [tab, setTab] = React.useState(1);
    const [openModal, setOpen] = React.useState(false);
    const [bank, setBank] = React.useState({
        bankName: '',
        bankIconName: '',
        bankShortForm: '',
        bankDisplayName: '',
        bankAccountNumber: '',
        ifscCode: ''
    });
    const navigate = useNavigate();
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    useEffect(() => {
        getBranches();
        getData();
        // getBanks();
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
            unitName: false
        })
        setFormDataErrorBranch({
            unitName: false
        })
        setIsEdit(false);
    };
    const handleOpen = () => setOpen(true);

    const onChangePayment = (e) => {
        setFormDataPayment((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onChangePaymentBranch = (e) => {
        const object = branchDdl?.find(obj => obj.branchId === e.target.value);
        setFormDataPayment((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
            remainingAmount: object.remainingPayment ? object.remainingPayment : 0
        }))
    }
    const onChangeBranch = (e) => {
        setFormDataBranch((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBranches = async () => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUnit`, config)
            .then((res) => {
                setSuppilers(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleEditBranch = (name) => {
        setIsEdit(true);
        setOpen(true);
        setFormDataBranch({
            preUnitName: name,
            unitName: name
        })
        setFormDataErrorBranch({
            unitName: false
        })
    }
    const addBranch = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/addUnit`, formDataBranch, config)
            .then((res) => {
                setLoading(false);
                getBranches();
                setSuccess(true);
                setFormDataBranch({
                    unitName: ''
                })
                setFormDataErrorBranch({
                    unitName: false
                })
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editBranch = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/updateUnit`, formDataBranch, config)
            .then((res) => {
                setLoading(false);
                getBranches();
                setOpen(false);
                setSuccess(true);
                setFormDataBranch({
                    unitName: ''
                })
                setFormDataErrorBranch({
                    unitName: false
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
                                            <div className='statusTabtext'>Units</div>
                                        </div>
                                    </div>
                                </div>
                                <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                    <div className='self-center justify-self-end'>
                                        <button className='addProductBtn' onClick={handleOpen}>Add Unit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 productListContainer'>
                <div className="col-span-12">
                    <div className='grid grid-cols-12'>
                        <div className='col-span-12'>
                            <div className='userTableSubContainer pt-4'>
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650, marginBottom: "20px" }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Unit Name</TableCell>
                                                    <TableCell align="right"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {suppilers?.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" style={{ maxWidth: "15px", width: "15px" }} >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <button className='editCategoryBtn mr-6' onClick={() => handleEditBranch(row)}>Edit</button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div >
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
                        {isEdit ? 'Edit Unit' : 'Add Unit'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value.length || e.target.value.length < 2) {
                                        setFormDataErrorBranch((perv) => ({
                                            ...perv,
                                            unitName: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorBranch((perv) => ({
                                            ...perv,
                                            unitName: false
                                        }))
                                    }
                                }}
                                onChange={onChangeBranch}
                                value={formDataBranch.unitName ? formDataBranch.unitName : ''}
                                error={formDataErrorBranch.unitName}
                                inputRef={textFieldRef}
                                helperText={formDataErrorBranch.unitName ? "Please Enter Unit Name" : ''}
                                name="unitName"
                                id="outlined-required"
                                label="Unit Name"
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
                                    unitName: ''
                                });
                                setFormDataErrorBranch({
                                    unitName: false
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

export default UnitsTable;