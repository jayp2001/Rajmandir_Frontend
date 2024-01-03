// import ConsoleCard from "./component/consoleCard/consoleCard";
import './branchDashboard.css';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { BACKEND_BASE_URL } from '../../url';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { ToastContainer, toast } from 'react-toastify';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import jwt_decode from 'jwt-decode';
import Menutemp from './menuUser';
import CryptoJS from 'crypto-js';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
// import BankCard from "../bankCard/bankCard";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
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
import TransactionTableCommon from './transaction/transactionTable';
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
function BranchDashboard() {
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
    // const [formData, setFormData] = useState({
    //     fromId: "",
    //     toId: "",
    //     transactionAmount: 0,
    //     comment: "",
    //     transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
    //     transactionStatus: ''
    // });
    const [data, setData] = React.useState();
    const [suppilers, setSuppilers] = React.useState();
    const [bankTransaction, setBankTranaction] = React.useState();
    const [banks, setBanks] = React.useState();
    const [openPayment, setOpenPayment] = React.useState(false);
    const [incomeSources, setIncomeSources] = React.useState();
    // const [formDataError, setFormDataError] = useState({
    //     source: false,
    //     destination: false,
    //     transactionAmount: false,
    //     transactionDate: false,
    // })
    // const [formDataErrorFields, setFormDataErrorFields] = useState([
    //     "source",
    //     "destination",
    //     "transactionAmount",
    //     "transactionDate",
    // ])
    // const [formDataEditErrorFields, setFormDataEditErrorFields] = useState([
    //     "transactionAmount",
    //     "transactionDate",
    // ])
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


    const [formData, setFormData] = useState({
        userFirstName: '',
        userLastName: '',
        userGender: '',
        userName: '',
        password: '',
        emailId: '',
        userRights: '',
        branchId: ''
    });
    const [formDataBranch, setFormDataBranch] = useState({
        branchName: ''
    });
    const [formDataErrorBranch, setFormDataErrorBranch] = useState({
        branchName: false
    })
    const [fieldsBranch, setFieldsBranch] = useState([
        'branchName'
    ])
    const [formDataError, setFormDataError] = useState({
        userFirstName: false,
        userLastName: false,
        userGender: false,
        userName: false,
        password: false,
        emailId: false,
        userRights: false,
        branchId: false
    })

    const [fields, setFields] = useState([
        'userFirstName',
        'userLastName',
        'userGender',
        'userName',
        'password',
        'emailId',
        'userRights',
        'branchId'
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
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
    }
    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args)
            }, 700)
        }

    }
    const makePayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addSupplierTransactionDetails`, formDataPayment, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5)
                getDataSuppiler();
                handleClose();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitPayment = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeildPayment.filter(element => {
                if (formDataErrorPayment[element] === true || formDataPayment[element] === '' || formDataPayment[element] === 0) {
                    setFormDataErrorPayment((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                console.log('>>>log', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                makePayment()
            }
        }
    }
    const handleClose = () => {
        setFormDataPayment({
            supplierId: '',
            receivedBy: '',
            paidAmount: '',
            transactionNote: '',
            remainingAmount: '',
            supplierName: '',
            branchId: ''
        })
        setFormDataErrorPayment({
            receivedBy: false,
            paidAmount: false,
            branchId: false
        })
        setOpenPayment(false);
    }
    const handleSearch = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        search(document.getElementById('searchWord').value)
    }

    const debounceFunction = React.useCallback(debounce(handleSearch), [])
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
            branchName: false
        })
        setFormDataErrorBranch({
            branchName: false
        })
        setIsEdit(false);
    };
    const search = async (searchWord) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierAllBranchData?page=${1}&numPerPage=${5}&searchWord=${searchWord}`, config)
            .then((res) => {
                setSuppilers(res.data.rows);
                setTotalRowsSuppilers(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleOpen = () => setOpen(true);
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

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
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeBankData?bankId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteUser = async (id) => {
        setLoading(true);
        if (window.confirm("Are you sure you want to delete User?")) {
            await axios.delete(`${BACKEND_BASE_URL}userrouter/removeUser?userId=${id}`, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    getData();
                })
                .catch((error) => {
                    alert(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tab === 2 || tab === '2') {
            getDataOnPageChange(newPage + 1, rowsPerPage)
        } else {
            getDataOnPageChangeSuppiler(newPage + 1, rowsPerPage)
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === 2 || tab === '2') {
            getDataOnPageChange(1, parseInt(event.target.value, 10))
        }
        else {
            getDataOnPageChangeSuppiler(1, parseInt(event.target.value, 10))
        }

    };
    const excelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForFundTransfer?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForFundTransfer?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Expense_List_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const pdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForFundTransfer?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForFundTransfer?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Expense_List_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const excelExportIncome = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForIncomeData?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForIncomeData?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'IncomeCategory_List_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const pdfExportIncome = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForIncomeData?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForIncomeData?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'IncomeCategory_List_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const getRights = async () => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/ddlRights`, config)
            .then((res) => {
                setRights(res.data);
            })
    }
    const getBranches = async () => {
        await axios.get(`${BACKEND_BASE_URL}branchrouter/getBranchList`, config)
            .then((res) => {
                setBranch(res.data);
            })
    }
    const deleteDataSuppiler = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeSupplierDetails?supplierId=${id}`, config)
            .then((res) => {
                setPage(0);
                setSuccess(true)
                setRowsPerPage(5);
                getData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteSuppiler = (id) => {
        if (window.confirm("Are you sure you want to delete User?")) {
            deleteDataSuppiler(id);
            setTimeout(() => {
                getData()
            }, 1000)
        }
    }
    const handleOpenPayment = async (row) => {
        // getCategoryList();
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlBranchList?supplierId=${row.supplierId}`, config)
            .then((res) => {
                setBranchDdl(res.data);
                setFormDataPayment((perv) => ({
                    ...perv,
                    supplierId: row.supplierId,
                    receivedBy: row.supplierNickName,
                    supplierFirmName: row.supplierFirmName,
                }))
                setOpenPayment(true);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleSuppilerOnClick = (id) => {
        navigate(`/suppilerDetails/${id}`)
    }
    const editUser = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/updateUserDetailsByOwner`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                getData();
                setFormData({
                    userFirstName: '',
                    userLastName: '',
                    userGender: '',
                    userName: '',
                    password: '',
                    emailId: '',
                    userRights: '',
                    branchId: ''
                });
                setFormDataError({
                    userFirstName: false,
                    userLastName: false,
                    userGender: false,
                    userName: false,
                    password: false,
                    emailId: false,
                    userRights: false,
                    branchId: false
                });
                setExpanded(false);
                setIsEdit(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const goToBranch = async (id, name) => {
        const data = {
            ...userInfo,
            idToAdd: id,
            branchName: name
        }
        await axios.post(`${BACKEND_BASE_URL}userrouter/getNewTokenByBranchId`, data, config)
            .then((res) => {
                res.data.userRights = res.data.rights ? encryptData(res.data.rights) : res.data.rights;
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                navigate('/dashboard');
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const deleteBranch = async (id) => {
        if (window.prompt("If you delete this Branch the all Data in Branch will be deleted... Enter Password to delete") == 'admin') {
            await axios.delete(`${BACKEND_BASE_URL}branchrouter/removeBranch?branchId=${id}`, config)
                .then((res) => {
                    setSuccess(true);
                    getBranches();
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const handleEdit = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/fillUserDetails?userId=${data.userId}`, config)
            .then((res) => {
                setFormData(res.data);
                setIsEdit(true);
                setExpanded(true);
            })
    }
    const getDataSuppiler = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierAllBranchData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setSuppilers(res.data.rows);
                setTotalRowsSuppilers(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeSuppiler = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierAllBranchData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setSuppilers(res.data.rows);
                setTotalRowsSuppilers(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const resetAddFund = () => {
        setFormData({
            fromId: "",
            source: null,
            destination: null,
            toId: "",
            transactionAmount: 0,
            comment: "",
            transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
            transactionStatus: ''
        })
        setFormDataError({
            source: false,
            destination: false,
            transactionAmount: false,
            transactionDate: false,
        })
        setIsEdit(false)
    }
    // const submit = () => {
    //     if (loading || success) {

    //     } else {
    //         const isValidate = bankFields.filter(element => {
    //             if (bankError[element] === true || bank[element] === '' || bank[element] === 0) {
    //                 setBankError((perv) => ({
    //                     ...perv,
    //                     [element]: true
    //                 }))
    //                 return element;
    //             }
    //         })
    //         if (isValidate.length > 0) {
    //             setError(
    //                 "Please Fill All Field"
    //             )
    //         } else {
    //             // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
    //             addBank()
    //         }
    //     }
    // }
    const reset = () => {
        setFormData({
            userFirstName: '',
            userLastName: '',
            userGender: '',
            userName: '',
            password: '',
            emailId: '',
            userRights: ''
        });
        setFormDataError({
            userFirstName: false,
            userLastName: false,
            userGender: false,
            userName: false,
            password: false,
            emailId: false,
            userRights: false,
            branchId: false
        })
        setIsEdit(false);
    }
    const handleEditBranch = (id, name) => {
        setIsEdit(true);
        setOpen(true);
        setFormDataBranch({
            branchId: id,
            branchName: name
        })
        setFormDataErrorBranch({
            branchName: false
        })
    }
    const addUser = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/addUserDetailsByOwner`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                setFormData({
                    userFirstName: '',
                    userLastName: '',
                    userGender: '',
                    userName: '',
                    password: '',
                    emailId: '',
                    userRights: '',
                    branchId: ''
                });
                setFormDataError({
                    userFirstName: false,
                    userLastName: false,
                    userGender: false,
                    userName: false,
                    password: false,
                    emailId: false,
                    userRights: false,
                    branchId: false
                });
                getData();
                reset();
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addBranch = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}branchrouter/addBranch`, formDataBranch, config)
            .then((res) => {
                setLoading(false);
                getBranches();
                setSuccess(true);
                setFormDataBranch({
                    branchName: ''
                })
                setFormDataErrorBranch({
                    branchName: false
                })
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editBranch = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}branchrouter/updateBranch`, formDataBranch, config)
            .then((res) => {
                setLoading(false);
                getBranches();
                setOpen(false);
                setSuccess(true);
                setFormData({
                    branchName: ''
                })
                setFormDataError({
                    branchName: false
                })
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const submit = () => {
        if (loading || success) {

        } else {
            console.log('>>>>>>>>>>', formData)

            const isValidate = fields.filter(element => {
                if (element === 'emailId') {
                    return null
                } else if (formDataError[element] === true || formData[element] === '') {
                    setFormDataError((perv) => ({
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
                addUser()
            }
        }
    }

    const submitBranch = () => {
        if (loading || success) {

        } else {
            console.log('>>>>>>>>>>', formData)

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
                                            <div className='statusTabtext'>Branches</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                            setTab(2);
                                            getRights();
                                            setPage(0);
                                            setRowsPerPage(5);
                                            getData();
                                        }}>
                                            <div className='statusTabtext'>Users</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                            setTab(3);
                                            setPage(0);
                                            setRowsPerPage(5);
                                            getDataSuppiler();
                                            // getBranches();
                                        }}>
                                            <div className='statusTabtext'>Suppilers</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 4 || tab === '4' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                            setTab(4);
                                            // setPage(0);
                                            // setRowsPerPage(5);
                                            // getDataSuppiler();
                                            // getBranches();
                                        }}>
                                            <div className='statusTabtext'>Transactions</div>
                                        </div>
                                    </div>
                                </div>
                                {(tab === 1 || tab === '1') &&
                                    <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                        <div className='self-center justify-self-end'>
                                            <button className='addProductBtn' onClick={handleOpen}>Add Branch</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                (tab === 1 || tab === '1') &&
                <div className="cardWrp">
                    <div className="grid lg:grid-cols-3 mobile:grid-cols-1 tablet1:grid-cols-2 tablet:grid-cols-2 cardTablet:grid-cols-3 laptop:grid-cols-3 laptopDesk:grid-cols-4 desktop1:grid-cols-4 desktop2:grid-cols-5 desktop2:grid-cols-5 gap-6">
                        {
                            branch && branch.map((data, index) => (
                                // <BankCard goToBank={gotToBankDetail} data={data} name={data.bankDisplayName} imgName={data.bankIconName} />
                                <BranchCard goToBranch={goToBranch} deleteBranch={deleteBranch} editBranch={handleEditBranch} data={data} />
                            ))
                        }
                        {/* <ConsoleCard goToAddUSer={goToAddUSer} name={"Add User"} imgName={'userAdd'} />
                        <ConsoleCard goToAddUSer={goToUserList} name={"User List"} imgName={'userList'} />
                        <ConsoleCard goToAddUSer={goToExpense} name={"Expense"} imgName={'expense'} /> */}
                    </div>
                </div>
            }
            {
                (tab === 2 || tab === '2') &&
                <div className="grid grid-cols-12 productListContainer">
                    <div className="col-span-12">
                        <Accordion expanded={expanded} square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                            <AccordionSummary
                                sx={{ height: '60px', borderRadius: '0.75rem' }}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                onClick={() => { setExpanded(!expanded); resetAddFund(); }}
                            >
                                <div className='stockAccordinHeader'>Add User</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="stockInOutContainer">
                                    <div className='grid grid-cols-12 gap-6'>
                                        <div className="col-span-3">
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 2) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userFirstName: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userFirstName: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChange}
                                                value={formData && formData.userFirstName ? formData.userFirstName : ''}
                                                error={formDataError.userFirstName}
                                                helperText={formDataError.userFirstName ? "Please Enter First Name" : ''}
                                                name="userFirstName"
                                                id="outlined-required"
                                                label="First Name"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 2) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userLastName: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userLastName: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChange}
                                                value={formData && formData.userLastName ? formData.userLastName : ''}
                                                error={formDataError.userLastName}
                                                helperText={formDataError.userLastName ? "Please Enter Last Name" : ''}
                                                name="userLastName"
                                                id="outlined-required"
                                                label="Last Name"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <TextField
                                                onChange={onChange}
                                                value={formData && formData.emailId ? formData.emailId : ''}
                                                name="emailId"
                                                id="outlined-required"
                                                label="Email Id"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <FormControl>
                                                <FormLabel id="demo-row-radio-buttons-group-label" required error={formDataError.userGender}>Gender</FormLabel>
                                                <RadioGroup
                                                    onBlur={(e) => {
                                                        if (e.target.value.length < 2) {
                                                            setFormDataError((perv) => ({
                                                                ...perv,
                                                                userGender: true
                                                            }))
                                                        }
                                                        else {
                                                            setFormDataError((perv) => ({
                                                                ...perv,
                                                                userGender: false
                                                            }))
                                                        }
                                                    }}
                                                    row
                                                    required
                                                    onChange={(e) => {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userGender: false
                                                        }))
                                                        onChange(e)
                                                    }}
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    value={formData && formData.userGender ? formData.userGender : ''}
                                                    error={formDataError.userGender}
                                                    name="userGender"
                                                >
                                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="col-span-3">
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 2) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userName: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userName: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChange}
                                                value={formData && formData.userName ? formData.userName : ''}
                                                error={formDataError.userName}
                                                helperText={formDataError.userName ? "Please Enter First Name" : ''}
                                                name="userName"
                                                id="outlined-required"
                                                label="User Name"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 4) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            password: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            password: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChange}
                                                value={formData && formData.password ? formData.password : ''}
                                                error={formDataError.password}
                                                helperText={formDataError.password ? "Enter valid password (min 4 character)" : ''}
                                                name="password"
                                                id="outlined-required"
                                                label="Password"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <FormControl style={{ minWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" required error={formDataError.userRights}>User Role</InputLabel>
                                                <Select
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setFormDataError((perv) => ({
                                                                ...perv,
                                                                userRights: true
                                                            }))
                                                        }
                                                        else {
                                                            setFormDataError((perv) => ({
                                                                ...perv,
                                                                userRights: false
                                                            }))
                                                        }
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={formData && formData.userRights ? formData.userRights : ''}
                                                    error={formDataError.userRights}
                                                    name="userRights"
                                                    label="User Role"
                                                    onChange={onChange}
                                                >
                                                    {
                                                        rights ? rights.map((right) => (
                                                            <MenuItem key={right.rightsId} value={right.rightsId}>{right.rightsName}</MenuItem>
                                                        )) : <MenuItem key={''} value={''}>{ }</MenuItem>
                                                    }

                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="col-span-3">
                                            <FormControl style={{ minWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" required error={formDataError.branchId}>Branch</InputLabel>
                                                <Select
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setFormDataError((perv) => ({
                                                                ...perv,
                                                                branchId: true
                                                            }))
                                                        }
                                                        else {
                                                            setFormDataError((perv) => ({
                                                                ...perv,
                                                                branchId: false
                                                            }))
                                                        }
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={formData && formData.branchId ? formData.branchId : ''}
                                                    error={formDataError.branchId}
                                                    name="branchId"
                                                    label="Branch"
                                                    onChange={onChange}
                                                >
                                                    {
                                                        branch ? branch.map((data) => (
                                                            <MenuItem key={data.branchId} value={data.branchId}>{data.branchName}</MenuItem>
                                                        )) : <MenuItem key={''} value={''}>{''}</MenuItem>
                                                    }

                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='addUserBtnContainer grid mt-6 grid-rows-1'>
                                        <div className='grid grid-cols-12 gap-6'>
                                            <div className='col-start-7 col-span-3'>
                                                <button onClick={() => isEdit ? editUser() : submit()} className='saveBtn' >Save</button>
                                            </div>
                                            <div className='col-span-3'>
                                                <button onClick={() => reset()} className='resetBtn'>reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className="col-span-12">
                        <div className='grid grid-cols-12 mt-6'>
                            <div className='col-span-12'>
                                <div className='userTableSubContainer pt-4'>
                                    <div className='tableContainerWrapper'>
                                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>No.</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell align="left">Gender</TableCell>
                                                        <TableCell align="left">User Name</TableCell>
                                                        <TableCell align="left">Password</TableCell>
                                                        <TableCell align="left">Role</TableCell>
                                                        <TableCell align="left">email</TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.map((row, index) => (
                                                        totalRows !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.userFullName}
                                                                </TableCell>
                                                                <TableCell align="left" >{row.userGender}</TableCell>
                                                                <TableCell align="left" >{row.userName}</TableCell>
                                                                <TableCell align="left" >{row.password}</TableCell>
                                                                <TableCell align="left" >{row.rightsName}</TableCell>
                                                                <TableCell align="left" >{row.emailAddress}</TableCell>
                                                                <TableCell align="right">
                                                                    <Menutemp handleDelete={handleDeleteUser} data={row} handleEdit={handleEdit} />
                                                                </TableCell>
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>

                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={totalRows}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>

            }
            {(tab === 3 || tab === '3') &&
                <div className='grid grid-cols-12 productListContainer'>
                    <div className="col-span-12">
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='userTableSubContainer pt-4'>
                                    <div className='grid grid-cols-12'>
                                        <div className='col-span-3 col-start-1 pl-8'>
                                            <TextField
                                                className='sarchText'
                                                onChange={(e) => { onSearchChange(e); debounceFunction() }}
                                                value={searchWord}
                                                name="searchWord"
                                                id="searchWord"
                                                variant="standard"
                                                label="Search"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                                    style: { fontSize: 14 }
                                                }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-4 col-start-9 pr-8 flex justify-end'>
                                            <button className='exportExcelBtn' onClick={() => { navigate(`/addSuppiler`) }}>Add Suppiler</button>
                                        </div>
                                    </div>
                                    <div className='tableContainerWrapper'>
                                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>No.</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell align="left">Firm</TableCell>
                                                        <TableCell align="left">Suppiler Name</TableCell>
                                                        <TableCell align="left">Phone Number</TableCell>
                                                        {/* <TableCell align="left">Role</TableCell> */}
                                                        <TableCell align="left">Remaining Payment</TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {suppilers?.map((row, index) => (
                                                        totalRowsSuppilers !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.supplierId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" onClick={() => handleSuppilerOnClick(row.supplierId)} >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} component="th" scope="row">
                                                                    {row.supplierNickName}
                                                                </TableCell>
                                                                <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{row.supplierFirmName}</TableCell>
                                                                <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{row.supplierName}</TableCell>
                                                                <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{row.supplierPhoneNumber}</TableCell>
                                                                {/* <TableCell align="left" >{row.rightsName}</TableCell> */}
                                                                <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{parseFloat(row.remainingAmount ? row.remainingAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                                <TableCell align="right">
                                                                    <MenuSuppiler supplierId={row.supplierId} handleOpen={handleOpenPayment} data={row} deleteSuppiler={handleDeleteSuppiler} />
                                                                </TableCell>
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={totalRows}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            }
            {
                (tab === 4 || tab === '4') && <TransactionTableCommon />
            }
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
                                            branchName: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorBranch((perv) => ({
                                            ...perv,
                                            branchName: false
                                        }))
                                    }
                                }}
                                onChange={onChangeBranch}
                                value={formDataBranch.branchName ? formDataBranch.branchName : ''}
                                error={formDataErrorBranch.branchName}
                                inputRef={textFieldRef}
                                helperText={formDataErrorBranch.branchName ? "Please Enter Product Name" : ''}
                                name="branchName"
                                id="outlined-required"
                                label="Branch Name"
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
                                setFormData({
                                    branchName: ''
                                });
                                setFormDataError({
                                    branchName: false
                                })
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openPayment}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>Make Payment to : </span><span className='makePaymentName'>{formDataPayment.supplierFirmName}</span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 2) {
                                        setFormDataErrorPayment((perv) => ({
                                            ...perv,
                                            receivedBy: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorPayment((perv) => ({
                                            ...perv,
                                            receivedBy: false
                                        }))
                                    }
                                }}
                                disabled={formDataPayment.remainingAmount == 0}
                                value={formDataPayment.receivedBy}
                                error={formDataErrorPayment.receivedBy}
                                helperText={formDataErrorPayment.receivedBy ? 'Enter Reciver Name' : ''}
                                name="receivedBy"
                                id="outlined-required"
                                label="Received By"
                                onChange={onChangePayment}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={formDataErrorPayment.branchId}>Branch</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formDataPayment.branchId ? formDataPayment.branchId : ''}
                                    error={formDataErrorPayment.branchId}
                                    name="branchId"
                                    label="Branch"
                                    disabled={!formDataPayment.receivedBy}
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataErrorPayment((perv) => ({
                                                ...perv,
                                                branchId: true
                                            }))
                                        }
                                        else {
                                            setFormDataErrorPayment((perv) => ({
                                                ...perv,
                                                branchId: false
                                            }))
                                        }
                                    }}
                                    onChange={onChangePaymentBranch}
                                >
                                    {
                                        branchDdl ? branchDdl?.map((data) => (
                                            <MenuItem key={data.branchId} value={data.branchId}>{data.branchName}</MenuItem>
                                        )) :
                                            <MenuItem key={''} value={''}>{''}</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataErrorPayment((perv) => ({
                                            ...perv,
                                            paidAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorPayment((perv) => ({
                                            ...perv,
                                            paidAmount: false
                                        }))
                                    }
                                }}
                                disabled={formDataPayment.remainingAmount == 0}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChangePayment}
                                value={formDataPayment.paidAmount}
                                error={formDataErrorPayment.paidAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                helperText={`Remaining Payment ${formDataPayment.remainingAmount}`}
                                name="paidAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                disabled={formDataPayment.remainingAmount == 0}
                                onChange={onChangePayment}
                                value={formDataPayment.transactionNote}
                                name="transactionNote"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitPayment()
                            }}>Make Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default BranchDashboard;