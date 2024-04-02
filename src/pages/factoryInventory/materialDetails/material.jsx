import './material.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CountCard from '../countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import ProductQtyCountCard from '../productQtyCard/productQtyCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import MenuStockInOut from '../stockManagementMaterial/menu';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';
import ExportMenu from '../materialListTable/exportMenu';

function MaterialDetails() {
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    let { id, name, unit, status } = useParams();
    const [isEdit, setIsEdit] = React.useState(false);
    const [stockOutData, setStockOutData] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [supplier, setSupplierList] = React.useState();
    const [unitPreference, setUnitPreference] = React.useState();
    const [stockInData, setStockInData] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsDebit, setTotalRowsDebit] = React.useState(0);
    const [filter, setFilter] = React.useState(false);
    const [unitsForProduct, setUnitsForProduct] = React.useState(0);
    const [tab, setTab] = React.useState(1);
    const [tabStockInOut, setTabStockInOut] = React.useState(1);
    const [statisticsCount, setStatisticsCounts] = useState();
    const [supplierNameAndCount, setSupplierNameAndCount] = useState();
    const [categoryNameAndCount, setCategoryNameAndCount] = useState();
    const [categories, setCategories] = React.useState();
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [ddlBranch, setddlBranch] = React.useState();
    const regex = /^\d*(?:\.\d*)?$/;
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [stockInFormData, setStockInFormData] = React.useState({
        rawMaterialId: id,
        rawMaterialName: name,
        rawMaterialQty: "",
        rawMaterialUnit: unit,
        productPrice: "",
        totalPrice: "",
        billNumber: "",
        rmSupplierId: "",
        rmStockInPaymentMethod: 'cash',
        rmStockInComment: "",
        rmStockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        totalPrice: false,
        rmSupplierId: false,
        rmStockInPaymentMethod: false,
        rmStockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'totalPrice',
        'rmSupplierId',
        'rmStockInPaymentMethod',
        'rmStockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        rawMaterialId: id,
        rawMaterialQty: "",
        rawMaterialUnit: unit,
        rmStockOutCategory: 'Regular',
        rmStockOutComment: "",
        reason: "",
        rmStockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        rawMaterialQty: false,
        reason: false,
        rmStockOutCategory: false,
        rmStockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'rawMaterialQty',
        'reason',
        'rmStockOutCategory',
        'rmStockOutDate',
    ])
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
        setStockInFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
        // }
    }
    const handleResetStockIn = () => {
        setStockInFormData({
            rawMaterialId: id,
            rawMaterialName: name,
            rawMaterialQty: "",
            rawMaterialUnit: unit,
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
            productPrice: false,
            totalPrice: false,
            rmSupplierId: false,
            rmStockInPaymentMethod: false,
            rmStockInDate: false
        })
    }
    const handleResetStockOut = () => {
        setStockOutFormData({
            rawMaterialId: id,
            reason: '',
            rawMaterialQty: "",
            rawMaterialUnit: unit,
            rmStockOutCategory: 'Regular',
            rmStockOutComment: "",
            rmStockOutDate: dayjs(),
            remainingStock: statisticsCount && statisticsCount.remainingStock ? statisticsCount.remainingStock : 0,
            remainingStockArray: statisticsCount && statisticsCount.allUnitConversation ? statisticsCount.allUnitConversation : []
        })
        setStockOutFormDataError({
            rawMaterialQty: false,
            rawMaterialUnit: false,
            rmStockOutCategory: false,
            rmStockInDate: false,
            reason: false
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
    const getRmUnitPreferenceById = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmUnitPreferenceById?rawMaterialId=${id}`, config)
            .then((res) => {
                setUnitPreference(res.data);
                console.log('Length', res.data, Math.ceil(res.data.length / 2))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
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
    const onChangeStockOut = (e) => {
        // if (e.target.name === 'rawMaterialQty') {
        //     if (e.target.value > (isEdit ? stockOutFormData.stockRemaining : statisticsCount?.remainingStock)) {
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
    const submitStockIn = () => {
        console.log('submitStockIn')
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'reason') {
                    if (isEdit && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormDataError['reason'] === true) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            reason: true
                        }))
                        return element;
                    }
                }
                else if (element === 'rmStockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.rmStockInDate == 'Invalid Date') {
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
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockIn()
            }
        }
    }
    const stockOut = async () => {
        setLoading(true)
        const formdata = {
            rawMaterialId: id,
            rawMaterialQty: stockOutFormData.rawMaterialQty,
            rawMaterialUnit: stockOutFormData.rawMaterialUnit,
            rmStockOutCategory: stockOutFormData.rmStockOutCategory,
            rmStockOutComment: stockOutFormData.rmStockOutComment,
            rmStockOutDate: stockOutFormData.rmStockOutDate,
            branchId: stockOutFormData.branchId,
            billNumber: stockOutFormData.billNumber ? stockOutFormData.billNumber : '',
        }
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRmStockOutDetails`, formdata, config)
            .then((res) => {
                setSuccess(true)
                // getData();
                setLoading(false)
                // setTab(null)
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getStatistics();
                getCategoryNameAndCount();
                getSupplierNameAndCount();
                setFilter(false);
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
            console.log('submitStockOut')
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
                else
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
                console.log('velidate', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOut()
            }
        }
    }
    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?page=${pageNum}&numPerPage=${rowPerPageNum}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?&page=${1}&numPerPage=${5}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRmStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
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
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change", tab)
        if (tabStockInOut === 2 || tabStockInOut === '2') {
            console.log("page change>>")
            if (filter) {
                getStockOutDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockOutDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else {
            if (filter) {
                getStockInDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockInDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const stockIn = async () => {
        setLoading(true)
        const formdata = {
            rawMaterialId: id,
            rawMaterialQty: stockInFormData.rawMaterialQty,
            rawMaterialUnit: stockInFormData.rawMaterialUnit,
            productPrice: stockInFormData.productPrice,
            totalPrice: stockInFormData.totalPrice,
            billNumber: stockInFormData.billNumber,
            rmSupplierId: stockInFormData.rmSupplierId,
            rmStockInPaymentMethod: stockInFormData.rmStockInPaymentMethod,
            rmStockInComment: stockInFormData.rmStockInComment,
            rmStockInDate: stockInFormData.rmStockInDate,
        }
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRawMaterialStockInDetails`, formdata, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                // getData();
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getStatistics();
                getCategoryNameAndCount();
                getSupplierNameAndCount();
                setFilter(false)
                getStockInData()
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabStockInOut === '1' || tabStockInOut === 1) {
            if (filter) {
                getStockInDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockInDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else {
            if (filter) {
                getStockOutDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockOutDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}rawMaterialrouter/removeRawMaterialStockInTransaction?rmStockInId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                getStatistics();
                getStockInData();
                getSupplierNameAndCount();
                getCategoryNameAndCount();
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
                setSuccess(true)
                getStatistics();
                getStockOutData();
                getCategoryNameAndCount();
                getSupplierNameAndCount();
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
    const stockOutExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRmStockoutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRmStockoutList?startDate=${''}&endDate=${''}&rawMaterialId=${id}`,
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
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRmStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRmStockOutList?startDate=${''}&endDate=${''}&rawMaterialId=${id}`,
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
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForRawMaterialStockInList?startDate=${''}&endDate=${''}&rawMaterialId=${id}`,
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
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportPdfForRawMaterialStockInList?startDate=${''}&endDate=${''}&rawMaterialId=${id}`,
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

    const getCategoryList = async (isSupplyBranch) => {
        console.log('detailOut', isSupplyBranch)
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRmStockOutCategory`, config)
            .then((res) => {
                // console.log('detailOut', isSupplyBranch == 'false' ? 'xyz' : 'yzx')
                setCategories(isSupplyBranch == 'true' ? res.data : res.data.filter((ddl) => {
                    if (ddl.stockOutCategoryId != 'Branch') {
                        return ddl
                    }
                }));
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getStatistics = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRowMaterialCountDetailsById?rawMaterialId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
                setStockOutFormData((perv) => ({
                    ...perv,
                    remainingStock: res.data.remainingStock,
                    remainingStockArray: res.data.allUnitConversation
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatisticsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRowMaterialCountDetailsById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
                setStockOutFormData((perv) => ({
                    ...perv,
                    remainingStock: res.data.remainingStock,
                    remainingStockArray: res.data.allUnitConversation
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getSupplierNameAndCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getSupplierByRawMaterialId?rawMaterialId=${id}`, config)
            .then((res) => {
                setSupplierNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getSupplierNameAndCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getSupplierByRawMaterialId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}`, config)
            .then((res) => {
                setSupplierNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCategoryNameAndCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getCategoryWiseUsedByRawMaterial?rawMaterialId=${id}`, config)
            .then((res) => {
                setCategoryNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCategoryNameAndCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getCategoryWiseUsedByRawMaterial?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialId=${id}`, config)
            .then((res) => {
                setCategoryNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const resetStockInEdit = () => {
        setStockInFormData({
            rawMaterialId: id,
            rawMaterialName: name,
            rawMaterialQty: "",
            rawMaterialUnit: unit,
            productPrice: "",
            totalPrice: "",
            billNumber: "",
            rmSupplierId: "",
            rmStockInPaymentMethod: 'cash',
            rmStockInComment: "",
            rmStockInDate: dayjs()
        });
        setStockInFormDataError({
            totalPrice: false,
            rmSupplierId: false,
            rmStockInPaymentMethod: false,
            rmStockInDate: false
        })
        setIsEdit(false)
    }
    const resetStockOutEdit = () => {
        setStockOutFormData({
            rawMaterialId: id,
            rawMaterialQty: "",
            rawMaterialUnit: unit,
            rmStockOutCategory: 'Regular',
            rmStockOutComment: "",
            reason: "",
            rmStockOutDate: dayjs(),
            remainingStock: statisticsCount && statisticsCount.remainingStock ? statisticsCount.remainingStock : 0,
            remainingStockArray: statisticsCount && statisticsCount.allUnitConversation ? statisticsCount.allUnitConversation : []
        });
        setStockOutFormDataError({
            rawMaterialQty: false,
            reason: false,
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
                    rawMaterialName: res.data,
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
                getSupplierList(res.data.rawMaterialId)
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
                    rawMaterialName: res.data,
                    rawMaterialId: res.data.rawMaterialId,
                    rawMaterialQty: res.data.rawMaterialQty,
                    rawMaterialUnit: res.data.rawMaterialUnit,
                    rmStockOutCategory: res.data.rmStockOutCategory,
                    rmStockOutComment: res.data.rmStockOutComment,
                    stockRemaining: statisticsCount.remainingStock + res.data.rawMaterialQty,
                    rmStockOutDate: dayjs(res.data.rmStockOutDate),
                    remainingStock: statisticsCount.remainingStock,
                    remainingStockArray: statisticsCount.allUnitConversation
                }))
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const handleAccordionOpenOnEdit = (data, isFullEdit) => {
        if (tabStockInOut === 1 || tabStockInOut === '1') {
            fillStockInEdit(data, isFullEdit);
        }
        else {
            fillStockOutEdit(data)
        }
        setIsEdit(true)
        setExpanded(true)
    }
    const stockInEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/updateRawMaterialStockInTransaction`, stockInFormData, config)
            .then((res) => {
                setSuccess(true)
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
                getStockInData();
                getStatistics();
                getCategoryNameAndCount();
                getSupplierNameAndCount();
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const stockOutEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/updateRmStockOutTransaction`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true)
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
                getStatistics();
                getCategoryNameAndCount();
                getSupplierNameAndCount();
                getStockOutData();
                handleResetStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
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
    const editSubmitStockOut = () => {
        if (loading || success) {

        } else {
            console.log('editSubmitStockOut')
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
    const editStockIn = () => {
        console.log('editStockIn');
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
            // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
            stockInEdit()
        }
    }
    useEffect(() => {
        getUnitForProduct(id);
        getSupplierList(id)
        getCategoryList(status);
        getStockInData();
        getStatistics();
        getDDLBranchList();
        getCategoryNameAndCount();
        getSupplierNameAndCount();
        getRmUnitPreferenceById(id);
        // getCountData();
    }, [])

    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        // setLoading(false);
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
            setSuccess(false);
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false);
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
    console.log('formdata', stockInFormData)
    return (
        <div className='supplierListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-12 mt-6'>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-3'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <Tooltip title={name + '  ' + (statisticsCount && statisticsCount.minProductQty ? statisticsCount?.remainingStock < statisticsCount.minProductQty ? statisticsCount?.remainingStock != 0 ? 'Low Stock' : 'Out Of Stock' : '' : '')} placement="top-start" arrow>
                                                    <div className={`flex col-span-12 justify-between productTab`}>
                                                        <div className='rawMaterialNameHeader'>{name}</div>
                                                        <div className='status' style={{ color: `${statisticsCount && statisticsCount.minProductQty ? statisticsCount?.remainingStock < statisticsCount.minProductQty ? statisticsCount?.remainingStock != 0 ? 'orange' : 'red' : 'black' : 'black'}` }}>{statisticsCount && statisticsCount.minProductQty ? statisticsCount?.remainingStock < statisticsCount.minProductQty ? statisticsCount?.remainingStock != 0 ? 'Low Stock' : 'Out Of Stock' : '' : ''}</div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className='h-full col-span-4'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-4 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                    }} >
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                                <div className={`flex col-span-4 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(2);
                                                    }}>
                                                    <div className='statusTabtext'>Supplier</div>
                                                </div>
                                                <div className={`flex col-span-4 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(3);
                                                    }}>
                                                    <div className='statusTabtext'>Category</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-5 flex justify-end pr-4'>
                                            <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3 self-center'>
                                                <button
                                                    className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                    onClick={() => {
                                                        setFilter(false);
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ])
                                                        // getProductCount();
                                                        getStatistics()
                                                        setTabStockInOut(1);
                                                        getStockInData(); setPage(0); setRowsPerPage(5); getSupplierNameAndCount(); getCategoryNameAndCount()
                                                    }}><CloseIcon /></button>
                                            </div>
                                            <Popover
                                                id={ids}
                                                open={open}
                                                style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
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
                                                            <button className='stockInBtn' onClick={() => {
                                                                setFilter(true); handleClose();
                                                                // getStatisticsByFilter();
                                                                setTabStockInOut(1);
                                                                setPage(0);
                                                                setRowsPerPage(5);
                                                                getStockInDataByFilter();
                                                                getStatisticsByFilter();
                                                                getSupplierNameAndCountByFilter();
                                                                getCategoryNameAndCountByFilter();
                                                            }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>cancel</button>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {tab === 1 || tab === '1' ?
                        <div className='grid gap-4 mt-12'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-7'>
                                    <CountCard color={'orange'} count={statisticsCount && statisticsCount.remainingStock ? statisticsCount.remainingStock : 0} desc={'Remaining Stock'} productDetail={true} unitDesc={unit} />
                                </div> <div className='col-span-5'>
                                    <CountCard color={'orange'} count={statisticsCount && statisticsCount.remainUsedPrice ? statisticsCount.remainUsedPrice : 0} desc={'Remaining Value'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-7'>
                                    <CountCard color={'black'} count={statisticsCount && statisticsCount.totalPurchase ? statisticsCount.totalPurchase : 0} desc={'Total Purchase'} productDetail={true} unitDesc={unit} />
                                </div>
                                <div className='col-span-5'>
                                    <CountCard color={'pink'} count={statisticsCount && statisticsCount.totalRs ? statisticsCount.totalRs : 0} desc={'Total Cost'} productDetail={true} unitDesc={0} />
                                </div>
                            </div>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-7'>
                                    <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalUsed ? statisticsCount.totalUsed : 0} desc={'Total Used'} productDetail={true} unitDesc={unit} />
                                </div>
                                <div className='col-span-5'>
                                    <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalUsedPrice ? statisticsCount.totalUsedPrice : 0} desc={'Used Value'} productDetail={true} unitDesc={0} />
                                </div>
                            </div>
                            <div className='w-full flex gap-6'>
                                <div className='grid grid-cols-12 w-1/2 gap-6'>
                                    <div className='col-span-12'>
                                        <CountCard color={'green'} count={statisticsCount && statisticsCount.lastPrice ? statisticsCount.lastPrice : 0} desc={'Last Purchase Price'} productDetail={true} unitDesc={0} />
                                    </div>
                                    <div className='col-span-12'>
                                        <CountCard color={'yellow'} count={statisticsCount && statisticsCount.minProductQty ? statisticsCount.minProductQty : 0} desc={'Min Material Qty'} productDetail={true} unitDesc={unit} />
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    {/* <div className={`unitCard grid-flow-col grid ${unitPreference && unitPreference.json1 && unitPreference.json1.length ? `grid-rows-${Math.ceil(unitPreference.json1.length / 2)}` : ''} `} key={'1x'}>
                                        {unitPreference && unitPreference.json1?.map((data, index) => (
                                            <div key={`units${index}`}>
                                                {data.preference}
                                            </div>
                                        ))
                                        }
                                    </div>
                                    <div className={`unitCard mt-4 grid ${unitPreference && unitPreference.json2 && unitPreference.json2.length ? `grid-rows-${Math.ceil(unitPreference.json2.length / 2)}` : ''} grid-flow-col`} key={'2x'}>
                                        {unitPreference && unitPreference.json2?.map((data, index) => (
                                            <div key={`unitBase${index}`}>
                                                {data.preference}
                                            </div>
                                        ))
                                        }
                                    </div> */}
                                    {unitPreference && unitPreference.json2 && unitPreference.json2.length > 0 ? <>
                                        <div className=' unitCard grid grid-cols-2'>
                                            {unitPreference && unitPreference.json1?.map((data, index) => (
                                                <div key={`units${index}`}>
                                                    {data.preference}
                                                </div>
                                            ))
                                            }
                                        </div>
                                        <div className='unitCard mt-4 grid grid-cols-2'>
                                            {unitPreference && unitPreference.json2?.map((data, index) => (
                                                <div key={`unitBase${index}`}>
                                                    {data.preference}
                                                </div>
                                            ))
                                            }
                                        </div></>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className=' stockCard grid gap-4 grid-cols-4'>
                                {statisticsCount && statisticsCount.allUnitConversation && statisticsCount.allUnitConversation?.map((data, index) => (
                                    <div key={`units${index}`}>
                                        {data.unitName} : {data.value}
                                    </div>
                                ))
                                }
                            </div>
                        </div> :
                        tab === 2 || tab === '2' ?
                            <div className='grid gap-4 mt-12' style={{ minHeight: '216px', maxHeight: '216px', overflowY: 'scroll' }}>
                                <div className='grid grid-cols-1 pb-3'>
                                    {
                                        supplierNameAndCount && supplierNameAndCount?.map((row, index) => (
                                            <ProductQtyCountCard productQtyUnit={unit} rawMaterialQty={row.remainingStock} productPrice={row.expense} rawMaterialName={row.supplierNickName} index={index} />
                                        ))
                                    }
                                </div>
                            </div>
                            :
                            <div className='grid gap-4 mt-12' style={{ minHeight: '216px', maxHeight: '332px', overflowY: 'scroll' }}>
                                <div className='grid grid-cols-1 gap-3 pb-3'>
                                    {
                                        categoryNameAndCount && categoryNameAndCount?.map((row, index) => (
                                            <ProductQtyCountCard productQtyUnit={unit} rawMaterialQty={row.remainingStock} productPrice={row.usedPrice} rawMaterialName={row.stockOutCategoryName} index={index} />
                                        ))
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
            <div className='datePickerWrp mt-6'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='productTableSubContainer'>
                            <div className='h-full grid grid-cols-12'>
                                <div className='h-full col-span-5'>
                                    <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                        <div className={`flex col-span-6 justify-center ${tabStockInOut === 1 || tabStockInOut === '1' ? 'productTabAll' : 'productTab'}`}
                                            onClick={() => {
                                                setTabStockInOut(1);
                                                resetStockOutEdit();
                                                setPage(0); setRowsPerPage(5);
                                                filter ? getStockInDataByFilter() : getStockInData();
                                            }} >
                                            <div className='statusTabtext'>Stock In</div>
                                        </div>
                                        <div className={`flex col-span-6 justify-center ${tabStockInOut === 2 || tabStockInOut === '2' ? 'productTabIn' : 'productTab'}`}
                                            onClick={() => {
                                                setTabStockInOut(2);
                                                resetStockInEdit();
                                                setPage(0); setRowsPerPage(5);
                                                filter ? getStockOutDataByFilter() : getStockOutData();
                                            }}>
                                            <div className='statusTabtext'>Stock Out</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-10 grid grid-col-12'>
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
                                {tabStockInOut && tabStockInOut === '1' || tabStockInOut === 1 ? "Stock In" : "Stock Out"}
                            </div>
                            {(tabStockInOut && tabStockInOut === '2' || tabStockInOut === 2) ?
                                <div className='col-span-8 flex justify-end'>
                                    <Typography id="modal-modal" variant="h6" component="h2">
                                        Remaining Stock :- {stockOutFormData.remainingStock ? stockOutFormData.remainingStock : ''}
                                    </Typography>
                                </div>
                                : <></>
                            }
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='stockInOutContainer'>
                            {tabStockInOut === '2' || tabStockInOut === 2 ? <>
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
                            </> : <></>}
                            {tabStockInOut === '1' || tabStockInOut === 1 ?
                                <div className='mt-6 grid grid-cols-12 gap-6'>
                                    <div className='col-span-3'>
                                        <FormControl fullWidth>
                                            <TextField
                                                value={name}
                                                name="rawMaterialName"
                                                id="outlined-required"
                                                label="Material Name"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </FormControl>
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
                                            onChange={onChangeStockIn}
                                            disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                            value={stockInFormData.rawMaterialQty ? stockInFormData.rawMaterialQty : ""}
                                            error={stockInFormDataError.rawMaterialQty}
                                            helperText={stockInFormDataError.rawMaterialQty ? "Enter Qty" : ''}
                                            name="rawMaterialQty"
                                        // InputProps={{
                                        //     endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
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
                                                // disabled={!stockInFormData.rawMaterialName}
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
                                                        totalPrice: false,
                                                        productPrice: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                    onChangeStockIn(e)
                                                }
                                            }}
                                            value={stockInFormData.totalPrice === 'NaN' ? "" : stockInFormData.totalPrice}
                                            error={stockInFormDataError.totalPrice}
                                            helperText={stockInFormDataError.totalPrice ? "Total Price" : ''}
                                            name="totalPrice"
                                            disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                            id="outlined-required"
                                            label="Total Price"
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
                                            isEdit ? setExpanded(false) : setExpanded(true);
                                            setIsEdit(false);
                                        }}>{isEdit ? 'Cancel' : 'Reset'}</button>
                                    </div>
                                </div>
                                :
                                <div className='mt-6 grid grid-cols-12 gap-6'>
                                    <div className='col-span-3'>
                                        <FormControl fullWidth>
                                            <TextField
                                                value={name}
                                                name="rawMaterialName"
                                                id="outlined-required"
                                                label="Material Name"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </FormControl>
                                    </div>
                                    <div className='col-span-2'>
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value <= 0) {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        rawMaterialQty: true
                                                    }))
                                                }
                                                else {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        rawMaterialQty: false
                                                    }))
                                                }
                                            }}
                                            type="number"
                                            label="Qty"
                                            fullWidth
                                            onChange={onChangeStockOut}
                                            value={stockOutFormData.rawMaterialQty ? stockOutFormData.rawMaterialQty : ""}
                                            error={stockOutFormDataError.rawMaterialQty}
                                            helperText={stockOutFormDataError.rawMaterialQty ? 'Please enter Qty' : ''}
                                            name="rawMaterialQty"
                                        // InputProps={{
                                        //     endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
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
                                                // disabled={!stockOutFormData.rawMaterialName}
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
                                                            disabled={isEdit}
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
                                                label="Stock Out Date"
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
                                            value={stockOutFormData.rmStockOutComment}
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
                                            isEdit ? setExpanded(false) : setExpanded(true);
                                        }}>{isEdit ? "cancel" : "reset"}</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                {/* <button className='exportExcelBtn' onClick={() => { tabStockInOut === 1 || tabStockInOut === '1' ? stockInExportExcel() : stockOutExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button> */}
                                {tabStockInOut === 1 || tabStockInOut === '1' ? <ExportMenu exportExcel={stockInExportExcel} exportPdf={stockInExportPdf} /> : <ExportMenu exportExcel={stockOutExportExcel} exportPdf={stockOutExportPdf} />}
                            </div>
                        </div>
                        {tabStockInOut === 1 || tabStockInOut === '1' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Entered By</TableCell>
                                                <TableCell align="left">Material Name</TableCell>
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
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Out By</TableCell>
                                                <TableCell align="left">Material Name</TableCell>
                                                <TableCell align="left">Quantity</TableCell>
                                                <TableCell align="left">stockOutPrice</TableCell>
                                                <TableCell align="left">Category</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stockOutData?.map((row, index) => (
                                                totalRowsOut !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.rmStockOutId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row">
                                                                {row.outBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.rawMaterialName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="left" >{parseFloat(row.stockOutPrice ? row.stockOutPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{row.stockOutCategoryName}</TableCell>
                                                        <Tooltip title={row.rmStockOutComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.rmStockOutComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.rmStockOutDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.rmStockOutId} data={row} deleteStockInOut={handleDeleteStockOut} />
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

export default MaterialDetails;