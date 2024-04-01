import './stockInOutFactory.css';
import * as React from "react";
import { useRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import Checkbox from '@mui/material/Checkbox';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Box from '@mui/material/Box';
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
import { setISODay } from 'date-fns';

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
const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '96%',
    maxHeight: '95vh',
    overflow: 'scroll',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function StockInOutFactoryInOut() {
    const regex = /^\d*(?:\.\d*)?$/;
    const navigate = useNavigate();
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [openStockOut, setOpenStockOut] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [isView, setIsView] = React.useState(false);
    const [suppiler, setSuppilerList] = React.useState();
    const [filter, setFilter] = React.useState(false);
    const [ddlDistributer, setDdlDistributer] = React.useState([]);
    const [ddlBranch, setDdlBranch] = React.useState([]);
    const [unitsForProduct, setUnitsForProduct] = React.useState(0);
    const [stockInData, setStockInData] = React.useState();
    const [stockOutData, setStockOutData] = React.useState();
    const [categories, setCategories] = React.useState();
    const [productList, setProductList] = React.useState();
    const [page, setPage] = React.useState(0);
    const [materialList, setMaterialList] = React.useState([]);
    const [otherExpenseList, setOtherExpenseList] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tab, setTab] = React.useState(1);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const textFieldRef = useRef(null);
    const [recipeStockIn, setRecipeStockIn] = React.useState([]);
    const [recipeProductStockIn, setRecipeProductStockIn] = React.useState([]);
    const [recipeExpenseStockIn, setRecipeExpenseStockIn] = React.useState([]);
    const [recipeErrorStockIn, setRecipeErrorStockIn] = React.useState([]);
    const [recipeErrorProductStockIn, setRecipeErrorProductStockIn] = React.useState([]);
    const [recipeErrorExpenseSockIn, setRecipeErrorExpenseStockIn] = React.useState([]);
    const [openStockIn, setOpenStockIn] = React.useState(false);
    const handleCloseStockIn = () => {
        setStockInFormData({
            mfProductId: "",
            mfProductQty: "",
            mfProductUnit: "",
            totalPrice: "",
            mfStockInComment: "",
            mfStockInDate: dayjs(),
            isAuto: true
        })
        setStockInFormDataError({
            mfProductQty: false,
            mfProductUnit: false,
            totalPrice: false,
            mfStockInDate: false
        })
        setIsEdit(false);
        setIsView(false)
        setRecipeStockIn([])
        setRecipeExpenseStockIn([])
        setRecipeProductStockIn([])
        setRecipeErrorStockIn([])
        setRecipeErrorExpenseStockIn([])
        setRecipeErrorProductStockIn([])
        setOpenStockIn(false);
    }
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onChangeRecipeStockIn = (e, index) => {
        setRecipeStockIn(prev =>
            prev.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: e.target.value } : user
            )
        );
        setRecipeErrorStockIn(perv =>
            perv.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: (e.target.value > 0 && e.target.value <= recipeStockIn[idx].remainQty ? false : true) } : user,
                // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
            ))
    }
    const handleCloseStockOut = () => {
        setStockOutFormData({
            mfProductId: "",
            mfProductQty: "",
            productUnit: "",
            mfProductOutCategory: '',
            mfStockOutComment: "",
            mfStockOutDate: dayjs(),
            branchId: '',
            outDataId: '',
            distributorId: '',
            payType: 'cash',
            sellAmount: '',
        })
        setStockOutFormDataError({
            mfProductQty: false,
            productUnit: false,
            mfProductOutCategory: false,
            mfStockOutDate: false,
            branchId: false,
            outDataId: false,
            distributorId: false,
            sellAmount: false,
        })
        setOpenStockOut(false);
    }
    const handleOpenStockIn = (row) => {
        getUnitForProduct(row.mfProductId)
        setStockInFormData((perv) => ({
            ...perv,
            mfProductId: row.mfProductId,
            mfProductName: row.mfProductName,
            isAuto: true
        }))
        setOpenStockIn(true);
    }
    const handleOpenStockOut = () => {
        setIsEdit(false);
        getCategoryList();
        setOpenStockOut(true);
    }
    const onChangeRecipeExpenseStockIn = (e, index) => {
        if (e.target.name == 'usedSource') {
            setRecipeExpenseStockIn(prev =>
                prev.map((user, idx) =>
                    idx === index ? { ...user, usedSource: e.target.value, usedPrice: parseFloat(e.target.value * user.unitPrice).toFixed(4) } : user
                )
            );
            setRecipeErrorExpenseStockIn(perv =>
                perv.map((user, idx) =>
                    idx === index ? { ...user, usedSource: (e.target.value > 0 || e.target.value ? false : true), usedPrice: (e.target.value * user.unitPrice > 0 || e.target.value ? false : true) } : user,
                    // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
                ))
        } else {
            setRecipeExpenseStockIn(prev =>
                prev.map((user, idx) =>
                    idx === index ? { ...user, [e.target.name]: e.target.value } : user
                )
            );
            setRecipeErrorExpenseStockIn(perv =>
                perv.map((user, idx) =>
                    idx === index ? { ...user, [e.target.name]: (e.target.value > 0 || e.target.value ? false : true) } : user,
                    // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
                ))
        }
        // console.log("addRecipeData", recipe, recipeError)
    }
    const onChangeRecipeProductStockIn = (e, index) => {
        setRecipeProductStockIn(prev =>
            prev.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: e.target.value } : user
            )
        );
        setRecipeErrorProductStockIn(perv =>
            perv.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: (e.target.value > 0 && e.target.value <= recipeProductStockIn[idx].remainQty ? false : true) } : user,
                // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
            ))
    }
    const resetStockInEdit = () => {
        setStockInFormData({
            mfProductId: "",
            mfProductQty: "",
            mfProductUnit: "",
            totalPrice: "",
            mfStockInComment: "",
            mfStockInDate: dayjs(),
            isAuto: true
        });
        setStockInFormDataError({
            mfProductQty: false,
            mfProductUnit: false,
            totalPrice: false,
            mfStockInDate: false
        })
        setIsEdit(false)
    }
    const resetStockOutEdit = () => {
        setStockOutFormData({
            mfProductId: "",
            mfProductQty: "",
            productUnit: "",
            mfProductOutCategory: '',
            mfStockOutComment: "",
            mfStockOutDate: dayjs(),
            branchId: '',
            outDataId: '',
            distributorId: '',
            payType: 'cash',
            sellAmount: '',
        });
        setStockOutFormDataError({
            mfProductQty: false,
            productUnit: false,
            mfProductOutCategory: false,
            mfStockOutDate: false
        })
        setIsEdit(false)
    }

    const fillStockInEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillMfProductStockInData?mfStockInId=${id.mfStockInId}`, config)
            .then((res) => {
                setStockInFormData((perv) => ({
                    ...perv,
                    mfStockInId: id.mfStockInId,
                    mfProductId: res.data.mfProductId,
                    mfProductName: res.data.mfProductName,
                    mfProductQty: parseFloat(res.data.mfStockInDisplayQty),
                    mfProductUnit: res.data.mfStockInDisplayUnit,
                    totalPrice: res.data.totalPrice,
                    mfStockInComment: res.data.mfStockInComment,
                    mfStockInDate: dayjs(res.data.mfStockInDate),
                    isAuto: res.data.isAuto
                }))
                setRecipeStockIn(res.data.autoJson.recipeMaterial);
                setRecipeExpenseStockIn(res.data.autoJson.otherExpense);
                setRecipeProductStockIn(res.data.autoJson.produceProductda);
                setRecipeErrorStockIn(res && res.data.autoJson && res.data.autoJson.recipeMaterial ? res.data.autoJson.recipeMaterial?.map((data, index) => (
                    {
                        usedMaterial: false,
                    }
                )) : null)
                setRecipeErrorExpenseStockIn(res && res.data.autoJson && res.data.autoJson.otherExpense ? res.data.autoJson.otherExpense?.map((data, index) => (
                    {
                        usedSource: false,
                    }
                )) : null)
                setRecipeErrorProductStockIn(res && res.data.autoJson && res.data.autoJson.produceProductda ? res.data.autoJson.produceProductda?.map((data, index) => (
                    {
                        usedValue: false,
                    }
                )) : null)
                setOpenStockIn(true);
                getUnitForProduct(res.data.mfProductId);
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const fillStockOutEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillMfProductStockOutData?mfStockOutId=${id}`, config)
            .then((res) => {
                getUnitForProduct(res.data.mfProductId);
                setStockOutFormData((perv) => ({
                    ...perv,
                    mfProductId: res.data.mfProductId,
                    mfStockOutId: res.data.mfStockOutId,
                    mfProductName: res.data.mfProductName,
                    mfProductQty: res.data.mfStockOutDisplayQty,
                    productUnit: res.data.mfStockOutDisplayUnit,
                    mfProductOutCategory: res.data.mfProductOutCategory,
                    mfStockOutComment: res.data.mfStockOutComment,
                    reason: '',
                    mfStockOutDate: dayjs(res.data.mfStockOutDate),
                    branchId: res.data.branchId,
                    outDataId: '',
                    distributorId: res.data.distributorId,
                    payType: res.data.payType,
                    sellAmount: res.data.sellAmount,
                }))
                // setStockOutFormData(res.data)
                setIsEdit(true)
                setOpenStockOut(true)
                getDistributorList(res.data.mfProductId)
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getUnitForProduct = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlmfProductUnitById?mfProductId=${id}`, config)
            .then((res) => {
                setUnitsForProduct(res.data);
                setStockInFormDataError((perv) => ({
                    ...perv,
                    mfProductUnit: false
                }))
                setStockOutFormDataError((perv) => ({
                    ...perv,
                    productUnit: false
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleAccordionOpenOnEdit = (data) => {
        console.log('edit', data)
        if (data.remainingQty == data.mfProductQty) {
            fillStockInEdit(data);
        }
        else {
            setError('This Production can not be edited')
        }
        setIsEdit(true)
        setExpanded(true)
    }
    const handleAccordionOpenOnView = (data) => {
        console.log('edit', data)
        if (tab === 1 || tab === '1') {
            fillStockInEdit(data);
        }
        else {
            setError('This Production can not be edited')
        }
        setIsView(true)
        setExpanded(true)
    }
    const handleAccordionOpenOnEditOut = (data) => {
        console.log('edit', data)
        fillStockOutEdit(data.mfStockOutId);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [stockInFormData, setStockInFormData] = React.useState({
        mfProductId: "",
        mfProductQty: "",
        mfProductUnit: "",
        totalPrice: "",
        mfStockInComment: "",
        mfStockInDate: dayjs(),
        isAuto: true
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        mfProductQty: false,
        mfProductUnit: false,
        totalPrice: false,
        mfStockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'mfProductQty',
        'mfProductUnit',
        'totalPrice',
        'mfStockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        mfProductId: "",
        mfProductQty: "",
        productUnit: "",
        mfProductOutCategory: '',
        mfStockOutComment: "",
        reason: "",
        mfStockOutDate: dayjs(),
        branchId: '',
        outDataId: '',
        distributorId: '',
        payType: 'cash',
        sellAmount: '',
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        mfProductQty: false,
        productUnit: false,
        mfProductOutCategory: false,
        reason: false,
        mfStockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'mfProductQty',
        'productUnit',
        'mfProductOutCategory',
        'mfStockOutDate',
    ])
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductOutCategoryList`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlMfProduct`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                setProductList([])
            })
    }

    const getSuppilerList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/productWiseSupplierDDL?mfProductId=${id}`, config)
            .then((res) => {
                setSuppilerList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const stockIn = async () => {
        setLoading(true)
        const newStockInData = {
            ...stockInFormData,
            autoJson: {
                recipeMaterial: recipeStockIn,
                otherExpense: recipeExpenseStockIn,
                produceProductda: recipeProductStockIn
            }
        }
        console.log("dddd", newStockInData)
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addMfProductStockInData`, newStockInData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setPage(0);
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getProductList();
                getStockInData();
                handleCloseStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }


    const stockInEdit = async () => {
        setLoading(true)
        const newStockInData = {
            ...stockInFormData,
            autoJson: {
                recipeMaterial: recipeStockIn,
                otherExpense: recipeExpenseStockIn,
                produceProductda: recipeProductStockIn
            }
        }
        console.log("dddd", newStockInData)
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateMfProductStockInData`, newStockInData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setPage(0);
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getStockInData();
                handleCloseStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const fillRecipeDataForStockIn = async (id, qty, unit, batchQty) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillRecipeeDataByQty?mfProductId=${id}&qty=${qty}&unit=${unit}&batchQty=${batchQty}`, config)
            .then((res) => {
                setRecipeStockIn(res.data.recipeMaterial);
                setRecipeExpenseStockIn(res.data.otherExpense);
                setRecipeProductStockIn(res.data.produceProductda);
                setRecipeErrorStockIn(res && res.data && res.data.recipeMaterial ? res.data.recipeMaterial?.map((data, index) => (
                    data.usedMaterial <= data.remainQty ? {
                        usedMaterial: false,
                    } : {
                        usedMaterial: true,
                    }
                )) : null)
                setRecipeErrorExpenseStockIn(res && res.data && res.data.otherExpense ? res.data.otherExpense?.map((data, index) => (
                    {
                        usedSource: false,
                    }
                )) : null)
                setRecipeErrorProductStockIn(res && res.data && res.data.produceProductda ? res.data.produceProductda?.map((data, index) => (
                    data.usedValue <= data.remainQty ? {
                        usedValue: false,
                    } : {
                        usedValue: true,
                    }
                )) : null)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const fillRecipeDataForStockInBatchWise = async (id, qty) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillRecipeeDataByBatch?mfProductId=${id}&batchQty=${qty}`, config)
            .then((res) => {
                setRecipeStockIn(res.data.recipeMaterial);
                setRecipeExpenseStockIn(res.data.otherExpense);
                setRecipeProductStockIn(res.data.produceProductda);
                setStockInFormData((perv) => ({
                    ...perv,
                    mfProductQty: res.data.batchQty,
                    mfProductUnit: res.data.batchUnit
                }))
                setStockInFormDataError((perv) => ({
                    ...perv,
                    mfProductQty: false,
                    mfProductUnit: false
                }))
                setRecipeErrorStockIn(res && res.data && res.data.recipeMaterial ? res.data.recipeMaterial?.map((data, index) => (
                    data.usedMaterial <= data.remainQty ? {
                        usedMaterial: false,
                    } : {
                        usedMaterial: true,
                    }
                )) : null)
                setRecipeErrorExpenseStockIn(res && res.data && res.data.otherExpense ? res.data.otherExpense?.map((data, index) => (
                    {
                        usedSource: false,
                    }
                )) : null)
                setRecipeErrorProductStockIn(res && res.data && res.data.produceProductda ? res.data.produceProductda?.map((data, index) => (
                    data.usedValue <= data.remainQty ? {
                        usedValue: false,
                    } : {
                        usedValue: true,
                    }
                )) : null)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const onChangeStockIn = (e) => {
        if ((e.target.name == 'mfProductQty' && stockInFormData.isAuto)) {
            setStockInFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
            fillRecipeDataForStockIn(stockInFormData.mfProductId, e.target.value, stockInFormData.mfProductUnit, stockInFormData.batchQty);
        } else if ((e.target.name == 'mfProductUnit' && stockInFormData.isAuto)) {
            setStockInFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
            fillRecipeDataForStockIn(stockInFormData.mfProductId, stockInFormData.mfProductQty, e.target.value, stockInFormData.batchQty);
        }
        else if (e.target.name == 'batchQty' && e.target.value && stockInFormData.isAuto) {
            setStockInFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
            fillRecipeDataForStockInBatchWise(stockInFormData.mfProductId, e.target.value);
        } else {
            setStockInFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const handleStockInDate = (date) => {
        console.log("stockIn", date, date && date['$d'] ? date['$d'] : null)
        setStockInFormData((prevState) => ({
            ...prevState,
            ["mfStockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["mfStockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const submitStockIn = () => {
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'mfStockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.mfStockInDate == 'Invalid Date') {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (element === 'totalPrice') {
                    if (stockInFormData.isAuto == false && (stockInFormData[element] == '' || stockInFormData[element] == 0 || stockInFormData[element] <= 0)) {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    } else {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: false
                        }))
                    }
                }
                else if (element === 'batchQty') {
                    if (stockInFormData.isAuto == true && (stockInFormData[element] == '' || stockInFormData[element] == 0 || stockInFormData[element] <= 0)) {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    } else {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: false
                        }))
                    }
                }
                else if (stockInFormDataError[element] === true || stockInFormData[element] === '' || stockInFormData[element] <= 0) {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            const isVelidate2 = recipeErrorStockIn?.filter((element, index) => {
                if (element.usedMaterial) {
                    return element;
                }
            })
            const isVelidate3 = recipeErrorProductStockIn?.filter((element, index) => {
                if (element.usedValue) {
                    return element;
                }
            })
            const isVelidate4 = recipeErrorExpenseSockIn?.filter((element, index) => {
                if (element.usedSource) {
                    return element;
                }
            })
            if (isValidate?.length > 0 || (stockInFormData.isAuto && (isVelidate2?.length > 0 || isVelidate3?.length > 0 || isVelidate4?.length > 0))) {
                console.log('invelidate', isValidate, isVelidate2, isVelidate3, isVelidate4)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockIn()
            }
        }
    }
    const submitEditStockIn = () => {
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'mfStockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.mfStockInDate == 'Invalid Date') {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (element === 'totalPrice') {
                    if (stockInFormData.isAuto == false && (stockInFormData[element] == '' || stockInFormData[element] == 0 || stockInFormData[element] <= 0)) {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    } else {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: false
                        }))
                    }
                }
                else if (element === 'batchQty') {
                    if (stockInFormData.isAuto == true && (stockInFormData[element] == '' || stockInFormData[element] == 0 || stockInFormData[element] <= 0)) {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    } else {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: false
                        }))
                    }
                }
                else if (stockInFormDataError[element] === true || stockInFormData[element] === '' || stockInFormData[element] === 0) {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            const isVelidate2 = recipeErrorStockIn?.filter((element, index) => {
                if (element.usedMaterial) {
                    return element;
                }
            })
            const isVelidate3 = recipeErrorProductStockIn?.filter((element, index) => {
                if (element.usedValue) {
                    return element;
                }
            })
            const isVelidate4 = recipeErrorExpenseSockIn?.filter((element, index) => {
                if (element.usedSource) {
                    return element;
                }
            })
            if (isValidate?.length > 0 || (stockInFormData.isAuto && (isVelidate2?.length > 0 || isVelidate3?.length > 0 || isVelidate4?.length > 0))) {
                console.log('invelidate', isValidate, isVelidate2, isVelidate3, isVelidate4)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockInEdit()
            }
        }
    }
    const handleProductNameAutoComplete = (event, value) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ['mfProductName']: value,
            mfProductId: value && value.mfProductId ? value.mfProductId : '',
        }))
        setStockInFormDataError((prevState) => ({
            ...prevState,
            mfProductName: value && value.mfProductId ? false : true
        }))
        value && value.mfProductId && getUnitForProduct(value.mfProductId);
        setStockInFormData((perv) => ({
            ...perv,
            batchQty: '',
            mfProductUnit: '',
            mfProductQty: '',
        }))
        // console.log('formddds', stockInFormData)
    }
    const handleProductNameAutoCompleteOut = (event, value) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ['mfProductName']: value,
            mfProductId: value && value.mfProductId ? value.mfProductId : '',
            remainingStock: value && value.remainingStock ? value.remainingStock : 0,
            remainingStockArray: value && value.allConversation ? value.allConversation : [],
        }))
        setStockOutFormDataError((prevState) => ({
            ...prevState,
            mfProductName: value && value.mfProductId ? false : true
        }))
        value && value.mfProductId && getDistributorList(value.mfProductId)
        value && value.mfProductId && getUnitForProduct(value.mfProductId);
        console.log('formddds', stockInFormData)
    }
    const onChangeStockOut = (e) => {
        // if (e.target.name === 'mfProductQty') {
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
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addMfProductStockOutData`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setPage(0);
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getProductList();
                getStockOutData();
                handleCloseStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const stockOutEdit = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateMfStockOutTransaction`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setPage(0);
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setIsEdit(false);
                getProductList();
                getStockOutData();
                handleCloseStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    // const stockOutEdit = async () => {
    //     await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateStockOutTransaction`, stockOutFormData, config)
    //         .then((res) => {
    //             setSuccess(true);
    //             // getData();
    //             // setTab(null)
    //             setState([
    //                 {
    //                     startDate: new Date(),
    //                     endDate: new Date(),
    //                     key: 'selection'
    //                 }
    //             ])
    //             setFilter(false);
    //             setExpanded(false);
    //             getStockOutData();
    //             handleCloseStockOut()
    //         })
    //         .catch((error) => {
    //             setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
    //         })
    // }

    const submitStockOut = () => {
        if (loading || success) {

        } else {
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'mfStockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.mfStockOutDate == 'Invalid Date') {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockOutFormData.mfProductOutCategory == 'Branch') {
                    if (!stockOutFormData.branchId || stockOutFormData.branchId == '') {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            branchId: true
                        }))
                        return element;
                    } else {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            branchId: false
                        }))
                    }
                }
                else if (stockOutFormData.mfProductOutCategory == 'Distributor') {
                    if (!stockOutFormData.distributorId || stockOutFormData.distributorId == '') {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            distributorId: true
                        }))
                        return element;
                    } else {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            distributorId: false
                        }))
                    }
                    if (!stockOutFormData.sellAmount || stockOutFormData.sellAmount == '' || stockOutFormData.sellAmount == 0) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            sellAmount: true
                        }))
                        return element;
                    } else {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            sellAmount: false
                        }))
                    }
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
                console.log('rrer', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOut()
            }
        }
    }
    const submitEditStockOut = () => {
        if (loading || success) {

        } else {
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'mfStockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.mfStockOutDate == 'Invalid Date') {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockOutFormData.mfProductOutCategory == 'Branch') {
                    if (!stockOutFormData.branchId || stockOutFormData.branchId == '') {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            branchId: true
                        }))
                        return element;
                    } else {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            branchId: false
                        }))
                    }
                }
                else if (stockOutFormData.mfProductOutCategory == 'Distributor') {
                    if (!stockOutFormData.distributorId || stockOutFormData.distributorId == '') {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            distributorId: true
                        }))
                        return element;
                    } else {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            distributorId: false
                        }))
                    }
                    if (!stockOutFormData.sellAmount || stockOutFormData.sellAmount == '' || stockOutFormData.sellAmount == 0) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            sellAmount: true
                        }))
                        return element;
                    } else {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            sellAmount: false
                        }))
                    }
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
                console.log('rrer', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOutEdit()
            }
        }
    }

    const editSubmitStockOut = () => {
        if (loading || success) {

        } else {
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'mfStockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.mfStockOutDate == 'Invalid Date') {
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
                // console.log(">>", stockInFormData, stockInFormData.mfStockInDate, stockInFormData.mfStockInDate != 'Invalid Date' ? 'ue' : 'false')
                // stockOutEdit()
            }
        }
    }

    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?&page=${1}&numPerPage=${10}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDistributorList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlDistributorData?mfProductId=${id}`, config)
            .then((res) => {
                setDdlDistributer(res.data);
            })
            .catch((error) => {
                setDdlDistributer([])
            })
    }
    const getBranchList = async () => {
        await axios.get(`${BACKEND_BASE_URL}branchrouter/getBranchList`, config)
            .then((res) => {
                setDdlBranch(res.data);
            })
            .catch((error) => {
                setDdlBranch([])
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutEditDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getUpdateStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutEditdData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getUpdateStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
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
    const stockInExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForStockin?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
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
            });
        }
    }
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
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForStockout?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForStockout?startDate=${''}&endDate=${''}`,
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
            });
        }
    }

    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeMfProductStockInData?mfStockInId=${id}`, config)
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
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeStockOutTransaction?stockOutId=${id}`, config)
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
    const getMaterialList = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRawMaterial`, config)
            .then((res) => {
                setMaterialList(res.data);
            })
            .catch((error) => {
                setMaterialList([])
            })
    }
    const getExpenseList = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlOtherSourceData`, config)
            .then((res) => {
                setOtherExpenseList(res.data);
            })
            .catch((error) => {
                setOtherExpenseList([])
            })
    }
    const gotohistory = (id) => {
        navigate(`/editHistory/${id}`)
    }
    useEffect(() => {
        getCategoryList();
        getProductList();
        getStockInData();
        getMaterialList();
        getExpenseList();
        getBranchList();
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
        setLoading(false);
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
                                        resetStockOutEdit(); getProductList();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Production</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                        setTab(2); setPage(0); setRowsPerPage(5); getStockOutData(); setFilter(false);
                                        resetStockInEdit(); getProductList();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Distribution</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                <div className='self-center justify-self-end'>
                                    {(tab === 2 || tab === '2') ? <button className='addProductBtn' onClick={handleOpenStockOut}>Supply</button> : <button className='addProductBtn' onClick={handleOpenStockIn}>Produce</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                                        <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Popover>
                                    </>
                                }
                            </div>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <button className='exportExcelBtn' onClick={() => { tab === 1 || tab === '1' ? stockInExportExcel() : stockOutExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button>
                            </div>
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
                                                        key={row.mfStockInId}
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
                                                        <TableCell align="left" onClick={() => handleAccordionOpenOnView(row)}>{row.mfProductName}</TableCell>
                                                        <TableCell align="left" onClick={() => handleAccordionOpenOnView(row)}>{row.Quantity}</TableCell>
                                                        <Tooltip title={row.mfStockInComment} placement="top-start" arrow ><TableCell align="left" onClick={() => handleAccordionOpenOnView(row)}><div className='Comment'>{row.mfStockInComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" onClick={() => handleAccordionOpenOnView(row)}>{row.mfStockInDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} isOut={false} stockInOutId={row.mfStockInId} data={row} deleteStockInOut={handleDeleteStockIn} setError={setError} />
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
                                                            key={row.mfStockOutId}
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
                                                            <TableCell align="left"  >{row.mfProductName}</TableCell>
                                                            <TableCell align="left"  >{row.Quantity}</TableCell>
                                                            <TableCell align="left" >{parseFloat(row.stockOutPrice ? row.stockOutPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                            <TableCell align="left"  >{row.stockOutCategoryName}</TableCell>
                                                            <Tooltip title={row.mfStockOutComment} placement="top-start" arrow><TableCell align="left"  ><div className='Comment'>{row.mfStockOutComment}</div></TableCell></Tooltip>
                                                            <TableCell align="left"   >{row.mfStockOutDate}</TableCell>
                                                            <TableCell align="right">
                                                                <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEditOut} isOut={true} stockInOutId={row.mfStockOutId} data={row} deleteStockInOut={handleDeleteStockOut} />
                                                            </TableCell>
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
            <Modal
                open={openStockIn}
                onClose={handleCloseStockIn}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        Produce
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            {!isEdit && !isView ?
                                <FormControl fullWidth>
                                    < Autocomplete
                                        defaultValue={null}
                                        id='stockIn'
                                        disablePortal
                                        sx={{ width: '100%' }}
                                        disabled={isEdit || isView}
                                        value={stockInFormData.mfProductName ? stockInFormData.mfProductName : null}
                                        onChange={handleProductNameAutoComplete}
                                        options={productList ? productList : []}
                                        getOptionLabel={(options) => options.mfProductName}
                                        renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Product Name" />}
                                    />
                                </FormControl>
                                :
                                <TextField
                                    value={stockInFormData.mfProductName}
                                    name="mfProductName"
                                    disabled={isView}
                                    id="outlined-required"
                                    label="Product Name"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />}
                        </div>
                        {stockInFormData.isAuto &&
                            <div className='col-span-3'>
                                <TextField
                                    onBlur={(e) => {
                                        if (e.target.value < 0) {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                batchQty: true
                                            }))
                                        }
                                        else {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                batchQty: false
                                            }))
                                        }
                                    }}
                                    type="number"
                                    label="Batch Qty"
                                    fullWidth
                                    disabled={stockInFormData.mfProductName ? false : true}
                                    onChange={onChangeStockIn}
                                    value={stockInFormData.batchQty}
                                    error={stockInFormDataError.batchQty}
                                    helperText={stockInFormDataError.batchQty ? "Enter Product Qty" : ''}
                                    name="batchQty"
                                // InputProps={{
                                //     endAdornment: <InputAdornment position="end">{stockInFormData.productUnit}</InputAdornment>,
                                // }}
                                />
                            </div>
                        }
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            mfProductQty: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            mfProductQty: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Qty"
                                fullWidth
                                disabled={isView ? true : stockInFormData.isAuto ? stockInFormData.batchQty ? false : true : false}
                                onChange={onChangeStockIn}
                                value={stockInFormData.mfProductQty}
                                error={stockInFormDataError.mfProductQty}
                                helperText={stockInFormDataError.mfProductQty ? "Enter Product Qty" : ''}
                                name="mfProductQty"
                            // InputProps={{
                            //     endAdornment: <InputAdornment position="end">{stockInFormData.productUnit}</InputAdornment>,
                            // }}
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" disabled={isView} error={stockInFormDataError.mfProductUnit}>StockIn Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={isView ? true : stockInFormData.isAuto ? stockInFormData.batchQty ? false : true : false}
                                    value={stockInFormData.mfProductUnit ? stockInFormData.mfProductUnit : ''}
                                    error={stockInFormDataError.mfProductUnit}
                                    name="mfProductUnit"
                                    label="StockIn Unit"
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                mfProductUnit: true
                                            }))
                                        }
                                        else {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                mfProductUnit: false
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
                        {
                            !stockInFormData.isAuto && <div className='col-span-3'>
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
                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                            onChangeStockIn(e)
                                        }
                                    }}
                                    value={stockInFormData.totalPrice === 'NaN' ? "" : stockInFormData.totalPrice}
                                    error={stockInFormDataError.totalPrice}
                                    helperText={stockInFormDataError.totalPrice ? "Enter Toatal Price" : ''}
                                    name="totalPrice"
                                    disabled={isView}
                                    id="outlined-required"
                                    label="Total Price"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                        }
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-2'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Stock In Date"
                                    format="DD/MM/YYYY"
                                    required
                                    disabled={isView}
                                    error={stockInFormDataError.mfStockInDate}
                                    value={stockInFormData.mfStockInDate}
                                    onChange={handleStockInDate}
                                    name="mfStockInDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className='col-span-6'>
                            <TextField
                                onChange={onChangeStockIn}
                                value={stockInFormData.mfStockInComment}
                                name="mfStockInComment"
                                id="outlined-required"
                                label="Comment"
                                disabled={isView}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControlLabel disabled={isView} control={<Checkbox name='isAuto' checked={stockInFormData.isAuto} value={stockInFormData.isAuto} onChange={() => {
                                setStockInFormData((perv) => ({
                                    ...perv,
                                    isAuto: !stockInFormData.isAuto,
                                }))
                            }} />} label="Recipe wise raw material stockOut" />
                        </div>
                    </div>
                    {
                        (stockInFormData.isAuto && (recipeStockIn && recipeStockIn.length > 0 || recipeExpenseStockIn && recipeExpenseStockIn.length > 0 || recipeProductStockIn && recipeProductStockIn.length > 0)) && <>
                            <div className='mt-4'>
                                <Typography id="modal" variant="h6" component="h2">
                                    Recipe
                                </Typography>
                            </div>
                            {/* <div className='mt-4'>Recipe</div> */}
                            <hr className='mt-2' style={{ border: '1px solid' }} />
                            {recipeStockIn && recipeStockIn.length > 0 &&
                                <>
                                    {/* <hr className='mt-6' /> */}
                                    <div className='mt-6 grid grid-cols-3 gap-6'>
                                        {
                                            recipeStockIn ? recipeStockIn?.map((data, index) => (
                                                <div className={`grid grid-cols-12 gap-6`}>
                                                    <div className='indexDisplay'>
                                                        {index + 1}
                                                    </div>
                                                    <div className='col-span-6'>
                                                        <TextField
                                                            // type='number'
                                                            // onChange={onChangeRecipe}
                                                            value={data.rawMaterialName ? data.rawMaterialName : ''}
                                                            // error={formDataError.minMfProductQty}
                                                            // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
                                                            name="rawMaterialName"
                                                            id="outlined-required"
                                                            disabled
                                                            label="Material Name"
                                                            // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                            InputProps={{ style: { fontSize: 14 } }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                    <div className='col-span-5'>
                                                        <TextField
                                                            type='text'
                                                            onChange={(e) => onChangeRecipeStockIn(e, index)}
                                                            value={data.usedMaterial ? data.usedMaterial : ''}
                                                            error={recipeErrorStockIn[index] && recipeErrorStockIn[index].usedMaterial ? true : false}
                                                            helperText={recipeErrorStockIn[index] && recipeErrorStockIn[index].usedMaterial ? "Enter Quantity" : ''}
                                                            name="usedMaterial"
                                                            id="outlined-required"
                                                            label="Qty"
                                                            disabled={isView}
                                                            // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                            InputProps={{ style: { fontSize: 14 }, endAdornment: <InputAdornment position="start">{data.rmUnit}</InputAdornment> }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                </div>
                                            )) : <></>
                                        }
                                    </div>
                                </>
                            }
                            {recipeExpenseStockIn && recipeExpenseStockIn.length > 0 &&
                                <>
                                    <hr className='mt-6' />
                                    <div className='mt-6 grid grid-cols-2 gap-6'>
                                        {
                                            recipeExpenseStockIn ? recipeExpenseStockIn?.map((data, index) => (
                                                <div className={`grid grid-cols-12 gap-6`}>
                                                    <div className='indexDisplay'>
                                                        {index + 1}
                                                    </div>
                                                    <div className='col-span-5'>
                                                        <TextField
                                                            // type='number'
                                                            // onChange={onChangeRecipe}
                                                            value={data.otherSourceName ? data.otherSourceName : ''}
                                                            // error={formDataError.minMfProductQty}
                                                            // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
                                                            name="otherSourceName"
                                                            id="outlined-required"
                                                            disabled
                                                            label="Other Expense"
                                                            InputProps={{ style: { fontSize: 14 } }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <TextField
                                                            type='text'
                                                            onChange={(e) => onChangeRecipeExpenseStockIn(e, index)}
                                                            value={data.usedSource ? data.usedSource : ''}
                                                            error={recipeErrorExpenseSockIn[index] && recipeErrorExpenseSockIn[index].usedSource ? true : false}
                                                            helperText={recipeErrorExpenseSockIn[index] && recipeErrorExpenseSockIn[index].usedSource ? "Enter Quantity" : ''}
                                                            name="usedSource"
                                                            disabled={isView}
                                                            id="outlined-required"
                                                            label="Qty"
                                                            // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                            InputProps={{ style: { fontSize: 14 }, endAdornment: <InputAdornment position="start">{data.osUnit}</InputAdornment> }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <TextField
                                                            type='text'
                                                            onChange={(e) => onChangeRecipeExpenseStockIn(e, index)}
                                                            value={data.usedPrice ? data.usedPrice : ''}
                                                            error={recipeErrorExpenseSockIn[index] && recipeErrorExpenseSockIn[index].usedPrice ? true : false}
                                                            helperText={recipeErrorExpenseSockIn[index] && recipeErrorExpenseSockIn[index].usedPrice ? "Enter Quantity" : ''}
                                                            name="usedPrice"
                                                            disabled={isView}
                                                            id="outlined-required"
                                                            label="Cost"
                                                            // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                            InputProps={{ style: { fontSize: 14 }, startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment> }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                </div>
                                            )) : <></>
                                        }
                                    </div>
                                </>
                            }
                            {recipeProductStockIn && recipeProductStockIn.length > 0 &&
                                <>
                                    <hr className='mt-6' />
                                    <div className='mt-6 grid grid-cols-2 gap-6'>
                                        {
                                            recipeProductStockIn ? recipeProductStockIn?.map((data, index) => (
                                                <div className={`grid grid-cols-12 gap-6`}>
                                                    <div className='indexDisplay'>
                                                        {index + 1}
                                                    </div>
                                                    <div className='col-span-4'>
                                                        <TextField
                                                            // type='number'
                                                            // onChange={onChangeRecipe}
                                                            value={data.mfProductName ? data.mfProductName : ''}
                                                            // error={formDataError.minMfProductQty}
                                                            // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
                                                            name="mfProductName"
                                                            id="outlined-required"
                                                            disabled
                                                            label="Product Name"
                                                            InputProps={{ style: { fontSize: 14 } }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                    <div className='col-span-4'>
                                                        <TextField
                                                            type='text'
                                                            onChange={(e) => onChangeRecipeProductStockIn(e, index)}
                                                            value={data.usedValue ? data.usedValue : ''}
                                                            error={recipeErrorProductStockIn[index] && recipeErrorProductStockIn[index].usedValue ? true : false}
                                                            helperText={recipeErrorProductStockIn[index] && recipeErrorProductStockIn[index].usedValue ? "Enter Quantity" : ''}
                                                            name="usedValue"
                                                            disabled={isView}
                                                            id="outlined-required"
                                                            label="Qty"
                                                            // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                            InputProps={{ style: { fontSize: 14 }, endAdornment: <InputAdornment position="start">{data.ppUnit}</InputAdornment> }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                    </div>
                                                </div>
                                            )) : <></>
                                        }
                                    </div>
                                </>
                            }
                            <hr className='mt-6' />
                        </>}
                    {!isView &&
                        <div className='mt-4 grid grid-cols-12 gap-6'>
                            <div className='col-start-7 col-span-3'>
                                <button className='addCategorySaveBtn' onClick={() => {
                                    isEdit ? submitEditStockIn() : submitStockIn()
                                }}>{isEdit ? 'Save' : 'Produce'}</button>
                            </div>
                            <div className='col-span-3'>
                                <button className='addCategoryCancleBtn' onClick={() => {
                                    handleCloseStockIn();
                                }}>Cancle</button>
                            </div>
                        </div>}
                </Box>
            </Modal>
            <Modal
                open={openStockOut}
                onClose={handleCloseStockOut}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='grid grid-cols-12'>
                        <div className='col-span-3'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                Stock Out
                            </Typography>
                        </div>
                        <div className='col-span-9 flex justify-end'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                Remaining Stock :- {stockOutFormData.remainingStock ? stockOutFormData.remainingStock : ''}
                            </Typography>
                        </div>
                    </div>
                    {openStockOut && stockOutFormData.mfProductName ? <>
                        <hr className='mb-3 mt-3' />
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
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            {!isEdit ?
                                <FormControl fullWidth>
                                    < Autocomplete
                                        defaultValue={null}
                                        id='stockOut'
                                        disablePortal
                                        sx={{ width: '100%' }}
                                        disabled={isEdit}
                                        value={stockOutFormData.mfProductName ? stockOutFormData.mfProductName : null}
                                        onChange={handleProductNameAutoCompleteOut}
                                        options={productList ? productList : []}
                                        getOptionLabel={(options) => options.mfProductName}
                                        renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Product Name" />}
                                    />
                                </FormControl>
                                :
                                <TextField
                                    value={stockOutFormData.mfProductName}
                                    name="mfProductName"
                                    id="outlined-required"
                                    label="Product Name"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />}
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setStockOutFormDataError((perv) => ({
                                            ...perv,
                                            mfProductQty: true
                                        }))
                                    }
                                    else {
                                        setStockOutFormDataError((perv) => ({
                                            ...perv,
                                            mfProductQty: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Qty"
                                fullWidth
                                onChange={onChangeStockOut}
                                value={stockOutFormData.mfProductQty}
                                error={stockOutFormDataError.mfProductQty}
                                helperText={stockOutFormDataError.mfProductQty ? "Please Enter Qty" : ''}
                                name="mfProductQty"
                            // InputProps={{
                            //     endAdornment: <InputAdornment position="end">{stockOutFormData.productUnit}</InputAdornment>,
                            // }
                            // }
                            />
                        </div >
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={stockOutFormDataError.productUnit}>StockOut Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockOutFormData.productUnit ? stockOutFormData.productUnit : null}
                                    error={stockOutFormDataError.productUnit}
                                    name="productUnit"
                                    label="StockOut Unit"
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                productUnit: true
                                            }))
                                        }
                                        else {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                productUnit: false
                                            }))
                                        }
                                    }}
                                    onChange={onChangeStockOut}
                                >
                                    {
                                        unitsForProduct ? unitsForProduct?.map((data) => (
                                            <MenuItem key={data.priorityNum} value={data.unitName}>{data.unitName}</MenuItem>
                                        )) : null
                                        // <MenuItem key={''} value={''}>{''}</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Stock Out Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={stockOutFormDataError.mfStockOutDate}
                                    value={stockOutFormData.mfStockOutDate}
                                    onChange={handleStockOutDate}
                                    name="mfStockOutDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />
                                    }
                                />
                            </LocalizationProvider>
                        </div>
                        <div className='col-span-9'>
                            <TextField
                                onChange={onChangeStockOut}
                                value={stockOutFormData.mfStockOutComment}
                                name="mfStockOutComment"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.mfProductOutCategory}>Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={isEdit}
                                    value={stockOutFormData.mfProductOutCategory ? stockOutFormData.mfProductOutCategory : ''}
                                    error={stockOutFormDataError.mfProductOutCategory}
                                    name="mfProductOutCategory"
                                    label="Category"
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                mfProductOutCategory: true
                                            }))
                                        }
                                        else {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                mfProductOutCategory: false
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
                        {stockOutFormData.mfProductOutCategory == 'Distributor' &&
                            <>
                                <div className='col-span-3'>
                                    <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                        <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.distributorId}>Distributor</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={stockOutFormData.distributorId ? stockOutFormData.distributorId : null}
                                            error={stockOutFormDataError.distributorId}
                                            name="distributorId"
                                            label="Distributor"
                                            onBlur={(e) => {
                                                if (!e.target.value) {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorId: true
                                                    }))
                                                }
                                                else {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorId: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChangeStockOut}
                                        >
                                            {
                                                ddlDistributer ? ddlDistributer.map((category) => (
                                                    <MenuItem key={category.distributorId} value={category.distributorId}>{category.distributorNickName}</MenuItem>
                                                )) : null
                                            }

                                        </Select>
                                    </FormControl>
                                </div>
                            </>}
                        {stockOutFormData.mfProductOutCategory == 'Branch' &&
                            <div className='col-span-3'>
                                <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                    <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.branchId}>Branches</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={stockOutFormData.branchId ? stockOutFormData.branchId : null}
                                        error={stockOutFormDataError.branchId}
                                        name="branchId"
                                        label="Branches"
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
                                        onChange={onChangeStockOut}
                                    >
                                        {
                                            ddlBranch ? ddlBranch.map((category) => (
                                                <MenuItem key={category.branchId} value={category.branchId}>{category.branchName}</MenuItem>
                                            )) : null
                                        }

                                    </Select>
                                </FormControl>
                            </div>}
                        {
                            (stockOutFormData.mfProductOutCategory == 'Distributor' || stockOutFormData.mfProductOutCategory == 'Branch') &&
                            <div className='col-span-3'>
                                <TextField
                                    onBlur={(e) => {
                                        if (e.target.value < 0) {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                sellAmount: true
                                            }))
                                        }
                                        else {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                sellAmount: false
                                            }))
                                        }
                                    }}
                                    type="text"
                                    label="Selling Price"
                                    fullWidth
                                    onChange={onChangeStockOut}
                                    value={stockOutFormData.sellAmount ? stockOutFormData.sellAmount : ''}
                                    error={stockOutFormDataError.sellAmount}
                                    helperText={stockOutFormDataError.sellAmount ? "Please Enter Price" : ''}
                                    name="sellAmount"
                                // InputProps={{
                                //     endAdornment: <InputAdornment position="end">{stockOutFormData.productUnit}</InputAdornment>,
                                // }
                                // }
                                />
                            </div >
                        }
                        {stockOutFormData.mfProductOutCategory == 'Distributor' &&
                            <div className='col-span-2'>
                                <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                    <InputLabel id="demo-simple-select-label" error={stockOutFormDataError.payType}>Payment Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue={'cash'}
                                        value={stockOutFormData.payType ? stockOutFormData.payType : 'cash'}
                                        error={stockOutFormDataError.payType}
                                        name="payType"
                                        label="Payment Type"
                                        onChange={onChangeStockOut}
                                    >
                                        <MenuItem key={'cash'} value={'cash'}>{'Cash'}</MenuItem>
                                        <MenuItem key={'debit'} value={'debit'}>{'Debit'}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        }
                    </div >
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        {isEdit &&
                            <div className='col-span-9'>
                                <TextField
                                    onChange={onChangeStockOut}
                                    value={stockOutFormData.reason}
                                    name="reason"
                                    id="outlined-required"
                                    label="Reason"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                        }
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? submitEditStockOut() : submitStockOut()
                            }}>{isEdit ? "Save" : 'Stock Out'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseStockOut();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box >
            </Modal >
        </div >
    )
}

export default StockInOutFactoryInOut;