// import ConsoleCard from "./component/consoleCard/consoleCard";
import './billingBranchDashboard.css';
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
import { BACKEND_BASE_URL } from '../../../url';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { ToastContainer, toast } from 'react-toastify';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import jwt_decode from 'jwt-decode';
import Menutemp from '../../branschDashboard/menuUser';
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
import BranchCard from '../../branschDashboard/branchCard/branchCard';
import MenuSupplier from '../../branschDashboard/menuSupplier';
import TransactionTableCommon from '../../branschDashboard/transaction/transactionTable';
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
function BillingBranchDashboard() {
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
    const [totalRowsSuppliers, setTotalRowsSuppliers] = React.useState(0);
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
    const [suppliers, setSuppliers] = React.useState();
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
                getDataSupplier();
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
                setSuppliers(res.data.rows);
                setTotalRowsSuppliers(res.data.numRows);
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
                    setError(error.response ? error.response.data : "Network Error ...!!!")
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
                setError(error.response ? error.response.data : "Network Error ...!!!")
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
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tab === 2 || tab === '2') {
            getDataOnPageChange(newPage + 1, rowsPerPage)
        } else {
            getDataOnPageChangeSupplier(newPage + 1, rowsPerPage)
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === 2 || tab === '2') {
            getDataOnPageChange(1, parseInt(event.target.value, 10))
        }
        else {
            getDataOnPageChangeSupplier(1, parseInt(event.target.value, 10))
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
            }).catch((error) => {
                setError("Error No Data...!!!")
            })
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
            }).catch((error) => {
                setError("Error No Data...!!!")
            })
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
            }).catch((error) => {
                setError("Error No Data...!!!")
            })
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
            }).catch((error) => {
                setError("Error No Data...!!!")
            })
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
    const deleteDataSupplier = async (id) => {
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
    const handleDeleteSupplier = async (id) => {
        const password = window.prompt("Are you sure you want to delete supplier ?... Enter Password to delete")
        if (password) {
            await axios.post(`${BACKEND_BASE_URL}userrouter/chkPassword`, { "userPassword": password }, config)
                .then(async (res) => {
                    deleteDataSupplier(id);
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
        // if (window.confirm("Are you sure you want to delete User?")) {

        //     setTimeout(() => {
        //         getData()
        //     }, 1000)
        // }
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
    const handleSupplierOnClick = (id) => {
        navigate(`/supplierDetailsOwner/${id}`)
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
                navigate('/billingDashboard');
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const deleteBranch = async (id) => {
        const password = window.prompt("If you delete this Branch the all Data in Branch will be deleted... Enter Password to delete")
        if (password) {
            await axios.post(`${BACKEND_BASE_URL}userrouter/chkPassword`, { "userPassword": password }, config)
                .then(async (res) => {
                    await axios.delete(`${BACKEND_BASE_URL}branchrouter/removeBranch?branchId=${id}`, config)
                        .then((res) => {
                            setSuccess(true);
                            getBranches();
                        })
                        .catch((error) => {
                            setError(error.response ? error.response.data : "Network Error ...!!!")
                        })
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
        // const password = window.prompt("If you delete this Branch the all Data in Branch will be deleted... Enter Password to delete")
        // if (password) {
        //     await axios.post(`${BACKEND_BASE_URL}userrouter/chkPassword`, { "userPassword": password }, config)
        //         .then(async (res) => {
        //         })
        //         .catch((error) => {
        //             setError(error.response ? error.response.data : "Network Error ...!!!")
        //         })
        // }
    }
    const handleEdit = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/fillUserDetails?userId=${data.userId}`, config)
            .then((res) => {
                setFormData(res.data);
                setIsEdit(true);
                setExpanded(true);
            })
    }
    const getDataSupplier = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierAllBranchData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setSuppliers(res.data.rows);
                setTotalRowsSuppliers(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeSupplier = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierAllBranchData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setSuppliers(res.data.rows);
                setTotalRowsSuppliers(res.data.numRows);
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
            <div className="cardWrp">
                <div className="grid lg:grid-cols-3 mobile:grid-cols-1 tablet1:grid-cols-2 tablet:grid-cols-2 cardTablet:grid-cols-3 laptop:grid-cols-3 laptopDesk:grid-cols-4 desktop1:grid-cols-4 desktop2:grid-cols-5 desktop2:grid-cols-5 gap-6">
                    {
                        branch && branch.map((data, index) => (
                            <BranchCard goToBranch={goToBranch} deleteBranch={deleteBranch} editBranch={handleEditBranch} data={data} />
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
                                setFormDataBranch({
                                    branchName: ''
                                });
                                setFormDataErrorBranch({
                                    branchName: false
                                })
                                setIsEdit(false)
                            }}>Cancel</button>
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
                            }}>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default BillingBranchDashboard;