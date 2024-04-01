import './finalProductDetails.css';
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
import Modal from '@mui/material/Modal';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import ProductQtyCountCard from '../productQtyCard/productQtyCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import MenuStockInOut from './menu';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ExportMenu from '../materialListTable/exportMenu';

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

function FinalProductDetails() {
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [productList, setProductList] = React.useState([]);
    let { id, name, unit } = useParams();
    const textFieldRef = useRef(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [stockOutData, setStockOutData] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [suppiler, setSuppilerList] = React.useState();
    const [unitPreference, setUnitPreference] = React.useState();
    const [stockInData, setStockInData] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isView, setIsView] = React.useState(false);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsDebit, setTotalRowsDebit] = React.useState(0);
    const [filter, setFilter] = React.useState(false);
    const [unitsForProduct, setUnitsForProduct] = React.useState(0);
    const [tab, setTab] = React.useState(1);
    const [recipe, setRecipe] = React.useState([]);
    const [tabStockInOut, setTabStockInOut] = React.useState(1);
    const [recipeErrorProduct, setRecipeErrorProduct] = React.useState([]);
    const [recipeErrorExpense, setRecipeErrorExpense] = React.useState([]);
    const [recipeProduct, setRecipeProduct] = React.useState([]);
    const [recipeExpense, setRecipeExpense] = React.useState([]);
    const [recipeStockIn, setRecipeStockIn] = React.useState([]);
    const [openAddRecipe, setOpenAddRecipe] = React.useState(false);
    const [recipeError, setRecipeError] = React.useState([]);
    const [statisticsCount, setStatisticsCounts] = useState();
    const [suppilerNameAndCount, setSuppilerNameAndCount] = useState();
    const [categoryNameAndCount, setCategoryNameAndCount] = useState();
    const [categories, setCategories] = React.useState();
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [materialList, setMaterialList] = React.useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [openStockIn, setOpenStockIn] = React.useState(false);
    const [recipeProductStockIn, setRecipeProductStockIn] = React.useState([]);
    const [recipeExpenseStockIn, setRecipeExpenseStockIn] = React.useState([]);
    const [recipeErrorStockIn, setRecipeErrorStockIn] = React.useState([]);
    const [recipeErrorProductStockIn, setRecipeErrorProductStockIn] = React.useState([]);
    const [recipeErrorExpenseSockIn, setRecipeErrorExpenseStockIn] = React.useState([]);
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
    const [otherExpenseList, setOtherExpenseList] = React.useState([]);
    const [unitConversation, setUnitConversation] = React.useState([]);
    const [stockInFormData, setStockInFormData] = React.useState({
        mfProductId: id,
        productName: name,
        productQty: 0,
        productUnit: unit,
        productPrice: 0,
        totalPrice: 0,
        billNumber: "",
        supplierId: "",
        stockInPaymentMethod: 'cash',
        stockInComment: "",
        stockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        totalPrice: false,
        supplierId: false,
        stockInPaymentMethod: false,
        stockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'totalPrice',
        'supplierId',
        'stockInPaymentMethod',
        'stockInDate'
    ])
    const [recipeId, setRecipeId] = React.useState({
        mfProductName: '',
        mfProductId: ''
    });
    const getMaterialList = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRawMaterial`, config)
            .then((res) => {
                setMaterialList(res.data);
            })
            .catch((error) => {
                setMaterialList([])
            })
    }
    const [stockOutFormData, setStockOutFormData] = React.useState({
        mfProductId: id,
        productQty: 0,
        productUnit: unit,
        stockOutCategory: 'Regular',
        stockOutComment: "",
        reason: "",
        stockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        productQty: false,
        reason: false,
        stockOutCategory: false,
        stockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'productQty',
        'reason',
        'stockOutCategory',
        'stockOutDate',
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
        // if (e.target.name === 'productPrice' && stockInFormData.productQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         productPrice: e.target.value,
        //         totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productQty)).toFixed(2).toString()

        //     }))
        //     if (parseFloat(e.target.value) > 0) {
        //         setStockInFormDataError((perv) => ({
        //             ...perv,
        //             totalPrice: false,
        //             productPrice: false
        //         }))
        //     }
        // } else if (e.target.name === 'totalPrice' && stockInFormData.productQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         totalPrice: e.target.value,
        //         productPrice: (parseFloat(e.target.value) / parseFloat(stockInFormData.productQty)).toFixed(2).toString()

        //     }))
        //     if (parseFloat(e.target.value) > 0) {
        //         setStockInFormDataError((perv) => ({
        //             ...perv,
        //             totalPrice: false,
        //             productPrice: false
        //         }))
        //     }
        // }
        // else if (e.target.name === 'productQty' && stockInFormData.productPrice > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         productQty: e.target.value,
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
    const handleCloseAddRecipe = () => {
        setOpenAddRecipe(false);
        setRecipeId({
            mfProductName: '',
            mfProductId: ''
        });
        setRecipe([])
        setRecipeError([])
        setRecipeProduct([])
        setRecipeErrorProduct([])
        setRecipeExpense([])
        setRecipeErrorExpense([])
        setIsEdit(false);
        getMaterialList();
        getExpenseList();
        getProductList();
    }
    const handleResetStockIn = () => {
        setStockInFormData({
            mfProductId: id,
            productName: name,
            productQty: 0,
            productUnit: unit,
            productPrice: 0,
            totalPrice: 0,
            billNumber: "",
            supplierId: "",
            stockInPaymentMethod: 'cash',
            stockInComment: "",
            stockInDate: dayjs()
        })
        setStockInFormDataError({
            productQty: false,
            productUnit: false,
            productPrice: false,
            totalPrice: false,
            supplierId: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
    }
    const handleResetStockOut = () => {
        setStockOutFormData({
            mfProductId: id,
            reason: '',
            productQty: 0,
            productUnit: unit,
            stockOutCategory: 'Regular',
            stockOutComment: "",
            stockOutDate: dayjs(),
            remainingStock: statisticsCount && statisticsCount.remainingStock ? statisticsCount.remainingStock : 0,
            remainingStockArray: statisticsCount && statisticsCount.allUnitConversation ? statisticsCount.allUnitConversation : []
        })
        setStockOutFormDataError({
            productQty: false,
            productUnit: false,
            stockOutCategory: false,
            stockInDate: false,
            reason: false
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
    const getSuppilerList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/productWiseSupplierDDL?mfProductId=${id}`, config)
            .then((res) => {
                setSuppilerList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
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
    const getMfUnitPreferenceById = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfUnitPreferenceById?mfProductId=${id}`, config)
            .then((res) => {
                setUnitPreference(res.data);
                console.log('Length', res.data, Math.ceil(res.data.length / 2))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
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
        // console.log('formddds', stockInFormData)
    }
    const handleStockInDate = (date) => {
        console.log("stockIn", date, date && date['$d'] ? date['$d'] : null)
        setStockInFormData((prevState) => ({
            ...prevState,
            ["stockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["stockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const onChangeStockOut = (e) => {
        // if (e.target.name === 'productQty') {
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
                else if (element === 'stockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.stockInDate == 'Invalid Date') {
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
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockIn()
            }
        }
    }
    const stockOut = async () => {
        setLoading(true)
        const formdata = {
            mfProductId: id,
            productQty: stockOutFormData.productQty,
            productUnit: stockOutFormData.productUnit,
            stockOutCategory: stockOutFormData.stockOutCategory,
            stockOutComment: stockOutFormData.stockOutComment,
            stockOutDate: stockOutFormData.stockOutDate,
        }
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addStockOutDetails`, formdata, config)
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
                getSuppilerNameAndCount();
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
                    if (element === 'stockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.stockOutDate == 'Invalid Date') {
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
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOut()
            }
        }
    }
    const handleCloseStockIn = () => {
        setStockInFormData({
            mfProductId: "",
            mfProductQty: 0,
            mfProductUnit: "",
            totalPrice: 0,
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
        setRecipeStockIn([])
        setRecipeExpenseStockIn([])
        setRecipeProductStockIn([])
        setRecipeErrorStockIn([])
        setRecipeErrorExpenseStockIn([])
        setRecipeErrorProductStockIn([])
        setOpenStockIn(false);
    }
    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?page=${pageNum}&numPerPage=${rowPerPageNum}&mfProductId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&mfProductId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?&page=${1}&numPerPage=${5}&mfProductId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&mfProductId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlManufactureProductData`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                setProductList([])
            })
    }
    const getMaterialListOnEdit = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRawMaterial`, config)
            .then((res) => {
                console.log('<<<<<<', res.data);
                const ids = new Set(data.map(obj => obj.materialId));
                const newData = res.data.filter(obj => !ids.has(obj.rawMaterialId));
                console.log('>>>>>', newData);
                setMaterialList(newData);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setMaterialList([])
            })
    }
    const getProductListOnEdit = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlManufactureProductData`, config)
            .then((res) => {
                const ids = new Set(data.map(obj => obj.produceProductId));
                const newData = res.data.filter(obj => !ids.has(obj.mfProductId));
                setProductList(newData);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setProductList([])
            })
    }
    const getExpenseListOnEdit = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlOtherSourceData`, config)
            .then((res) => {
                const ids = new Set(data.map(obj => obj.otherSourceId));
                const newData = res.data.filter(obj => !ids.has(obj.otherSourceId));
                setOtherExpenseList(newData);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setOtherExpenseList([])
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}&mfProductId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&mfProductId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}&mfProductId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&mfProductId=${id}`, config)
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
            mfProductId: id,
            productQty: stockInFormData.productQty,
            productUnit: stockInFormData.productUnit,
            productPrice: stockInFormData.productPrice,
            totalPrice: stockInFormData.totalPrice,
            billNumber: stockInFormData.billNumber,
            supplierId: stockInFormData.supplierId,
            stockInPaymentMethod: stockInFormData.stockInPaymentMethod,
            stockInComment: stockInFormData.stockInComment,
            stockInDate: stockInFormData.stockInDate,
        }
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addStockInDetails`, formdata, config)
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
                getSuppilerNameAndCount();
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
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeStockInTransaction?stockInId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                getStatistics();
                getStockInData();
                getSuppilerNameAndCount();
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
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeStockOutTransaction?stockOutId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                getStatistics();
                getStockOutData();
                getCategoryNameAndCount();
                getSuppilerNameAndCount();
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
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForMfStockOut?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForMfStockOut?startDate=${''}&endDate=${''}&mfProductId=${id}`,
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
    const stockInExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForMfStockIn?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForMfStockIn?startDate=${''}&endDate=${''}&mfProductId=${id}`,
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
    const stockInExportPdf = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportPdfForMfStockIn?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}` : `${BACKEND_BASE_URL}mfProductrouter/exportPdfForMfStockIn?startDate=${''}&endDate=${''}&mfProductId=${id}`,
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
            });
        }
    }
    const stockOutExportPdf = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportPdfForMfStockOut?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}` : `${BACKEND_BASE_URL}mfProductrouter/exportPdfForMfStockOut?startDate=${''}&endDate=${''}&mfProductId=${id}`,
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
            });
        }
    }


    const getCategoryList = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getStatistics = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfProductCountDetailsById?mfProductId=${id}`, config)
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
    const handleOpenEditRecipe = async (id, name) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillEditRecipeeDataById?mfProductId=${id}`, config)
            .then((res) => {
                setIsEdit(true);
                setOpenAddRecipe(true);
                setRecipeId({
                    mfProductName: name,
                    mfProductId: id,
                });
                getMaterialListOnEdit(res.data.recipeMaterial);
                getProductListOnEdit(res.data.produceProductdata);
                getExpenseListOnEdit(res.data.otherExpense);
                setRecipe(res.data.recipeMaterial);
                setRecipeError(res && res.data && res.data.recipeMaterial ? res.data.recipeMaterial?.map((data, index) => (
                    {
                        value: false,
                        unit: false
                    }
                )) : null)
                setRecipeExpense(res.data.otherExpense);
                setRecipeErrorExpense(res && res.data && res.data.otherExpense ? res.data.otherExpense?.map((data, index) => (
                    {
                        value: false,
                    }
                )) : null)
                setRecipeProduct(res.data.produceProductdata)
                setRecipeErrorProduct(res && res.data && res.data.produceProductdata ? res.data.produceProductdata?.map((data, index) => (
                    {
                        value: false,
                        unit: false
                    }
                )) : null)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getStatisticsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfProductCountDetailsById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}`, config)
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
    const getSuppilerNameAndCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistridutorWiseSellByMfProductId?mfProductId=${id}`, config)
            .then((res) => {
                setSuppilerNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getSuppilerNameAndCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistridutorWiseSellByMfProductId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}`, config)
            .then((res) => {
                setSuppilerNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCategoryNameAndCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseUsedByProduct?mfProductId=${id}`, config)
            .then((res) => {
                setCategoryNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCategoryNameAndCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseUsedByProduct?startDate=${state[0].startDate}&endDate=${state[0].endDate}&mfProductId=${id}`, config)
            .then((res) => {
                setCategoryNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const resetStockInEdit = () => {
        setStockInFormData({
            mfProductId: id,
            productName: name,
            productQty: 0,
            productUnit: unit,
            productPrice: 0,
            totalPrice: 0,
            billNumber: "",
            supplierId: "",
            stockInPaymentMethod: 'cash',
            stockInComment: "",
            stockInDate: dayjs()
        });
        setStockInFormDataError({
            totalPrice: false,
            supplierId: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
        setIsEdit(false)
    }
    const resetStockOutEdit = () => {
        setStockOutFormData({
            mfProductId: id,
            productQty: 0,
            productUnit: unit,
            stockOutCategory: 'Regular',
            stockOutComment: "",
            reason: "",
            stockOutDate: dayjs(),
            remainingStock: statisticsCount && statisticsCount.remainingStock ? statisticsCount.remainingStock : 0,
            remainingStockArray: statisticsCount && statisticsCount.allUnitConversation ? statisticsCount.allUnitConversation : []
        });
        setStockOutFormDataError({
            productQty: false,
            reason: false,
            stockOutCategory: false,
            stockOutDate: false
        })
        setIsEdit(false)
    }

    const fillStockInEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillMfProductStockInData?mfStockInId=${id}`, config)
            .then((res) => {
                setStockInFormData((perv) => ({
                    ...perv,
                    mfStockInId: id,
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
                setRecipeProductStockIn(res.data.autoJson.produceProductdata);
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
                setRecipeErrorProductStockIn(res && res.data.autoJson && res.data.autoJson.produceProductdata ? res.data.autoJson.produceProductdata?.map((data, index) => (
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
    const fillStockOutEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillStockOutTransaction?stockOutId=${id}`, config)
            .then((res) => {
                setStockOutFormData((perv) => ({
                    ...perv,
                    stockOutId: id,
                    productName: res.data,
                    mfProductId: res.data.mfProductId,
                    productQty: res.data.productQty,
                    productUnit: res.data.productUnit,
                    stockOutCategory: res.data.stockOutCategory,
                    stockOutComment: res.data.stockOutComment,
                    stockRemaining: statisticsCount.remainingStock + res.data.productQty,
                    stockOutDate: dayjs(res.data.stockOutDate),
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
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateStockInTransaction`, stockInFormData, config)
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
                getSuppilerNameAndCount();
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const stockOutEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateStockOutTransaction`, stockOutFormData, config)
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
                getSuppilerNameAndCount();
                getStockOutData();
                handleResetStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getUnitForProduct = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlUnitById?mfProductId=${id}`, config)
            .then((res) => {
                setUnitsForProduct(res.data);
                setStockInFormDataError((perv) => ({
                    ...perv,
                    productUnit: false
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
    const editSubmitStockOut = () => {
        if (loading || success) {

        } else {
            console.log('editSubmitStockOut')
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'stockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.stockOutDate == 'Invalid Date') {
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
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOutEdit()
            }
        }
    }
    const editStockIn = () => {
        console.log('editStockIn');
        const isValidate = stockInErrorFields.filter(element => {
            if (element === 'stockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.stockInDate == 'Invalid Date') {
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
            // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
            stockInEdit()
        }
    }
    useEffect(() => {
        // getCategoryList();
        getStockInData();
        getStatistics();
        getCategoryNameAndCount();
        getSuppilerNameAndCount();
        getMfUnitPreferenceById(id);
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
        <div className='suppilerListContainer'>
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
                                                        <div className='productNameHeader'>{name}</div>
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
                                                    <div className='statusTabtext'>Distributors</div>
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
                                                        getStockInData(); setPage(0); setRowsPerPage(5); getSuppilerNameAndCount(); getCategoryNameAndCount()
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
                                                                getSuppilerNameAndCountByFilter();
                                                                getCategoryNameAndCountByFilter();
                                                            }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>cancle</button>
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
                                        <CountCard color={'yellow'} count={statisticsCount && statisticsCount.minMfProductQty ? statisticsCount.minMfProductQty : 0} desc={'Min Product Qty'} productDetail={true} unitDesc={unit} />
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
                                <div className='grid grid-cols-1 gap-3 pb-3'>
                                    {
                                        suppilerNameAndCount && suppilerNameAndCount?.map((row, index) => (
                                            <ProductQtyCountCard productQtyUnit={unit} rawMaterialQty={row.remainingStock} productPrice={row.totalPrice} rawMaterialName={row.distributorNickName} index={index} />
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
                                            <div className='statusTabtext'>Production</div>
                                        </div>
                                        <div className={`flex col-span-6 justify-center ${tabStockInOut === 2 || tabStockInOut === '2' ? 'productTabIn' : 'productTab'}`}
                                            onClick={() => {
                                                setTabStockInOut(2);
                                                resetStockInEdit();
                                                setPage(0); setRowsPerPage(5);
                                                filter ? getStockOutDataByFilter() : getStockOutData();
                                            }}>
                                            <div className='statusTabtext'>Distribution</div>
                                        </div>
                                    </div>
                                </div>
                                <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                    <div className='self-center justify-self-end'>
                                        <button className='addProductBtn' onClick={() => handleOpenEditRecipe(id, name)}>View Recipe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='mt-10 grid grid-col-12'>
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
                                                name="productName"
                                                id="outlined-required"
                                                label="Product Name"
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
                                                        productQty: true
                                                    }))
                                                }
                                                else {
                                                    setStockInFormDataError((perv) => ({
                                                        ...perv,
                                                        productQty: false
                                                    }))
                                                }
                                            }}
                                            type="number"
                                            label="Qty"
                                            fullWidth
                                            onChange={onChangeStockIn}
                                            disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                            value={stockInFormData.productQty ? stockInFormData.productQty : 0}
                                            error={stockInFormDataError.productQty}
                                            helperText={stockInFormDataError.productQty ? "Enter Qty" : ''}
                                            name="productQty"
                                        // InputProps={{
                                        //     endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                                        // }}
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" error={stockInFormDataError.productUnit}>StockIn Unit</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockInFormData.productUnit ? stockInFormData.productUnit : ''}
                                                error={stockInFormDataError.productUnit}
                                                name="productUnit"
                                                label="StockIn Unit"
                                                // disabled={!stockInFormData.productName}
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            productUnit: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            productUnit: false
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
                                            value={stockInFormData.totalPrice === 'NaN' ? 0 : stockInFormData.totalPrice}
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
                                            <InputLabel id="demo-simple-select-label" required error={stockInFormDataError.supplierId}>Suppiler</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockInFormData.supplierId}
                                                error={stockInFormDataError.supplierId}
                                                name="supplierId"
                                                label="Suppiler"
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            supplierId: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            supplierId: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChangeStockIn}
                                            >
                                                {
                                                    suppiler ? suppiler.map((suppilerData) => (
                                                        <MenuItem key={suppilerData.supplierId} value={suppilerData.supplierId}>{suppilerData.supplierNickName}</MenuItem>
                                                    )) : null
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='col-span-2'>
                                        <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" error={stockInFormDataError.stockInPaymentMethod}>Payment</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockInFormData.stockInPaymentMethod}
                                                error={stockInFormDataError.stockInPaymentMethod}
                                                name="stockInPaymentMethod"
                                                label="Payment"
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            stockInPaymentMethod: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            stockInPaymentMethod: false
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
                                                error={stockInFormDataError.stockInDate}
                                                value={stockInFormData.stockInDate}
                                                onChange={handleStockInDate}
                                                name="stockInDate"
                                                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='col-span-5'>
                                        <TextField
                                            onChange={onChangeStockIn}
                                            value={stockInFormData.stockInComment}
                                            name="stockInComment"
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
                                        }}>{isEdit ? 'Cancle' : 'Reset'}</button>
                                    </div>
                                </div>
                                :
                                <div className='mt-6 grid grid-cols-12 gap-6'>
                                    <div className='col-span-3'>
                                        <FormControl fullWidth>
                                            <TextField
                                                value={name}
                                                name="productName"
                                                id="outlined-required"
                                                label="Product Name"
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
                                                        productQty: true
                                                    }))
                                                }
                                                else {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        productQty: false
                                                    }))
                                                }
                                            }}
                                            type="number"
                                            label="Qty"
                                            fullWidth
                                            onChange={onChangeStockOut}
                                            value={stockOutFormData.productQty ? stockOutFormData.productQty : 0}
                                            error={stockOutFormDataError.productQty}
                                            helperText={stockOutFormDataError.productQty ? 'Please enter Qty' : ''}
                                            name="productQty"
                                        // InputProps={{
                                        //     endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                                        // }}
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" error={stockOutFormDataError.productUnit}>StockIn Unit</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockOutFormData.productUnit ? stockOutFormData.productUnit : ''}
                                                error={stockOutFormDataError.productUnit}
                                                name="productUnit"
                                                label="StockOut Unit"
                                                // disabled={!stockOutFormData.productName}
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
                                                    )) :
                                                        <MenuItem key={''} value={''}>{''}</MenuItem>
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='col-span-3'>
                                        <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.stockOutCategory}>Category</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockOutFormData.stockOutCategory ? stockOutFormData.stockOutCategory : ''}
                                                error={stockOutFormDataError.stockOutCategory}
                                                name="stockOutCategory"
                                                label="Category"
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setStockOutFormDataError((perv) => ({
                                                            ...perv,
                                                            stockOutCategory: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockOutFormDataError((perv) => ({
                                                            ...perv,
                                                            stockOutCategory: false
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
                                    <div className='col-span-2'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                textFieldStyle={{ width: '100%' }}
                                                InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                label="Stock Out Date"
                                                format="DD/MM/YYYY"
                                                required
                                                error={stockOutFormDataError.stockOutDate}
                                                value={stockOutFormData.stockOutDate}
                                                onChange={handleStockOutDate}
                                                name="stockOutDate"
                                                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='col-span-6'>
                                        <TextField
                                            onChange={onChangeStockOut}
                                            value={stockOutFormData.stockOutComment}
                                            name="stockOutComment"
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
                                        }}>{isEdit ? "cancle" : "reset"}</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div> */}
            <div className='grid grid-cols-12 mt-12'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
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
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Qty</TableCell>
                                                <TableCell align="right">Cost Per Unit</TableCell>
                                                <TableCell align="right">Production Cost</TableCell>
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
                                                        <TableCell align="left" onClick={() => handleAccordionOpenOnView(row.mfStockInId)}>{row.mfProductName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.mfProductPrice ? row.mfProductPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.totalPrice ? row.totalPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <Tooltip title={row.mfStockInComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.mfStockInComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.mfStockInDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.mfStockInId} data={row} deleteStockInOut={handleDeleteStockIn} setError={setError} />
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
                                                        key={row.mfStockOutId}
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
                                                        <TableCell align="left" >{row.mfProductName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="left" >{parseFloat(row.mfProductOutPrice ? row.mfProductOutPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{row.stockOutCategoryName}</TableCell>
                                                        <Tooltip title={row.mfStockOutComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.mfStockOutComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.mfStockOutDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.mfStockOutId} data={row} deleteStockInOut={handleDeleteStockOut} />
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
            <Modal
                open={openAddRecipe}
                onClose={handleCloseAddRecipe}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {'Recipe'} for {recipeId.mfProductName}
                    </Typography>
                    <hr className='mt-2' />
                    {recipe && recipe.length > 0 &&
                        <>
                            <hr className='mt-6' />
                            <div className='mt-6 grid grid-cols-2 gap-6'>
                                {
                                    recipe ? recipe?.map((data, index) => (
                                        <div className={`grid grid-cols-12 gap-6`}>
                                            <div className='indexDisplay'>
                                                {index + 1}
                                            </div>
                                            <div className='col-span-4'>
                                                <TextField
                                                    // type='number'
                                                    // onChange={onChangeRecipe}
                                                    value={data.materialName ? data.materialName : ''}
                                                    // error={formDataError.minMfProductQty}
                                                    // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
                                                    name="materialName"
                                                    id="outlined-required"
                                                    disabled
                                                    label="Material Name"
                                                    // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                    InputProps={{ style: { fontSize: 14 } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className='col-span-3'>
                                                <TextField
                                                    type='number'
                                                    // onChange={(e) => onChangeRecipe(e, index)}
                                                    value={data.value ? data.value : ''}
                                                    error={recipeError[index] && recipeError[index].value ? true : false}
                                                    helperText={recipeError[index] && recipeError[index].value ? "Enter Quantity" : ''}
                                                    name="value"
                                                    id="outlined-required"
                                                    label="Qty"
                                                    disabled
                                                    InputProps={{ style: { fontSize: 14 } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className='col-span-3'>
                                                <FormControl style={{ minWidth: '100%' }}>
                                                    <InputLabel id="demo-simple-select-label" required error={recipeError[index].unit}>Units</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={data.unit ? data.unit : ''}
                                                        error={recipeError[index].unit}
                                                        name="unit"
                                                        label="Unit"
                                                        disabled
                                                    // onChange={(e) => onChangeRecipe(e, index)}
                                                    >
                                                        {
                                                            data.materialUnits ? data.materialUnits?.map((unit) => (
                                                                <MenuItem key={unit.unitName} value={unit.unitName}>{unit.unitName}</MenuItem>
                                                            )) : null
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    )) : <></>
                                }
                            </div>
                        </>
                    }
                    {recipeExpense && recipeExpense.length > 0 &&
                        <>
                            <hr className='mt-6' />
                            <div className='mt-6 grid grid-cols-2 gap-6'>
                                {
                                    recipeExpense ? recipeExpense?.map((data, index) => (
                                        <div className={`grid grid-cols-12 gap-6`}>
                                            <div className='indexDisplay'>
                                                {index + 1}
                                            </div>
                                            <div className='col-span-5'>
                                                <TextField
                                                    // type='number'
                                                    // onChange={onChangeRecipe}
                                                    value={data.expenseName ? data.expenseName : ''}
                                                    // error={formDataError.minMfProductQty}
                                                    // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
                                                    name="expenseName"
                                                    id="outlined-required"
                                                    disabled
                                                    label="Other Expense"
                                                    InputProps={{ style: { fontSize: 14 } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className='col-span-4'>
                                                <TextField
                                                    type='text'
                                                    // onChange={(e) => onChangeRecipeExpense(e, index)}
                                                    value={data.value ? data.value : ''}
                                                    error={recipeErrorExpense[index] && recipeErrorExpense[index].value ? true : false}
                                                    helperText={recipeErrorExpense[index] && recipeErrorExpense[index].value ? "Enter Quantity" : ''}
                                                    name="value"
                                                    id="outlined-required"
                                                    label="Qty"
                                                    disabled
                                                    // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                    InputProps={{ style: { fontSize: 14 }, endAdornment: <InputAdornment position="start">{data.unit}</InputAdornment> }}
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
                    {recipeProduct && recipeProduct.length > 0 &&
                        <>
                            <hr className='mt-6' />
                            <div className='mt-6 grid grid-cols-2 gap-6'>
                                {
                                    recipeProduct ? recipeProduct?.map((data, index) => (
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
                                            <div className='col-span-3'>
                                                <TextField
                                                    type='number'
                                                    // onChange={(e) => onChangeRecipeProduct(e, index)}
                                                    value={data.value ? data.value : ''}
                                                    error={recipeErrorProduct[index] && recipeErrorProduct[index].value ? true : false}
                                                    helperText={recipeErrorProduct[index] && recipeErrorProduct[index].value ? "Enter Quantity" : ''}
                                                    name="value"
                                                    id="outlined-required"
                                                    label="Qty"
                                                    disabled
                                                    InputProps={{ style: { fontSize: 14 } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className='col-span-3'>
                                                <FormControl style={{ minWidth: '100%' }}>
                                                    <InputLabel id="demo-simple-select-label" required error={recipeErrorProduct[index].unit}>Units</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={data.unit ? data.unit : ''}
                                                        error={recipeErrorProduct[index].unit}
                                                        name="unit"
                                                        label="Unit"
                                                        disabled
                                                    // onChange={(e) => onChangeRecipeProduct(e, index)}
                                                    >
                                                        {
                                                            data.productUnits ? data.productUnits?.map((unit) => (
                                                                <MenuItem key={unit.unitName} value={unit.unitName}>{unit.unitName}</MenuItem>
                                                            )) : null
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    )) : <></>
                                }
                            </div>
                        </>
                    }
                </Box>
            </Modal>
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
                                disabled={isView}
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
                                    disabled={isView}
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
                                    value={stockInFormData.totalPrice === 'NaN' ? 0 : stockInFormData.totalPrice}
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
                                                            // onChange={(e) => onChangeRecipeExpenseStockIn(e, index)}
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
                                                            // onChange={(e) => onChangeRecipeExpenseStockIn(e, index)}
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
                                                            // onChange={(e) => onChangeRecipeProductStockIn(e, index)}
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
                        </>}
                </Box>
            </Modal>
        </div >
    )
}

export default FinalProductDetails;