import './stockInOutMaterial.css';
import * as React from "react";
import { useRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Box from '@mui/material/Box';
import ExportMenu from '../materialListTable/exportMenu';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuStockInOut from './menu';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const qtyUnit = [
    'Kg',
    'Gm',
    'Ltr',
    'Mtr',
    'Pkts',
    'BOX',
    'ML',
    'Qty',
    'Piece',
    'Num'
]

function StockInOutMaterial() {
    const regex = /^\d*(?:\.\d*)?$/;
    const navigate = useNavigate();
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [expanded, setExpanded] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [supplier, setSupplierList] = React.useState();
    const [filter, setFilter] = React.useState(false);
    const [unitsForProduct, setUnitsForProduct] = React.useState(0);
    const [stockInData, setStockInData] = React.useState();
    const [stockOutData, setStockOutData] = React.useState();
    const [categories, setCategories] = React.useState();
    const [productList, setProductList] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tab, setTab] = React.useState(1);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const textFieldRef = useRef(null);
    const [ddlBranch, setddlBranch] = React.useState();

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const resetStockInEdit = () => {
        setStockInFormData({
            rawMaterialId: "",
            rawMaterialName: null,
            rawMaterialQty: "",
            rawMaterialUnit: "",
            productPrice: "",
            totalPrice: "",
            billNumber: "",
            rmSupplierId: "",
            rmStockInPaymentMethod: 'cash',
            rmStockInComment: "",
            rmStockInDate: dayjs()
        });
        setStockInFormDataError({
            rawMaterialQty: false,
            rawMaterialName: false,
            rawMaterialUnit: false,
            productPrice: false,
            totalPrice: false,
            rmSupplierId: false,
            rmStockInPaymentMethod: false,
            rmStockInDate: false
        })
        setIsEdit(false)
    }
    const resetStockOutEdit = () => {
        setStockOutFormData({
            rawMaterialId: "",
            rawMaterialQty: "",
            rawMaterialUnit: "",
            rmStockOutCategory: 'Regular',
            rmStockOutComment: "",
            rmStockOutDate: dayjs()
        });
        setStockOutFormDataError({
            rawMaterialQty: false,
            rawMaterialUnit: false,
            rmStockOutCategory: false,
            rmStockOutDate: false
        })
        setIsEdit(false)
    }

    const fillStockInEdit = async (id, isFullEdit) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/fillRawMaterialStockInTransaction?rmStockInId=${id}`, config)
            .then((res) => {
                setStockInFormData((perv) => ({
                    ...perv,
                    rmStockInId: id,
                    rawMaterialId: res.data.rawMaterialId,
                    rawMaterialName: res.data.rawMaterialName,
                    rawMaterialQty: parseFloat(res.data.rawMaterialQty),
                    rawMaterialUnit: res.data.rawMaterialUnit,
                    productPrice: res.data.productPrice,
                    totalPrice: res.data.totalPrice,
                    billNumber: res.data.billNumber,
                    rmSupplierId: res.data.rmSupplierId,
                    rmStockInPaymentMethod: res.data.rmStockInPaymentMethod,
                    rmStockInComment: res.data.rmStockInComment,
                    rmStockInDate: dayjs(res.data.rmStockInDate),
                    isFullEdit: isFullEdit
                }))
                getSupplierList(res.data.rawMaterialId);
                getUnitForProduct(res.data.rawMaterialId);
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const fillStockOutEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/fillRmStockOutTransaction?rmStockOutId=${id}`, config)
            .then((res) => {
                setStockOutFormData((perv) => ({
                    ...perv,
                    rmStockOutId: id,
                    rawMaterialName: res.data.rawMaterialName,
                    rawMaterialId: res.data.rawMaterialId,
                    remainingStock: res.data.remainingStock,
                    rawMaterialQty: res.data.rawMaterialQty,
                    rawMaterialUnit: res.data.rawMaterialUnit,
                    rmStockOutCategory: res.data.rmStockOutCategory,
                    rmStockOutComment: res.data.rmStockOutComment,
                    rmStockOutDate: dayjs(res.data.rmStockOutDate),
                    branchId: res.data.branchId,
                    oldBranchName: res.data.branchName,
                }))
                getUnitForProduct(res.data.rawMaterialId);
                getCategoryList(res.data.rmStockOutCategory == 'Branch' ? true : false)
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getUnitForProduct = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRmUnitById?rawMaterialId=${id}`, config)
            .then((res) => {
                setUnitsForProduct(res.data);
                setStockInFormDataError((perv) => ({
                    ...perv,
                    rawMaterialUnit: false
                }))
                setStockOutFormDataError((perv) => ({
                    ...perv,
                    rawMaterialUnit: false
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleAccordionOpenOnEdit = (data, isFullEdit) => {
        console.log('edit', data)
        if (tab === 1 || tab === '1') {
            fillStockInEdit(data, isFullEdit);
        }
        else {
            fillStockOutEdit(data)
        }
        setIsEdit(true)
        setExpanded(true)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [stockInFormData, setStockInFormData] = React.useState({
        rawMaterialId: "",
        rawMaterialName: null,
        rawMaterialQty: "",
        rawMaterialUnit: "",
        productPrice: "",
        totalPrice: "",
        billNumber: "",
        rmSupplierId: "",
        rmStockInPaymentMethod: 'cash',
        rmStockInComment: "",
        rmStockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        rawMaterialQty: false,
        rawMaterialName: false,
        rawMaterialUnit: false,
        totalPrice: false,
        rmSupplierId: false,
        rmStockInPaymentMethod: false,
        rmStockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'rawMaterialQty',
        'rawMaterialName',
        'rawMaterialUnit',
        'totalPrice',
        'rmSupplierId',
        'rmStockInPaymentMethod',
        'rmStockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        rawMaterialId: "",
        rawMaterialQty: "",
        rawMaterialUnit: "",
        rmStockOutCategory: 'Regular',
        rmStockOutComment: "",
        reason: "",
        rmStockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        rawMaterialQty: false,
        rawMaterialUnit: false,
        rmStockOutCategory: false,
        reason: false,
        rmStockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'rawMaterialQty',
        'rawMaterialUnit',
        'rmStockOutCategory',
        'rmStockOutDate',
        'reason'
    ])
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const getCategoryList = async (isSupplyBranch) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRmStockOutCategory`, config)
            .then((res) => {
                setCategories(isSupplyBranch ? res.data : res.data.filter((ddl) => {
                    if (ddl.stockOutCategoryId != 'Branch') {
                        return ddl
                    }
                }));
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRawMaterial`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                setProductList(null)
            })
    }

    const getSupplierList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/rawMaterialWiseSupplierDDL?rawMaterialId=${id}`, config)
            .then((res) => {
                setSupplierList(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const stockIn = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRawMaterialStockInDetails`, stockInFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                // getData();
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false)
                getProductList();
                getStockInData()
                handleResetStockIn();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const stockInEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/updateRawMaterialStockInTransaction`, stockInFormData, config)
            .then((res) => {
                setSuccess(true);
                // getData();
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false)
                setExpanded(false)
                getStockInData()
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const onChangeStockIn = (e) => {
        // if (e.target.name === 'productPrice' && stockInFormData.rawMaterialQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         productPrice: e.target.value,
        //         totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.rawMaterialQty)).toFixed(2).toString()

        //     }))
        //     if (parseFloat(e.target.value) > 0) {
        //         setStockInFormDataError((perv) => ({
        //             ...perv,
        //             totalPrice: false,
        //             productPrice: false
        //         }))
        //     }
        // } else if (e.target.name === 'totalPrice' && stockInFormData.rawMaterialQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         totalPrice: e.target.value,
        //         productPrice: (parseFloat(e.target.value) / parseFloat(stockInFormData.rawMaterialQty)).toFixed(2).toString()
        //     }))
        //     if (parseFloat(e.target.value) > 0) {
        //         setStockInFormDataError((perv) => ({
        //             ...perv,
        //             totalPrice: false,
        //             productPrice: false
        //         }))
        //     }
        // }
        // else if (e.target.name === 'rawMaterialQty' && stockInFormData.productPrice > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         rawMaterialQty: e.target.value,
        //         totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productPrice)).toString()

        //     }))
        // }
        // else {
        // }
        setStockInFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

        console.log('formddds', stockInFormData)
    }
    const handleStockInDate = (date) => {
        console.log("stockIn", date, date && date['$d'] ? date['$d'] : null)
        setStockInFormData((prevState) => ({
            ...prevState,
            ["rmStockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["rmStockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const submitStockIn = () => {
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'rmStockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.rmStockInDate == 'Invalid Date') {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockInFormDataError[element] === true || stockInFormData[element] === '' || stockInFormData[element] === 0) {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                console.log('stockInError', isValidate, stockInFormData)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockIn()
            }
        }
    }
    const editStockIn = () => {
        const isValidate = stockInErrorFields.filter(element => {
            if (element === 'rmStockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.rmStockInDate == 'Invalid Date') {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
            else if (stockInFormDataError[element] === true || stockInFormData[element] === '' || stockInFormData[element] === 0) {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
        })
        if (isValidate.length > 0) {
            setError(
                "Please Fill All Field"
            )
        } else {
            stockInEdit()
        }
    }
    const getDDLBranchList = async () => {
        await axios.get(`${BACKEND_BASE_URL}branchrouter/getBranchList`, config)
            .then((res) => {
                setddlBranch(res.data);
            })
            .catch((error) => {
                setddlBranch(['No Data'])
            })
    }
    const handlerawMaterialNameAutoComplete = (event, value) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ['rawMaterialName']: value,
            rawMaterialId: value && value.rawMaterialId ? value.rawMaterialId : '',
            rmSupplierId: '',
            rawMaterialUnit: value && value.rawMaterialUnit ? value.rawMaterialUnit : ''
        }))
        setStockInFormDataError((prevState) => ({
            ...prevState,
            rawMaterialName: value && value.rawMaterialId ? false : true
        }))
        value && value.rawMaterialId && getSupplierList(value.rawMaterialId);
        value && value.rawMaterialId && getUnitForProduct(value.rawMaterialId);
        // console.log('formddds', stockInFormData)
    }
    const handlerawMaterialNameAutoCompleteOut = (event, value) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ['rawMaterialName']: value,
            rawMaterialId: value && value.rawMaterialId ? value.rawMaterialId : '',
            rawMaterialUnit: value && value.rawMaterialUnit ? value.rawMaterialUnit : '',
            remainingStock: value && value.remainingStock ? value.remainingStock : 0,
            isSupplyBranch: value && value.isSupplyBranch ? value.isSupplyBranch : '',
            rmStockOutCategory: value && value.isSupplyBranch ? stockOutFormData.rmStockOutCategory : 'Regular',
            remainingStockArray: value && value.allConversation ? value.allConversation : [],
        }))
        setStockOutFormDataError((prevState) => ({
            ...prevState,
            rawMaterialName: value && value.rawMaterialId ? false : true
        }))
        value && value.rawMaterialId && getUnitForProduct(value.rawMaterialId);
        value && value.rawMaterialId && getCategoryList(value.isSupplyBranch);
        console.log('formddds', stockInFormData)
    }
    const handleResetStockIn = () => {
        setStockInFormData({
            rawMaterialName: null,
            rawMaterialId: "",
            rawMaterialQty: "",
            rawMaterialUnit: "",
            productPrice: "",
            totalPrice: "",
            billNumber: "",
            rmSupplierId: "",
            rmStockInPaymentMethod: 'cash',
            rmStockInComment: "",
            rmStockInDate: dayjs()
        })
        setStockInFormDataError({
            rawMaterialQty: false,
            rawMaterialUnit: false,
            rawMaterialName: false,
            productPrice: false,
            totalPrice: false,
            rmSupplierId: false,
            rmStockInPaymentMethod: false,
            rmStockInDate: false
        })
    }
    const handleResetStockOut = () => {
        setStockOutFormData({
            rawMaterialId: "",
            rawMaterialName: null,
            rawMaterialQty: "",
            rawMaterialUnit: "",
            rmStockOutCategory: 'Regular',
            rmStockOutComment: "",
            rmStockOutDate: dayjs(),
            reason: ''
        })
        setStockOutFormDataError({
            rawMaterialQty: false,
            rawMaterialName: false,
            rawMaterialUnit: false,
            rmStockOutCategory: false,
            rmStockInDate: false,
            reason: false
        })
    }
    const onChangeStockOut = (e) => {
        // if (e.target.name === 'rawMaterialQty') {
        //     if (e.target.value > stockOutFormData?.remainingStock) {
        //         setStockOutFormDataError((perv) => ({
        //             ...perv,
        //             [e.target.name]: true
        //         }))
        //     }
        //     else {
        //         setStockOutFormDataError((perv) => ({
        //             ...perv,
        //             [e.target.name]: false
        //         }))
        //     }
        //     setStockOutFormData((prevState) => ({
        //         ...prevState,
        //         [e.target.name]: e.target.value,
        //     }))
        // } else {
        setStockOutFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
        // }
    }

    const stockOut = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRmStockOutDetails`, stockOutFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                // getData();
                // setTab(null)
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false);
                getProductList();
                getStockOutData();
                handleResetStockOut();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const stockOutEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/updateRmStockOutTransaction`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true);
                // getData();
                // setTab(null)
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false);
                setExpanded(false);
                getStockOutData();
                handleResetStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const submitStockOut = () => {
        if (loading || success) {

        } else {
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'reason') {
                    if (isEdit && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormDataError['reason'] === true) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            reason: true
                        }))
                        return element;
                    }
                }
                else if (element === 'rmStockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.rmStockOutDate == 'Invalid Date') {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockOutFormDataError[element] === true || stockOutFormData[element] === '' || stockOutFormData[element] === 0) {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOut()
            }
        }
    }

    const editSubmitStockOut = () => {
        if (loading || success) {

        } else {
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'rmStockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.rmStockOutDate == 'Invalid Date') {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockOutFormDataError[element] === true || stockOutFormData[element] === '' || stockOutFormData[element] === 0) {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOutEdit()
            }
        }
    }

    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?&page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutEditDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getUpdateRmStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutEditdData = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getUpdateRmStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (tab === 2 || tab === '2') {
            if (filter) {
                getStockOutDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockOutDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else if (tab === 3 || tab === '3') {
            getStockOutEditDataOnPageChange(newPage + 1, rowsPerPage)
        } else {
            if (filter) {
                getStockInDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockInDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === '1' || tab === 1) {
            if (filter) {
                getStockInDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockInDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else if (tab === 3 || tab === '3') {
            getStockOutEditDataOnPageChange(1, parseInt(event.target.value, 10))
        } else {
            if (filter) {
                getStockOutDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockOutDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const stockOutExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRmStockoutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRmStockoutList?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'StockOut_' + new Date().toLocaleDateString() + '.xlsx'
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

    const stockOutExportPdf = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRmStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRmStockOutList?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'StockOut_Pdf' + new Date().toLocaleDateString() + '.pdf'
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
    const stockInExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRawMaterialStockInList?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'StockIn_' + new Date().toLocaleDateString() + '.xlsx'
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
    const stockInExportPdf = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRawMaterialStockInList?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'StockIn_Pdf' + new Date().toLocaleDateString() + '.pdf'
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

    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}rawMaterialrouter/removeRawMaterialStockInTransaction?rmStockInId=${id}`, config)
            .then((res) => {
                setSuccess(true);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteStockIn = (id) => {
        if (window.confirm("Are you sure you want to delete Stock In?")) {
            deleteStockIn(id);
            setTimeout(() => {
                getStockInData();
            }, 1000)
        }
    }
    const deleteStockOut = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}rawMaterialrouter/removeRmStockOutTransaction?rmStockOutId=${id}`, config)
            .then((res) => {
                setSuccess(true);
                getProductList();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteStockOut = (id) => {
        if (window.confirm("Are you sure you want to delete Stock Out?")) {
            deleteStockOut(id);
            setTimeout(() => {
                getStockOutData();
            }, 1000)
        }
    }
    const deleteData = async () => {
        if (window.confirm('Are you sure you want to delete all edit history ....!')) {
            await axios.delete(`${BACKEND_BASE_URL}rawMaterialrouter/emptyModifiedHistoryOfStockOut`, config)
                .then((res) => {
                    setPage(0);
                    setSuccess(true)
                    setRowsPerPage(5);
                    getStockOutEditdData();
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const gotohistory = (id) => {
        navigate(`/material/editHistory/${id}`)
    }
    useEffect(() => {
        getCategoryList();
        getProductList();
        getDDLBranchList();
        getStockInData();
        // getCountData();
    }, [])
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
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
        }, 50)
    }
    if (error) {
        toast.dismiss('loading');
        setLoading(false)
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
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                        setTab(1); setPage(0); setRowsPerPage(5); getStockInData(); setFilter(false);
                                        resetStockOutEdit();
                                        getProductList();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Stock-In</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                        setTab(2); setPage(0); setRowsPerPage(5); getStockOutData(); setFilter(false);
                                        resetStockInEdit();
                                        getProductList();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Stock-Out</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTab(3); setStockOutData(); setPage(0); setRowsPerPage(5); setFilter(false);
                                        setExpanded(false);
                                        getStockOutEditdData();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Edited Stock-Out</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {tab === 3 ?
                null : <div className='mt-6 grid grid-col-12'>
                    <Accordion expanded={expanded} square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                        <AccordionSummary
                            sx={{ height: '60px', borderRadius: '0.75rem' }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            onClick={() => { setExpanded(!expanded); resetStockInEdit(); resetStockOutEdit(); }}
                        >
                            <div className='grid grid-cols-12 pr-2' style={{ width: '100%' }}>
                                <div className='col-span-3 stockAccordinHeader'>
                                    {tab && tab === '1' || tab === 1 ? "Stock In" : "Stock Out"}
                                </div>
                                {(tab && tab === '2' || tab === 2) && expanded && stockOutFormData.rawMaterialName ?
                                    <div className='col-span-8 flex justify-end'>
                                        <Typography id="modal-modal" variant="h6" component="h2">
                                            Remaining Stock :- {stockOutFormData.remainingStock ? stockOutFormData.remainingStock : ''}
                                        </Typography>
                                    </div>
                                    : <></>
                                }
                            </div>
                            {/* <div className='stockAccordinHeader'>{tab && tab === '1' || tab === 1 ? "Stock In" : "Stock Out"}</div> */}
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='stockInOutContainer'>
                                {tab === '2' || tab === 2 && expanded && stockOutFormData.rawMaterialName ? <>
                                    <hr className='mb-3' />
                                    <div className='grid gap-6 grid-cols-12'>
                                        {
                                            stockOutFormData.remainingStockArray ? stockOutFormData.remainingStockArray?.map((row, index) => (
                                                <div className='col-span-2 unitName'>
                                                    {row.unitName} : {row.value}
                                                </div>
                                            )) : <></>
                                        }
                                    </div>
                                    <hr className='mt-3 mb-8' />
                                </>
                                    : <></>
                                }
                                {tab === '1' || tab === 1 ?
                                    <div className='mt-6 grid grid-cols-12 gap-6'>
                                        <div className='col-span-3'>
                                            {!isEdit ?
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        defaultValue={null}
                                                        id='stockIn'
                                                        disablePortal
                                                        sx={{ width: '100%' }}
                                                        disabled={isEdit}
                                                        value={stockInFormData.rawMaterialName ? stockInFormData.rawMaterialName : null}
                                                        onChange={handlerawMaterialNameAutoComplete}
                                                        options={productList ? productList : []}
                                                        getOptionLabel={(options) => options.rawMaterialName}
                                                        renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Product Name" />}
                                                    />
                                                </FormControl>
                                                :
                                                <TextField
                                                    label="Product Name"
                                                    fullWidth
                                                    disabled
                                                    value={stockInFormData.rawMaterialName ? stockInFormData.rawMaterialName : ''}
                                                    name="rawMaterialName"
                                                />}
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value < 0) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            rawMaterialQty: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            rawMaterialQty: false
                                                        }))
                                                    }
                                                }}
                                                type="number"
                                                label="Qty"
                                                fullWidth
                                                onChange={(e) => {
                                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                        onChangeStockIn(e)
                                                    }
                                                }}
                                                disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                                value={stockInFormData.rawMaterialQty}
                                                error={stockInFormDataError.rawMaterialQty}
                                                helperText={stockInFormDataError.rawMaterialQty ? "Enter Qty" : ''}
                                                name="rawMaterialQty"
                                            // InputProps={{
                                            //     endAdornment: <InputAdornment position="end">{stockInFormData.rawMaterialUnit}</InputAdornment>,
                                            // }}
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.rawMaterialUnit}>StockIn Unit</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={stockInFormData.rawMaterialUnit ? stockInFormData.rawMaterialUnit : ''}
                                                    error={stockInFormDataError.rawMaterialUnit}
                                                    name="rawMaterialUnit"
                                                    label="StockIn Unit"
                                                    disabled={!stockInFormData.rawMaterialName}
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                rawMaterialUnit: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                rawMaterialUnit: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockIn}
                                                >
                                                    {
                                                        unitsForProduct ? unitsForProduct?.map((data) => (
                                                            <MenuItem key={data.priorityNum} value={data.unitName}>{data.unitName}</MenuItem>
                                                        )) :
                                                            <MenuItem key={''} value={''}>{''}</MenuItem>
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value < 0) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            totalPrice: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            totalPrice: false
                                                        }))
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    // console.log('regex', regex, e.target.value, regex.test(e.target.value))
                                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                        onChangeStockIn(e)
                                                    }
                                                }}
                                                value={stockInFormData.totalPrice === 'NaN' ? "" : stockInFormData.totalPrice}
                                                error={stockInFormDataError.totalPrice}
                                                helperText={stockInFormDataError.totalPrice ? "Total Price" : ''}
                                                name="totalPrice"
                                                id="outlined-required"
                                                label="Total Price"
                                                disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <TextField
                                                onChange={onChangeStockIn}
                                                value={stockInFormData.billNumber}
                                                name="billNumber"
                                                id="outlined-required"
                                                label="Bill Number"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" required error={stockInFormDataError.rmSupplierId}>Supplier</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={stockInFormData.rmSupplierId}
                                                    error={stockInFormDataError.rmSupplierId}
                                                    disabled={stockInFormData.rawMaterialId ? false : true}
                                                    name="rmSupplierId"
                                                    label="Supplier"
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                rmSupplierId: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                rmSupplierId: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockIn}
                                                >
                                                    {
                                                        supplier ? supplier.map((supplierData) => (
                                                            <MenuItem key={supplierData.rmSupplierId} value={supplierData.rmSupplierId}>{supplierData.supplierNickName}</MenuItem>
                                                        )) : null
                                                    }

                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-span-2'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.rmStockInPaymentMethod}>Payment</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={stockInFormData.rmStockInPaymentMethod}
                                                    error={stockInFormDataError.rmStockInPaymentMethod}
                                                    name="rmStockInPaymentMethod"
                                                    label="Payment"
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                rmStockInPaymentMethod: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                rmStockInPaymentMethod: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockIn}
                                                >
                                                    <MenuItem key={'cash'} value={'cash'}>{'Cash'}</MenuItem>
                                                    <MenuItem key={'debit'} value={'debit'}>{'Debit'}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-span-2'>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    textFieldStyle={{ width: '100%' }}
                                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    label="Stock In Date"
                                                    format="DD/MM/YYYY"
                                                    required
                                                    error={stockInFormDataError.rmStockInDate}
                                                    value={stockInFormData.rmStockInDate}
                                                    onChange={handleStockInDate}
                                                    name="rmStockInDate"
                                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className='col-span-5'>
                                            <TextField
                                                onChange={onChangeStockIn}
                                                value={stockInFormData.rmStockInComment}
                                                name="rmStockInComment"
                                                id="outlined-required"
                                                label="Comment"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-2 col-start-9'>
                                            <button className='addCategorySaveBtn' onClick={() => {
                                                isEdit ? editStockIn() : submitStockIn()
                                            }}>{isEdit ? "Save" : "Stock In"}</button>
                                        </div>
                                        <div className='col-span-2'>
                                            <button className='addCategoryCancleBtn' onClick={() => {
                                                handleResetStockIn();
                                                setIsEdit(false);
                                                { isEdit && setExpanded(false); }
                                            }}>{isEdit ? 'Cancel' : 'Reset'}</button>
                                        </div>
                                    </div>
                                    :
                                    <div className='mt-6 grid grid-cols-12 gap-6'>
                                        <div className='col-span-3'>
                                            {!isEdit ?
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        disablePortal
                                                        defaultValue={null}
                                                        id='stockOut'
                                                        disabled={isEdit}
                                                        sx={{ width: '100%' }}
                                                        value={stockOutFormData.rawMaterialName ? stockOutFormData.rawMaterialName : null}
                                                        onChange={handlerawMaterialNameAutoCompleteOut}
                                                        options={productList ? productList : []}
                                                        getOptionLabel={(options) => options.rawMaterialName}
                                                        renderInput={(params) => <TextField {...params} inputRef={textFieldRef} label="Product Name" />}
                                                    />
                                                </FormControl>
                                                :
                                                <TextField
                                                    label="Product Name"
                                                    fullWidth
                                                    disabled
                                                    value={stockOutFormData.rawMaterialName ? stockOutFormData.rawMaterialName : ''}
                                                    name="rawMaterialName"
                                                />
                                            }
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                // onBlur={(e) => {
                                                //     if (e.target.value < 0 || e.target.value > stockOutFormData?.remainingStock) {
                                                //         setStockOutFormDataError((perv) => ({
                                                //             ...perv,
                                                //             rawMaterialQty: true
                                                //         }))
                                                //     }
                                                //     else {
                                                //         setStockOutFormDataError((perv) => ({
                                                //             ...perv,
                                                //             rawMaterialQty: false
                                                //         }))
                                                //     }
                                                // }}
                                                type="number"
                                                label="Qty"
                                                fullWidth
                                                disabled={!stockOutFormData.rawMaterialName}
                                                onChange={onChangeStockOut}
                                                value={stockOutFormData.rawMaterialQty}
                                                error={stockOutFormDataError.rawMaterialQty}
                                                helperText={stockOutFormDataError.rawMaterialQty ? "Please Enter Qty" : ''}
                                                name="rawMaterialQty"
                                            // InputProps={{
                                            //     endAdornment: <InputAdornment position="end">{stockOutFormData.rawMaterialUnit}</InputAdornment>,
                                            // }}
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" error={stockOutFormDataError.rawMaterialUnit}>StockIn Unit</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={stockOutFormData.rawMaterialUnit ? stockOutFormData.rawMaterialUnit : ''}
                                                    error={stockOutFormDataError.rawMaterialUnit}
                                                    name="rawMaterialUnit"
                                                    label="StockOut Unit"
                                                    disabled={!stockOutFormData.rawMaterialName}
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockOutFormDataError((perv) => ({
                                                                ...perv,
                                                                rawMaterialUnit: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockOutFormDataError((perv) => ({
                                                                ...perv,
                                                                rawMaterialUnit: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockOut}
                                                >
                                                    {
                                                        unitsForProduct ? unitsForProduct?.map((data) => (
                                                            <MenuItem key={data.priorityNum} value={data.unitName}>{data.unitName}</MenuItem>
                                                        )) :
                                                            <MenuItem key={''} value={''}>{''}</MenuItem>
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-span-3'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.rmStockOutCategory}>Category</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    defaultValue={null}
                                                    disabled={!stockOutFormData.rawMaterialName || isEdit}
                                                    value={stockOutFormData.rmStockOutCategory ? stockOutFormData.rmStockOutCategory : ''}
                                                    error={stockOutFormDataError.rmStockOutCategory}
                                                    name="rmStockOutCategory"
                                                    label="Category"
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockOutFormDataError((perv) => ({
                                                                ...perv,
                                                                rmStockOutCategory: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockOutFormDataError((perv) => ({
                                                                ...perv,
                                                                rmStockOutCategory: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockOut}
                                                >
                                                    {
                                                        categories ? categories.map((category) => (
                                                            <MenuItem key={category.stockOutCategoryId} value={category.stockOutCategoryId}>{category.stockOutCategoryName}</MenuItem>
                                                        )) : null
                                                    }

                                                </Select>
                                            </FormControl>
                                        </div>
                                        {
                                            stockOutFormData.rmStockOutCategory == 'Branch' ?
                                                <>
                                                    <div className='col-span-3'>
                                                        <FormControl style={{ minWidth: '100%' }}>
                                                            <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.branchId}>Branches</InputLabel>
                                                            <Select
                                                                onBlur={(e) => {
                                                                    if (!e.target.value) {
                                                                        setStockOutFormDataError((perv) => ({
                                                                            ...perv,
                                                                            branchId: true
                                                                        }))
                                                                    }
                                                                    else {
                                                                        setStockOutFormDataError((perv) => ({
                                                                            ...perv,
                                                                            branchId: false
                                                                        }))
                                                                    }
                                                                }}
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={stockOutFormData.branchId ? stockOutFormData.branchId : ''}
                                                                error={stockOutFormDataError.branchId}
                                                                name="branchId"
                                                                // disabled={isEdit}
                                                                label="Branches"
                                                                onChange={onChangeStockOut}
                                                            >
                                                                {
                                                                    ddlBranch ? ddlBranch.map((data) => (
                                                                        <MenuItem key={data.branchId} value={data.branchId}>{data.branchName}</MenuItem>
                                                                    )) : null
                                                                }

                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <div className='col-span-6'>
                                                        <TextField
                                                            onChange={onChangeStockOut}
                                                            value={stockOutFormData.billNumber}
                                                            name="billNumber"
                                                            id="outlined-required"
                                                            label="Bill Number"
                                                            InputProps={{ style: { fontSize: 14 } }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                </> : <></>
                                        }
                                        <div className='col-span-2'>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    textFieldStyle={{ width: '100%' }}
                                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    label="Stock In Date"
                                                    format="DD/MM/YYYY"
                                                    required
                                                    error={stockOutFormDataError.rmStockOutDate}
                                                    value={stockOutFormData.rmStockOutDate}
                                                    onChange={handleStockOutDate}
                                                    name="rmStockOutDate"
                                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className='col-span-6'>
                                            <TextField
                                                onChange={onChangeStockOut}
                                                value={stockOutFormData.rmStockOutComment ? stockOutFormData.rmStockOutComment : ''}
                                                name="rmStockOutComment"
                                                id="outlined-required"
                                                label="Comment"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        {isEdit &&
                                            <div className='col-span-6'>
                                                <TextField
                                                    onBlur={(e) => {
                                                        if (e.target.value.length < 4) {
                                                            setStockOutFormDataError((perv) => ({
                                                                ...perv,
                                                                reason: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockOutFormDataError((perv) => ({
                                                                ...perv,
                                                                reason: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockOut}
                                                    error={stockOutFormDataError.reason}
                                                    value={stockOutFormData.reason}
                                                    name="reason"
                                                    helperText={stockOutFormDataError.reason ? 'Edit Reason is must ...' : ''}
                                                    id="outlined-required"
                                                    label="Edit Reason"
                                                    InputProps={{ style: { fontSize: 14 } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    fullWidth
                                                />
                                            </div>}

                                        <div className='col-span-2 col-start-9'>
                                            <button className='addCategorySaveBtn' onClick={() => {
                                                isEdit ? editSubmitStockOut() : submitStockOut()
                                            }}>{isEdit ? "Save" : "Stock Out"}</button>
                                        </div>
                                        <div className='col-span-2'>
                                            <button className='addCategoryCancleBtn' onClick={() => {
                                                handleResetStockOut();
                                                setIsEdit(false);
                                                {
                                                    isEdit && setExpanded(false);
                                                }
                                            }}>{isEdit ? "cancel" : "reset"}</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            }

            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='ml-6 col-span-6' >
                                {tab != 3 &&
                                    <>
                                        <div className='flex'>
                                            <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3'>
                                                <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                    setFilter(false);
                                                    tab === 1 || tab === '1' ?
                                                        getStockInData() : getStockOutData();
                                                    setState([
                                                        {
                                                            startDate: new Date(),
                                                            endDate: new Date(),
                                                            key: 'selection'
                                                        }
                                                    ])
                                                }}><CloseIcon /></button>
                                            </div>
                                        </div>
                                        <Popover
                                            id={id}
                                            open={open}
                                            style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                                                <DateRangePicker
                                                    ranges={state}
                                                    onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                    direction="horizontal"
                                                    months={2}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                />
                                                <div className='mt-8 grid gap-4 grid-cols-12'>
                                                    <div className='col-span-3 col-start-7'>
                                                        <button className='stockInBtn' onClick={() => { tab === 1 || tab === '1' ? getStockInDataByFilter() : getStockOutDataByFilter(); setFilter(true); setPage(0); handleClose() }}>Apply</button>
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <button className='stockOutBtn' onClick={handleClose}>cancel</button>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Popover>
                                    </>
                                }
                            </div>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                {tab != 3 ?
                                    tab === 1 || tab === '1' ? <ExportMenu exportExcel={stockInExportExcel} exportPdf={stockInExportPdf} /> : <ExportMenu exportExcel={stockOutExportExcel} exportPdf={stockOutExportPdf} />
                                    // <button className='exportExcelBtn' onClick={() => { tab === 1 || tab === '1' ? stockInExportExcel() : stockOutExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button>
                                    :
                                    <button className='DeleteHistoryBtn' onClick={deleteData}><CloseIcon />&nbsp;&nbsp;Delete All Updated</button>
                                }</div>
                        </div>
                        {tab === 1 || tab === '1' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Entered By</TableCell>
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Qty</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Total Price</TableCell>
                                                <TableCell align="left">Bill No.</TableCell>
                                                <TableCell align="left">Supplier</TableCell>
                                                <TableCell align="left">Pay Mode</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stockInData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.rmStockInId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row">
                                                                {row.enteredBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.rawMaterialName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.productPrice ? row.productPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.totalPrice ? row.totalPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{row.billNumber}</TableCell>
                                                        <TableCell align="left" >{row.supplier}</TableCell>
                                                        <TableCell align="left" >{row.rmStockInPaymentMethod}</TableCell>
                                                        <Tooltip title={row.rmStockInComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.rmStockInComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.rmStockInDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.rmStockInId} data={row} deleteStockInOut={handleDeleteStockIn} setError={setError} />
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
                            </div> :
                            tab === 2 || tab === '2' ?
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Out By</TableCell>
                                                    <TableCell align="left">Product Name</TableCell>
                                                    <TableCell align="left">Quantity</TableCell>
                                                    <TableCell align="left">Stock OutPrice</TableCell>
                                                    <TableCell align="left">Category</TableCell>
                                                    <TableCell align="left">Comment</TableCell>
                                                    <TableCell align="left">Date</TableCell>
                                                    <TableCell align="left"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    stockOutData?.map((row, index) => (
                                                        totalRowsOut !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.rmStockOutId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left"  >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <Tooltip title={row.userName} placement="top-start" arrow>
                                                                    <TableCell component="th" scope="row"  >
                                                                        {row.outBy}
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="left"  >{row.rawMaterialName}</TableCell>
                                                                <TableCell align="left"  >{row.Quantity}</TableCell>
                                                                <TableCell align="left" >{parseFloat(row.rmStockOutPrice ? row.rmStockOutPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                                <TableCell align="left"  >{row.stockOutCategoryName}</TableCell>
                                                                <Tooltip title={row.rmStockOutComment} placement="top-start" arrow><TableCell align="left"  ><div className='Comment'>{row.rmStockOutComment}</div></TableCell></Tooltip>
                                                                <TableCell align="left"   >{row.rmStockOutDate}</TableCell>
                                                                {tab != 3 &&
                                                                    <TableCell align="right">
                                                                        <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.rmStockOutId} data={row} deleteStockInOut={handleDeleteStockOut} />
                                                                    </TableCell>}
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>

                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={totalRowsOut}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableContainer>
                                </div> :
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Out By</TableCell>
                                                    <TableCell align="left">Product Name</TableCell>
                                                    <TableCell align="left">Quantity</TableCell>
                                                    <TableCell align="left">Category</TableCell>
                                                    <TableCell align="left">Comment</TableCell>
                                                    <TableCell align="left">Date</TableCell>
                                                    <TableCell align="left"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    stockOutData?.map((row, index) => (
                                                        totalRowsOut !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.rmStockOutId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" onClick={() => { gotohistory(row.rmStockOutId) }}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <Tooltip title={row.userName} placement="top-start" arrow>
                                                                    <TableCell component="th" scope="row" onClick={() => { gotohistory(row.rmStockOutId) }}>
                                                                        {row.outBy}
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.rmStockOutId) }}>{row.rawMaterialName}</TableCell>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.rmStockOutId) }}>{row.Quantity}</TableCell>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.rmStockOutId) }}>{row.stockOutCategoryName}</TableCell>
                                                                <Tooltip title={row.rmStockOutComment} placement="top-start" arrow><TableCell align="left" onClick={() => { gotohistory(row.rmStockOutId) }}><div className='Comment'>{row.rmStockOutComment}</div></TableCell></Tooltip>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.rmStockOutId) }} >{row.rmStockOutDate}</TableCell>
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>

                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={totalRowsOut}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableContainer>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default StockInOutMaterial;