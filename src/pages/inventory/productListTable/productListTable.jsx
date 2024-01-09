import './productListTable.css';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
// import ProductCard from './component/productCard/productCard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";
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
import Tooltip from '@mui/material/Tooltip';
import Menutemp from './menu';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';

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

const units = [
    'Kg',
    'Gm',
    'Ltr',
    'Mtr',
    'Pkts',
    'BOX',
    'ML',
    'Qty',
    'Piece',
    'glass',
    'crate',
    'cartoon',
    'Num'
]
function ProductListTable() {
    const regex = /^\d*(?:\.\d*)?$/;
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F10') {
                handleOpen()
                console.log('Enter key pressed');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [qtyUnit, setQtyUnit] = useState([
        'Kg',
        'Gm',
        'Ltr',
        'Mtr',
        'Pkts',
        'BOX',
        'ML',
        'Qty',
        'Piece',
        'Num',
        'glass',
        'crate',
        'cartoon',
    ])
    const [searchWord, setSearchWord] = React.useState('');
    const [openViewDetail, setOpenViewDetail] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [unitConversation, setUnitConversation] = React.useState([]);
    const [unitConversationError, setUnitConversationError] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalRows, setTotalRows] = React.useState(0);
    const [unitsForProduct, setUnitsForProduct] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const [viewData, setViewData] = React.useState({});

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [formData, setFormData] = React.useState({
        productCategoryId: '',
        productName: '',
        minProductQty: '',
        minProductUnit: '',
        leadTime: '',
        isExpired: false,
        expiredDays: '',
        isFactoryMade: false
    })
    const [stockInFormData, setStockInFormData] = React.useState({
        productId: "",
        productQty: 0,
        productUnit: "",
        totalPrice: 0,
        billNumber: "",
        supplierId: "",
        stockInPaymentMethod: 'cash',
        stockInComment: "",
        // stockInDate: null
        stockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        productQty: false,
        productUnit: false,
        totalPrice: false,
        supplierId: false,
        productUnit: false,
        stockInPaymentMethod: false,
        stockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'productQty',
        'productUnit',
        'totalPrice',
        'supplierId',
        'productUnit',
        'stockInPaymentMethod',
        'stockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        productId: "",
        productQty: 0,
        productUnit: "",
        stockOutCategory: 'Regular',
        stockOutComment: "",
        stockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        productQty: false,
        productUnit: false,
        stockOutCategory: false,
        stockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'productQty',
        'productUnit',
        'stockOutCategory',
        'stockOutDate',
    ])
    const [tab, setTab] = React.useState(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [formDataError, setFormDataError] = useState({
        productName: false,
        minProductQty: false,
        minProductUnit: false,
        expiredDays: false,
        productCategoryId: false,
    })
    const [fields, setFields] = useState([
        'productName',
        'minProductQty',
        'minProductUnit',
        'isExpired',
        'productCategoryId'
    ])

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [openM, setOpenM] = React.useState(false);
    const [openStockIn, setOpenStockIn] = React.useState(false);
    const [openStockOut, setOpenStockOut] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [allData, setAllData] = React.useState();
    const [suppiler, setSuppilerList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [categoryList, setCategoryList] = React.useState();
    const [countData, setCountData] = React.useState();
    const getSuppilerList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/productWiseSupplierDDL?productId=${id}`, config)
            .then((res) => {
                setSuppilerList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const getUnitForProduct = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlUnitById?productId=${id}`, config)
            .then((res) => {
                setUnitsForProduct(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const getMainCategory = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockInCategory`, config)
            .then((res) => {
                setCategoryList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const handleCloseViewDatail = () => {
        setOpenViewDetail(false);
        setViewData({});
    }
    const onChange = (e) => {
        console.log('unitConversation', unitConversation)
        if ([e.target.name] == 'minProductUnit') {
            let qtySmall = qtyUnit.filter((data) => (data !== e.target.value));
            formData.minProductUnit && qtySmall.push(formData.minProductUnit)
            console.log('leftArray', qtySmall)
            setQtyUnit(qtySmall)
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                'smallUnitName': e.target.value,
            }))
            setUnitConversation([])
            setUnitConversationError([])
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const onChangeUnit = (e, index) => {
        setUnitConversation(prev =>
            prev.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: e.target.value } : user
            )
        );
        setUnitConversationError(perv =>
            perv.map((user, idx) =>
                idx === index ? { ...user, unitNumber: e.target.value > 1 ? false : true } : user,
                // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
            ))
    }
    const deleteUnitConvrsation = (indexToDelete) => {
        setQtyUnit(unitConversation.length > 1 ?
            [...qtyUnit, unitConversation[indexToDelete].bigUnitName] :
            [...qtyUnit, unitConversation[indexToDelete].bigUnitName, unitConversation[indexToDelete].smallUnitName]
        )
        if (unitConversation.length > 1) {
            setFormData((perv) => (
                {
                    ...perv,
                    smallUnitName: unitConversation[indexToDelete].smallUnitName
                }
            ))
        }
        else {
            setFormData((perv) => (
                {
                    ...perv,
                    smallUnitName: formData.minProductUnit
                }
            ))
        }
        const updatedData = unitConversation.filter((_, index) => index !== indexToDelete);
        const updatedData2 = unitConversationError.filter((_, index) => index !== indexToDelete);
        setUnitConversation(updatedData)
        setUnitConversationError(updatedData2)
    }
    const onChangeStockIn = (e) => {
        // if (e.target.name === 'productPrice' && stockInFormData.productQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         productPrice: e.target.value,
        //         totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productQty)).toFixed(2).toString()

        //     }))
        // } else if (e.target.name === 'totalPrice' && stockInFormData.productQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         totalPrice: e.target.value,
        //         productPrice: (parseFloat(e.target.value) / parseFloat(stockInFormData.productQty)).toFixed(2).toString()

        //     }))
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
        // console.log('formddds', stockInFormData)
    }
    const onChangeStockOut = (e) => {
        // if (e.target.name === 'productQty') {
        //     if (e.target.value > stockOutFormData.remainingStock) {
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
    const handleOpen = () => setOpenM(true);
    const handleOpenStockIn = (row) => {
        getSuppilerList(row.productId);
        getUnitForProduct(row.productId)
        setStockInFormData((perv) => ({
            ...perv,
            productId: row.productId,
            productName: row.productName,
            productUnit: row.minProductUnit
        }))
        setOpenStockIn(true);
    }
    const handleOpenStockOut = (row) => {
        getCategoryList();
        getUnitForProduct(row.productId)
        setStockOutFormData((perv) => ({
            ...perv,
            productId: row.productId,
            productName: row.productName,
            productUnit: row.minProductUnit,
            remainingStock: row.remainingStock,
            remainingStockArray: row.allConversation,
        }))
        setOpenStockOut(true);
    }
    const handleCloseDate = () => {
        setAnchorEl(null);
    };
    const handleReset = () => {
        setFormData({
            productCategoryId: '',
            productName: '',
            minProductQty: '',
            minProductUnit: '',
            leadTime: '',
            isExpired: false,
            expiredDays: '',
            isFactoryMade: false
        });
        setFormDataError({
            productName: false,
            minProductQty: false,
            minProductUnit: false,
            expiredDays: false,
            productCategoryId: false,
        });
        setUnitConversation([]);
        setUnitConversationError([]);
        setIsEdit(false);
    }
    const handleClose = () => {
        setOpenM(false);
        // setCategory('');
        // setCategoryError(false);
        setFormData({
            stockOutCategoryName: '',
            stockOutCategoryId: ''
        });
        setIsEdit(false);
    }
    const handleCloseStockIn = () => {
        setStockInFormData({
            productId: "",
            productQty: 0,
            productUnit: "",
            totalPrice: 0,
            billNumber: "",
            supplierId: "",
            stockInPaymentMethod: 'cash',
            stockInComment: "",
            // stockInDate: null
            stockInDate: dayjs()
        })
        setStockInFormDataError({
            productQty: false,
            productUnit: false,
            totalPrice: false,
            supplierId: false,
            productUnit: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
        setOpenStockIn(false);
    }
    const handleStockInDate = (date) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ["stockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };

    const handleCloseStockOut = () => {
        setStockOutFormData({
            productId: "",
            productQty: 0,
            productUnit: "",
            stockOutCategory: 'Regular',
            stockOutComment: "",
            stockOutDate: dayjs()
        })
        setStockOutFormDataError({
            productQty: false,
            productUnit: false,
            stockOutCategory: false,
            stockInDate: false
        })
        setOpenStockOut(false);
    }
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["stockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleOpenViewDetail = (data) => {
        setOpenViewDetail(true);
        setViewData(data)
    }
    const getAllData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?productStatus=${tab}&page=${1}&numPerPage=${10}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    const getAllDataByTab = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?productStatus=${tab}&page=${1}&numPerPage=${10}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    const getAllDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productStatus=${tab}&page=${1}&numPerPage=${10}&searchProduct=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    const getCountData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductListCounter`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const autoStockOut = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/addAutoStoctOutDetails`, config)
            .then((res) => {
                console.log('success')
            })
            .catch((error) => {
                console.log(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeProduct?productId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setTab('')
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getCountData();
                getAllData('');

            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getAllData();
        getMainCategory();
        getCountData();
        autoStockOut();
    }, [])
    const handleDeleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete Product?")) {
            deleteData(id);
            setTimeout(() => {
                setTab(null)
                getAllData()
                getCountData();
            }, 1000)
        }
    }
    const editCategory = async () => {
        setLoading(true)
        const combinedData = { ...formData, priorityArray: unitConversation }
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateProduct`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                setTab('');
                setFormData({
                    productCategoryId: '',
                    productName: '',
                    minProductQty: '',
                    minProductUnit: '',
                    leadTime: '',
                    isExpired: false,
                    expiredDays: '',
                    isFactoryMade: false
                });
                setFormDataError({
                    productName: false,
                    minProductQty: false,
                    minProductUnit: false,
                    expiredDays: false,
                    productCategoryId: false,
                });
                setUnitConversation([]);
                setUnitConversationError([]);
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
                getAllData();
                getCountData();
                handleClose()
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })

    }
    const addProduct = async () => {
        setLoading(true)
        const combinedData = { ...formData, priorityArray: unitConversation }
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addProduct`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                getAllData();
                setTab(null);
                getCountData();
                handleReset();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const stockIn = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockInDetails`, stockInFormData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setTab('')
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
                getCountData();
                getAllData('');
                handleCloseStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const stockOut = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockOutDetails`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                setTab('')
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
                getCountData();
                getAllData('');
                handleCloseStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const submitEdit = () => {
        if (loading || success) {

        } else {
            const isValidate = fields.filter(element => {
                if (element === 'isExpired') {
                    if (formData.isExpired && (formData.expiredDays <= 0 || !formData.expiredDays)) {
                        setFormDataError((perv) => ({
                            ...perv,
                            expiredDays: true
                        }))
                        return element;
                    }
                } else if (formDataError[element] === true || formData[element] === '' || formData[element] === 0 || !formData[element]) {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            const isVelidate2 = unitConversation.filter((element, index) => {
                if (element.unitNumber <= 1 || element.unitNumber == '' || !element.unitNumber) {
                    setUnitConversationError(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, unitNumber: true } : user,
                        ))
                    return element;
                }
            })
            if (isValidate.length > 0 || isVelidate2.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                editCategory()
            }
        }
    }
    const onAdd = (e) => {

        if (formData.bigUnitName && formData.smallUnitName) {
            if (unitConversation.length == 0) {
                setUnitConversation([{
                    bigUnitName: formData.bigUnitName,
                    smallUnitName: formData.smallUnitName,
                }])
                setUnitConversationError([{
                    unitNumber: false
                }])
                const qtySmall = qtyUnit.filter((data) => (data !== formData.smallUnitName && data !== formData.bigUnitName));
                setQtyUnit(qtySmall);
                setFormData((perv) => ({
                    ...perv,
                    bigUnitName: null,
                    smallUnitName: formData.bigUnitName
                }))
            } else {
                setUnitConversation([
                    ...unitConversation,
                    {
                        bigUnitName: formData.bigUnitName,
                        smallUnitName: formData.smallUnitName,
                    }
                ])
                setUnitConversationError([
                    ...unitConversationError,
                    {
                        unitNumber: false
                    }
                ])
                const qtySmall = qtyUnit.filter((data) => data !== formData.bigUnitName);
                setQtyUnit(qtySmall);
                setFormData((perv) => ({
                    ...perv,
                    bigUnitName: null,
                    smallUnitName: formData.bigUnitName
                }))
            }
        }
    }
    const submitAdd = () => {
        if (loading || success) {

        } else {
            const isValidate = fields.filter(element => {
                if (element === 'isExpired') {
                    if (formData.isExpired && (formData.expiredDays <= 0 || !formData.expiredDays)) {
                        setFormDataError((perv) => ({
                            ...perv,
                            expiredDays: true
                        }))
                        return element;
                    }
                } else if (formDataError[element] === true || formData[element] === '' || formData[element] === 0 || !formData[element]) {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            const isVelidate2 = unitConversation.filter((element, index) => {
                if (element.unitNumber <= 1 || element.unitNumber == '' || !element.unitNumber) {
                    setUnitConversationError(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, unitNumber: true } : user,
                        ))
                    return element;
                }
            })
            if (isValidate.length > 0 || isVelidate2.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addProduct()
            }
            // addProduct()
        }
    }
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
    }

    const submitStockIn = () => {
        if (loading || success) {

        } else {
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
                console.log('invelidate', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockIn()
            }
        }
    }
    const submitStockOut = () => {
        if (loading || success) {

        } else {
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
                stockOut()
            }
        }
    }
    const getEditFillData = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsById?productId=${id}`, config)
            .then((res) => {
                const { priorityArray, ...updatedData } = res.data;
                const transformedArray = priorityArray.map(() => ({ unitNumber: false }));


                // let qtySmall = qtyUnit.filter((data) => (data !== e.target.value));
                // console.log('leftArray', qtySmall)
                const elementsToRemove = res.data && res.data.unitArr ? res.data.unitArr : []
                const qtySmall = units.filter(item => !elementsToRemove.includes(item));
                setQtyUnit(qtySmall)

                setFormData({
                    ...updatedData,
                    smallUnitName: res.data && res.data.unitArr ? res.data.unitArr[res.data.unitArr.length - 1] : '',
                })

                setUnitConversation(res.data.priorityArray);
                setUnitConversationError(transformedArray);
                setOpenM(true);
                setIsEdit(true);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleEditClick = (row) => {
        getEditFillData(row.productId);
        // setFormData({
        //     productName: row.productName,
        //     productId: row.productId,
        //     minProductQty: row.minProductQty,
        //     minProductUnit: row.minProductUnit
        // })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const getAllDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?page=${pageNum}&numPerPage=${rowPerPageNum}&productStatus=${tab}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getAllDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&productStatus=${tab}&searchProduct=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3') {
            getAllDataOnPageChange(newPage + 1, rowsPerPage)
        } else {
            if (filter) {
                getAllDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getAllDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3') {
            getAllDataOnPageChange(1, parseInt(event.target.value, 10))
        } else {
            if (filter) {
                getAllDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getAllDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const productExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForProductTable?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Products_' + new Date().toLocaleDateString() + '.xlsx'
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
    const handleViewDetail = (id, name, unit, remainingQty) => {
        navigate(`/productDetails/${id}/${name}/${unit}/${remainingQty}`)
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
    const search = async (searchWord) => {
        await axios.get(filter ? `${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productStatus=${tab}&page=${1}&numPerPage=${10}&searchProduct=${searchWord}` : `${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?productStatus=${tab}&page=${1}&numPerPage=${10}&searchProduct=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
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

    const handleSearch = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        search(document.getElementById('searchWord').value)
    }

    const debounceFunction = React.useCallback(debounce(handleSearch), [])

    return (
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTab('');
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        setFilter(false);
                                        getAllDataByTab('');
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>All</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === null || tab === '' || !tab ? 'blueCount' : ''} `}>{countData && countData.allProduct ? countData.allProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabIn' : 'productTab'} `} onClick={() => {
                                        setTab(1);
                                        setFilter(false);
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        getAllDataByTab(1);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>In-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 1 || tab === '1' ? 'greenCount' : ''} `}>{countData && countData.instockProduct ? countData.instockProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabUnder' : 'productTab'} `} onClick={() => {
                                        setTab(2);
                                        setFilter(false);
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        getAllDataByTab(2);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Low-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 2 || tab === '2' ? 'orangeCount' : ''} `}>{countData && countData.underStockedProduct ? countData.underStockedProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'} `} onClick={() => {
                                        setTab(3);
                                        setFilter(false);
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        getAllDataByTab(3);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Out-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 3 || tab === '3' ? 'redCount' : ''} `}>{countData && countData.outOfStock ? countData.outOfStock : 0}</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Product</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <div className='productCardContainer mt-8 gap-6 grid mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8'>
                {
                    data ? data.map((product) => (
                        <ProductCard productData={product} handleViewDetail={handleViewDetail} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
                    ))
                        :
                        <div className='grid col-span-5 content-center'>
                            <div className='text-center noDataFoundText'>
                                {error ? error : 'No Data Found'}
                            </div>
                        </div>
                }
            </div> */}
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='ml-6 col-span-5' >
                                {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null
                                    :
                                    <div className='flex'>
                                        <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0] && state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0] && state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='resetBtnWrap col-span-3'>
                                            <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'} `} onClick={() => {
                                                setFilter(false);
                                                setPage(0);
                                                setSearchWord('')
                                                setRowsPerPage(10);
                                                getAllDataByTab('');
                                                setState([
                                                    {
                                                        startDate: new Date(),
                                                        endDate: new Date(),
                                                        key: 'selection'
                                                    }
                                                ])
                                            }}><CloseIcon /></button>
                                        </div>
                                    </div>}


                                <Popover
                                    id={id}
                                    open={open}
                                    style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                    anchorEl={anchorEl}
                                    onClose={handleCloseDate}
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
                                                <button className='stockInBtn' onClick={() => { getAllDataByFilter(); setTab(''); setFilter(true); setPage(0); setRowsPerPage(10); handleCloseDate() }}>Apply</button>
                                            </div>
                                            <div className='col-span-3'>
                                                <button className='stockOutBtn' onClick={handleCloseDate}>cancle</button>
                                            </div>
                                        </div>
                                    </Box>
                                </Popover>
                            </div>
                            {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null :
                                <div className='col-span-3'>
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
                                </div>}
                            <div className='col-span-4 col-start-9 pr-5 flex justify-end'>
                                {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null : <button className='exportExcelBtn' onClick={productExportExcel}><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>}
                            </div>
                        </div>
                        {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell align="left">Remaining Stock</TableCell>
                                                {/* <TableCell align="left">Last StockedIn</TableCell> */}
                                                {/* <TableCell align="left">Last Price</TableCell> */}
                                                <TableCell align="left">Min. Product Qty</TableCell>
                                                <TableCell align="left">Status</TableCell>
                                                {/* <TableCell align="left">LastIn Date</TableCell> */}
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.productId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>
                                                            {row.productName}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.remainingStock}</TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.lastUpdatedQty}</TableCell> */}
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{parseFloat(row.lastPrice ? row.lastPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.minProductQty}</TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}><div className={row.stockStatus == 'In-Stock' ? 'greenStatus' : row.stockStatus == 'Low-Stock' ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.lastUpdatedStockInDate}</TableCell> */}
                                                        <TableCell align="right">
                                                            <Menutemp productId={row.productId} data={row} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
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
                                        rowsPerPageOptions={[10, 25, 50]}
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
                                                <TableCell>Product Name</TableCell>
                                                <TableCell align="left">Total StockIn</TableCell>
                                                {/* <TableCell align="left">Total Expense</TableCell> */}
                                                <TableCell align="left">Total Used</TableCell>
                                                {/* <TableCell align="left">Value of used</TableCell> */}
                                                <TableCell align="left">Remaining Stock</TableCell>
                                                {/* <TableCell align="left">Value of Remaining</TableCell> */}
                                                {/* <TableCell align="left">Min ProductQty</TableCell> */}
                                                <TableCell align="start">Status</TableCell>
                                                {/* <TableCell align="left">LastIn Date</TableCell> */}
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.productId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" onClick={() => handleOpenViewDetail(row)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        {/* <Tooltip title={row.productName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" onClick={() => handleOpenViewDetail(row)}>
                                                            {row.productName}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.purchese} </TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{parseFloat(row.totalExpense ? row.totalExpense : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        {/* <Tooltip title={row.stockOutComment} placement="top-start" arrow> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}><div className='Comment'>{row.totalUsed} </div></TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{parseFloat(row.totalStockOutPrice ? row.totalStockOutPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.remainingStock} </TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{parseFloat(row.remainPrice ? row.remainPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.minProductQty} </TableCell> */}
                                                        <TableCell align="center" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}><div className={row.stockStatus == 'In-Stock' ? 'greenStatus' : row.stockStatus == 'Low-Stock' ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}>{row.lastUpdatedStockInDate}</TableCell> */}
                                                        <TableCell align="right">
                                                            <Menutemp productId={row.productId} data={row} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
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
                                        rowsPerPageOptions={[10, 25, 50]}
                                        component="div"
                                        count={totalRows}
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
            <Modal
                open={openM}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Product' : 'Add Product'}
                    </Typography>
                    <hr className='mt-2' />
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value.length || e.target.value.length < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            productName: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            productName: false
                                        }))
                                    }
                                }}
                                onChange={onChange}
                                value={formData.productName ? formData.productName : ''}
                                error={formDataError.productName}
                                inputRef={textFieldRef}
                                helperText={formDataError.productName ? "Please Enter Product Name" : ''}
                                name="productName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value.length || e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            minProductQty: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            minProductQty: false
                                        }))
                                    }
                                }}
                                type='number'
                                onChange={onChange}
                                value={formData.minProductQty ? formData.minProductQty : ''}
                                error={formDataError.minProductQty}
                                helperText={formDataError.minProductQty ? "Enter Quantity" : ''}
                                name="minProductQty"
                                id="outlined-required"
                                label="Min Qty"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-2'>
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.minProductUnit}>Units</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.minProductUnit ? formData.minProductUnit : ''}
                                    error={formDataError.minProductUnit}
                                    name="minProductUnit"
                                    label="Units"
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                minProductUnit: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                minProductUnit: false
                                            }))
                                        }
                                    }}
                                    onChange={onChange}
                                >
                                    {
                                        units ? units.map((unit) => (
                                            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                        )) : null
                                    }

                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.productCategoryId}>Category</InputLabel>
                                <Select
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                productCategoryId: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                productCategoryId: false
                                            }))
                                        }
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.productCategoryId ? formData.productCategoryId : ''}
                                    error={formDataError.productCategoryId}
                                    name="productCategoryId"
                                    label="Category"
                                    onChange={onChange}
                                >
                                    {
                                        categoryList ? categoryList.map((data) => (
                                            <MenuItem key={data.stockInCategoryId} value={data.stockInCategoryId}>{data.stockInCategoryName}</MenuItem>
                                        )) : null
                                    }

                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                type='number'
                                onChange={onChange}
                                value={formData.leadTime ? formData.leadTime : ''}
                                name="leadTime"
                                id="outlined-required"
                                label="Lead Time"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-2'>
                            <FormControlLabel control={<Checkbox name='isFactoryMade' checked={formData.isFactoryMade} value={formData.isFactoryMade} onChange={() => {
                                setFormData((perv) => ({
                                    ...perv,
                                    isFactoryMade: !formData.isFactoryMade,
                                }))
                            }} />} label="Is Factory Product" />
                        </div>
                        <div className=''>
                            <FormControlLabel control={<Checkbox name='isExpired' checked={formData.isExpired} value={formData.isExpired} onChange={() => {
                                setFormData((perv) => ({
                                    ...perv,
                                    isExpired: !formData.isExpired,
                                }))
                                setFormDataError((perv) => ({
                                    ...perv,
                                    expiredDays: false
                                }))
                            }} />} label="Expires" />
                        </div>
                        {
                            formData.isExpired ?
                                <div className='col-span-2'>
                                    <TextField
                                        type='number'
                                        onChange={onChange}
                                        value={formData.expiredDays ? formData.expiredDays : ''}
                                        error={formDataError.expiredDays}
                                        helperText={formDataError.expiredDays ? "Enter Days" : ''}
                                        name="expiredDays"
                                        id="outlined-required"
                                        label="Days"
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div> :
                                <div className='col-span-2'>
                                </div>
                        }
                    </div>
                    <hr className='mt-3 mb-3' />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Unit Conversion
                    </Typography>
                    <hr className='mt-3' />
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-5 addUnitBox'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <FormControl style={{ minWidth: '100%' }}>
                                        <InputLabel id="demo-simple-select-label">Larger Unit</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.bigUnitName ? formData.bigUnitName : ''}
                                            name="bigUnitName"
                                            label="Larger Unit"
                                            onChange={onChange}
                                        >
                                            {
                                                qtyUnit ? qtyUnit.map((unit) => (
                                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                                )) : null
                                            }

                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        // type='number'
                                        // onChange={onChange}
                                        value={formData.smallUnitName ? formData.smallUnitName : ''}
                                        // error={formDataError.minProductQty}
                                        // helperText={formDataError.minProductQty ? "Enter Quantity" : ''}
                                        name="smallUnitName"
                                        id="outlined-required"
                                        label="Smaller Unit"
                                        disabled
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        onAdd()
                                    }}>{'Add'}</button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-7'>
                            {
                                unitConversation ? unitConversation?.map((data, index) => (
                                    <div className={`grid grid-cols-12 gap-6 ${index == 0 ? '' : 'mt-4'}`}>
                                        <div className='indexDisplay'>
                                            {index + 1}
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                // type='number'
                                                // onChange={onChange}
                                                value={data.bigUnitName ? data.bigUnitName : ''}
                                                // error={formDataError.minProductQty}
                                                // helperText={formDataError.minProductQty ? "Enter Quantity" : ''}
                                                name="bigUnitName"
                                                id="outlined-required"
                                                disabled
                                                label="Large Unit"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <TextField
                                                type='number'
                                                onChange={(e) => onChangeUnit(e, index)}
                                                value={data.unitNumber ? data.unitNumber : ''}
                                                error={unitConversationError[index] && unitConversationError[index].unitNumber ? true : false}
                                                helperText={unitConversationError[index] && unitConversationError[index].unitNumber ? "Enter Quantity" : ''}
                                                name="unitNumber"
                                                id="outlined-required"
                                                label="Qty"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                // type='number'
                                                // onChange={onChange}
                                                value={data.smallUnitName ? data.smallUnitName : ''}
                                                // error={formDataError.minProductQty}
                                                // helperText={formDataError.minProductQty ? "Enter Quantity" : ''}
                                                name="smallUnitName"
                                                id="outlined-required"
                                                label="Small Unit"
                                                disabled
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        {index + 1 == unitConversation.length &&
                                            <div className='col-span-2 flex'>
                                                <button className='redDeleteBtn self-center' onClick={() => {
                                                    deleteUnitConvrsation(index);
                                                }}><DeleteForeverIcon fontSize='large' /></button>
                                            </div>
                                        }
                                    </div>
                                )) : <></>
                            }
                        </div>
                    </div>
                    <hr className='mt-6' />
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? submitEdit() : submitAdd()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose();
                                handleReset();
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openStockIn}
                onClose={handleCloseStockIn}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        Stock In
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                value={stockInFormData.productName}
                                name="productName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
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
                                value={stockInFormData.productQty}
                                error={stockInFormDataError.productQty}
                                helperText={stockInFormDataError.productQty ? "Enter Product Qty" : ''}
                                name="productQty"
                            // InputProps={{
                            //     endAdornment: <InputAdornment position="end">{stockInFormData.productUnit}</InputAdornment>,
                            // }}
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.productUnit}>StockIn Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockInFormData.productUnit ? stockInFormData.productUnit : null}
                                    error={stockInFormDataError.productUnit}
                                    name="productUnit"
                                    label="StockIn Unit"
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
                        <div className='col-span-3'>
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
                                id="outlined-required"
                                label="Total Price"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
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
                        <div className='col-span-4'>
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
                        <div className='col-span-3'>
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
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
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
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitStockIn()
                            }}>Stock In</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseStockIn();
                            }}>Cancle</button>
                        </div>
                    </div>
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
                    {openStockOut && stockOutFormData.productName ? <>
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
                            <TextField
                                value={stockOutFormData.productName}
                                name="productName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
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
                                value={stockOutFormData.productQty}
                                error={stockOutFormDataError.productQty}
                                helperText={stockOutFormDataError.productQty ? "Please Enter Qty" : ''}
                                name="productQty"
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
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.stockOutCategory}>Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockOutFormData.stockOutCategory}
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
                        <div className='col-span-3'>
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
                        <div className='col-span-9'>
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
                    </div >
                    <div className='mt-4 grid grid-cols-12 gap-6'>

                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitStockOut()
                            }}>Stock Out</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseStockOut();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box >
            </Modal >
            <Modal
                open={openViewDetail}
                onClose={handleCloseViewDatail}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <div className='productNameDetail'>
                            {viewData.productName}
                        </div>
                        <button className='closeBtnModal' onClick={handleCloseViewDatail}><CloseIcon /></button>
                    </div>
                    <hr className='mt-3' />
                    <div className='detailsData grid grid-cols-12 gap-6'>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Min Product Qty :
                            </div>
                            <div className='col-span-8'>
                                {viewData.minProductQty} {viewData.minProductUnit}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Lead Time :
                            </div>
                            <div className='col-span-8'>
                                {viewData.leadTime}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Last StockIn Price:
                            </div>
                            <div className='col-span-8'>
                                <CurrencyRupeeIcon /> {parseFloat(viewData.lastPrice ? viewData.lastPrice : 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Last StockIn At:
                            </div>
                            <div className='col-span-8'>
                                {viewData.lastUpdatedStockInDate}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                StockIn :
                            </div>
                            <div className='col-span-8'>
                                {viewData.purchese}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Cost :
                            </div>
                            <div className='col-span-8'>
                                <CurrencyRupeeIcon /> {parseFloat(viewData.totalExpense ? viewData.totalExpense : 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Used :
                            </div>
                            <div className='col-span-8'>
                                {viewData.totalUsed}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Cost :
                            </div>
                            <div className='col-span-8'>
                                <CurrencyRupeeIcon /> {parseFloat(viewData.totalStockOutPrice ? viewData.totalStockOutPrice : 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Remaining :
                            </div>
                            <div className='col-span-8'>
                                {viewData.remainingStock}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Cost :
                            </div>
                            <div className='col-span-8'>
                                <CurrencyRupeeIcon /> {parseFloat(viewData.remainPrice ? viewData.remainPrice : 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                </Box >
            </Modal >
            <ToastContainer />
        </div >
    )
}
export default ProductListTable;
