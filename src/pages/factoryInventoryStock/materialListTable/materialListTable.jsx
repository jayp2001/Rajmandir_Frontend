import './materialListTable.css';
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
    width: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function MaterialListTableStock() {
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
    const [qtyUnit, setQtyUnit] = useState([])
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
        rawMaterialCategoryId: '',
        rawMaterialName: '',
        minRawMaterialQty: '',
        minRawMaterialUnit: '',
        leadTime: '',
        isExpired: false,
        expiredDays: '',
        isSupplayBranch: false,
        isQtyNum: false
    })
    const [stockInFormData, setStockInFormData] = React.useState({
        rawMaterialId: "",
        rawMaterialQty: '',
        rawMaterialUnit: "",
        totalPrice: "",
        billNumber: "",
        rmSupplierId: "",
        rmStockInPaymentMethod: 'cash',
        rmStockInComment: "",
        // rmStockInDate: null
        rmStockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        rawMaterialQty: false,
        rawMaterialUnit: false,
        totalPrice: false,
        rmSupplierId: false,
        rawMaterialUnit: false,
        rmStockInPaymentMethod: false,
        rmStockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'rawMaterialQty',
        'rawMaterialUnit',
        'totalPrice',
        'rmSupplierId',
        'rawMaterialUnit',
        'rmStockInPaymentMethod',
        'rmStockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        rawMaterialId: "",
        rawMaterialQty: "",
        rawMaterialUnit: "",
        rmStockOutCategory: 'Regular',
        rmStockOutComment: "",
        rmStockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        rawMaterialQty: false,
        rawMaterialUnit: false,
        rmStockOutCategory: false,
        rmStockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'rawMaterialQty',
        'rawMaterialUnit',
        'rmStockOutCategory',
        'rmStockOutDate',
    ])
    const [tab, setTab] = React.useState(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [formDataError, setFormDataError] = useState({
        rawMaterialName: false,
        minRawMaterialQty: false,
        minRawMaterialUnit: false,
        expiredDays: false,
        rawMaterialCategoryId: false,
        productCategoryId: false,
    })
    const [fields, setFields] = useState([
        'rawMaterialName',
        'minRawMaterialQty',
        'minRawMaterialUnit',
        'isExpired',
        'rawMaterialCategoryId',
        'isSupplayBranch'
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
    const [supplier, setSupplierList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [ddlBranch, setddlBranch] = React.useState();
    const [categoryList, setCategoryList] = React.useState();
    const [branchCategoryList, setBranchCategoryList] = React.useState([]);
    const [countData, setCountData] = React.useState();
    const [units, setUnits] = useState([])
    const getUnits = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUnit`, config)
            .then((res) => {
                setUnits(res.data);
                setQtyUnit(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
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
    const getUnitForProduct = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRmUnitById?rawMaterialId=${id}`, config)
            .then((res) => {
                setUnitsForProduct(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const getMainCategory = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRmStockInCategory`, config)
            .then((res) => {
                setCategoryList(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
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
    const getDDLBranchList = async () => {
        await axios.get(`${BACKEND_BASE_URL}branchrouter/getBranchList`, config)
            .then((res) => {
                setddlBranch(res.data);
            })
            .catch((error) => {
                setddlBranch(['No Data'])
            })
    }
    const getBranchCategoryList = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockInCategory`, config)
            .then((res) => {
                setBranchCategoryList(res.data);
            })
            .catch((error) => {
                setBranchCategoryList(['No Data'])
            })
    }
    const handleCloseViewDatail = () => {
        setOpenViewDetail(false);
        setViewData({});
    }
    const onChange = (e) => {
        console.log('unitConversation', unitConversation)
        if ([e.target.name] == 'minRawMaterialUnit') {
            let qtySmall = units.filter((data) => (data !== e.target.value));
            formData.minRawMaterialUnit && qtySmall.push(formData.minRawMaterialUnit)
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
                    smallUnitName: formData.minRawMaterialUnit
                }
            ))
        }
        const updatedData = unitConversation.filter((_, index) => index !== indexToDelete);
        const updatedData2 = unitConversationError.filter((_, index) => index !== indexToDelete);
        setUnitConversation(updatedData)
        setUnitConversationError(updatedData2)
    }
    const onChangeStockIn = (e) => {
        // if (e.target.name === 'productPrice' && stockInFormData.rawMaterialQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         productPrice: e.target.value,
        //         totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.rawMaterialQty)).toFixed(2).toString()

        //     }))
        // } else if (e.target.name === 'totalPrice' && stockInFormData.rawMaterialQty > 0) {
        //     setStockInFormData((prevState) => ({
        //         ...prevState,
        //         totalPrice: e.target.value,
        //         productPrice: (parseFloat(e.target.value) / parseFloat(stockInFormData.rawMaterialQty)).toFixed(2).toString()

        //     }))
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
        // console.log('formddds', stockInFormData)
    }
    const onChangeStockOut = (e) => {
        // if (e.target.name === 'rawMaterialQty') {
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
        getSupplierList(row.rawMaterialId);
        getUnitForProduct(row.rawMaterialId)
        setStockInFormData((perv) => ({
            ...perv,
            rawMaterialId: row.rawMaterialId,
            rawMaterialName: row.rawMaterialName,
            rawMaterialUnit: row.minRawMaterialUnit
        }))
        setOpenStockIn(true);
    }
    const handleOpenStockOut = (row) => {
        getCategoryList(row.isSupplyBranch);
        getUnitForProduct(row.rawMaterialId)
        setStockOutFormData((perv) => ({
            ...perv,
            rawMaterialId: row.rawMaterialId,
            rawMaterialName: row.rawMaterialName,
            rawMaterialUnit: row.minRawMaterialUnit,
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
            rawMaterialCategoryId: '',
            rawMaterialName: '',
            minRawMaterialQty: '',
            minRawMaterialUnit: '',
            leadTime: '',
            isExpired: false,
            expiredDays: '',
            isSupplayBranch: false,
            isQtyNum: false
        });
        setFormDataError({
            rawMaterialName: false,
            minRawMaterialQty: false,
            minRawMaterialUnit: false,
            expiredDays: false,
            rawMaterialCategoryId: false,
            productCategoryId: false,
        });
        setQtyUnit(units)
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
            rawMaterialId: "",
            rawMaterialQty: "",
            rawMaterialUnit: "",
            totalPrice: "",
            billNumber: "",
            rmSupplierId: "",
            rmStockInPaymentMethod: 'cash',
            rmStockInComment: "",
            // rmStockInDate: null
            rmStockInDate: dayjs()
        })
        setStockInFormDataError({
            rawMaterialQty: false,
            rawMaterialUnit: false,
            totalPrice: false,
            rmSupplierId: false,
            rawMaterialUnit: false,
            rmStockInPaymentMethod: false,
            rmStockInDate: false
        })
        setOpenStockIn(false);
    }
    const handleStockInDate = (date) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ["rmStockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };

    const handleCloseStockOut = () => {
        setStockOutFormData({
            rawMaterialId: "",
            rawMaterialQty: "",
            rawMaterialUnit: "",
            rmStockOutCategory: 'Regular',
            rmStockOutComment: "",
            rmStockOutDate: dayjs()
        })
        setStockOutFormDataError({
            rawMaterialQty: false,
            rawMaterialUnit: false,
            rmStockOutCategory: false,
            rmStockInDate: false
        })
        setOpenStockOut(false);
    }
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["rmStockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleOpenViewDetail = (data) => {
        setOpenViewDetail(true);
        setViewData(data)
    }
    const getAllData = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?rawMaterialStatus=${tab}&page=${1}&numPerPage=${10}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?rawMaterialStatus=${tab}&page=${1}&numPerPage=${10}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialStatus=${tab}&page=${1}&numPerPage=${10}&searchRawMaterial=${searchWord}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialListCounter`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    // const autoStockOut = async () => {
    //     await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/addAutoStoctOutDetails`, config)
    //         .then((res) => {
    //             console.log('success')
    //         })
    //         .catch((error) => {
    //             console.log(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}rawMaterialrouter/removeRawMaterial?rawMaterialId=${id}`, config)
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
        getUnits();
        // autoStockOut();
        getDDLBranchList();
        getBranchCategoryList();
    }, [])
    const handleDeleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete Material?")) {
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
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/updateRawMaterial`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                setTab('');
                setFormData({
                    rawMaterialCategoryId: '',
                    rawMaterialName: '',
                    minRawMaterialQty: '',
                    minRawMaterialUnit: '',
                    leadTime: '',
                    isExpired: false,
                    expiredDays: '',
                    isSupplayBranch: false,
                    isQtyNum: false
                });
                setFormDataError({
                    rawMaterialName: false,
                    minRawMaterialQty: false,
                    minRawMaterialUnit: false,
                    expiredDays: false,
                    rawMaterialCategoryId: false,
                    productCategoryId: false
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
    const addRawMaterial = async () => {
        setLoading(true)
        const combinedData = { ...formData, priorityArray: unitConversation }
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRawMaterial`, combinedData, config)
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
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRawMaterialStockInDetails`, stockInFormData, config)
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
        await axios.post(`${BACKEND_BASE_URL}rawMaterialrouter/addRmStockOutDetails`, stockOutFormData, config)
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
                } else if (element === 'isSupplayBranch') {
                    if (formData.isSupplayBranch && (!formData.productCategoryId)) {
                        setFormDataError((perv) => ({
                            ...perv,
                            productCategoryId: true
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
                } else if (element === 'isSupplayBranch') {
                    if (formData.isSupplayBranch && (!formData.productCategoryId)) {
                        setFormDataError((perv) => ({
                            ...perv,
                            productCategoryId: true
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
                addRawMaterial()
            }
            // addRawMaterial()
        }
    }
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
    }

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
                console.log('invelidate', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockIn()
            }
        }
    }
    const submitStockOut = () => {
        if (loading || success) {

        } else {
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'rmStockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.rmStockOutDate == 'Invalid Date') {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                } else if (element == 'rmStockOutCategory') {
                    if (stockOutFormData.rmStockOutCategory == 'Branch' && !stockOutFormData.branchId) {
                        console.log("LLKK");
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            branchId: true
                        }))
                        return element;
                    } else if (stockOutFormDataError[element] === true || stockOutFormData[element] === '' || stockOutFormData[element] === 0) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
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
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.rmStockInDate, stockInFormData.rmStockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOut()
            }
        }
    }
    const getEditFillData = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialDetailsById?rawMaterialId=${id}`, config)
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
        getEditFillData(row.rawMaterialId);
        // setFormData({
        //     rawMaterialName: row.rawMaterialName,
        //     rawMaterialId: row.rawMaterialId,
        //     minRawMaterialQty: row.minRawMaterialQty,
        //     minRawMaterialUnit: row.minRawMaterialUnit
        // })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const getAllDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?page=${pageNum}&numPerPage=${rowPerPageNum}&rawMaterialStatus=${tab}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getAllDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&rawMaterialStatus=${tab}&searchRawMaterial=${searchWord}`, config)
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
                url: filter ? `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}rawMaterialrouter/exportExcelSheetForProductTable?startDate=${''}&endDate=${''}`,
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
            }).catch((error) => {
                setError("Error No Data...!!!")
            })
        }
    }
    const handleViewDetail = (id, name, unit, remainingQty, status) => {
        navigate(`/stock/material/materialDetails/${id}/${name}/${unit}/${remainingQty}/${status == 0 || !status ? false : true}`)
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
        await axios.get(filter ? `${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&rawMaterialStatus=${tab}&page=${1}&numPerPage=${10}&searchRawMaterial=${searchWord}` : `${BACKEND_BASE_URL}rawMaterialrouter/getRawMaterialTable?rawMaterialStatus=${tab}&page=${1}&numPerPage=${10}&searchRawMaterial=${searchWord}`, config)
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
                                        <div className='statusTabtext'>All</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === null || tab === '' || !tab ? 'blueCount' : ''} `}>{countData && countData.allRawMaterial ? countData.allRawMaterial : 0}</div>
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
                                        <div className='statusTabtext'>Low-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 2 || tab === '2' ? 'orangeCount' : ''} `}>{countData && countData.underStockedRawMaterial ? countData.underStockedRawMaterial : 0}</div>
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
                        </div>

                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null :
                                <div className='col-span-3 ml-6'>
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
                            {/* <div className='col-span-4 col-start-9 pr-5 flex justify-end'>
                                {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null : <button className='exportExcelBtn' onClick={productExportExcel}><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button>}
                            </div> */}
                        </div>
                        {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Material Name</TableCell>
                                                <TableCell align="left">Remaining Stock</TableCell>
                                                <TableCell align="left">Remaining Stock In All Unit</TableCell>
                                                <TableCell align="left">Min. Material Qty</TableCell>
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
                                                        key={row.rawMaterialId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>
                                                            {row.rawMaterialName}
                                                        </TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>{row.remainingStock}</TableCell>
                                                        <TableCell align="left" style={{ maxWidth: '300px' }} onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>{row.allConversation.map((data, index) => (
                                                            <span>&nbsp;&nbsp; {data.unitName} : {data.value} ,</span>
                                                        ))} </TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>{row.minRawMaterialQty} {row.minRawMaterialUnit}</TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}><div className={row.stockStatus == 'In-Stock' ? 'greenStatus' : row.stockStatus == 'Low-Stock' ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
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
                                                <TableCell>Material Name</TableCell>
                                                <TableCell align="left">Remaining Stock</TableCell>
                                                <TableCell align="left">Remaining Stock In All Unit</TableCell>
                                                <TableCell align="start">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.rawMaterialId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        {/* <Tooltip title={row.rawMaterialName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>
                                                            {row.rawMaterialName}
                                                        </TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>{row.remainingStock} </TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}>{row.allConversation.map((data, index) => (
                                                            <span>&nbsp;&nbsp; {data.unitName} : {data.value} ,</span>
                                                        ))} </TableCell>
                                                        <TableCell align="center" onClick={() => handleViewDetail(row.rawMaterialId, row.rawMaterialName, row.minRawMaterialUnit, row.remainingStock, row.isSupplyBranch)}><div className={row.stockStatus == 'In-Stock' ? 'greenStatus' : row.stockStatus == 'Low-Stock' ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
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
                        {isEdit ? 'Edit Material' : 'Add Material'}
                    </Typography>
                    <hr className='mt-2' />
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value.length || e.target.value.length < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            rawMaterialName: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            rawMaterialName: false
                                        }))
                                    }
                                }}
                                onChange={onChange}
                                value={formData.rawMaterialName ? formData.rawMaterialName : ''}
                                error={formDataError.rawMaterialName}
                                inputRef={textFieldRef}
                                helperText={formDataError.rawMaterialName ? "Please Enter Material Name" : ''}
                                name="rawMaterialName"
                                id="outlined-required"
                                label="Material Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onChange={onChange}
                                value={formData.gujaratiRawMaterialName ? formData.gujaratiRawMaterialName : ''}
                                name="gujaratiRawMaterialName"
                                id="outlined-required"
                                label="પ્રોડક્ટનું નામ"
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
                                            minRawMaterialQty: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            minRawMaterialQty: false
                                        }))
                                    }
                                }}
                                type='number'
                                onChange={onChange}
                                value={formData.minRawMaterialQty ? formData.minRawMaterialQty : ''}
                                error={formDataError.minRawMaterialQty}
                                helperText={formDataError.minRawMaterialQty ? "Enter Quantity" : ''}
                                name="minRawMaterialQty"
                                id="outlined-required"
                                label="Min Qty"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-2'>
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.minRawMaterialUnit}>Units</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.minRawMaterialUnit ? formData.minRawMaterialUnit : ''}
                                    error={formDataError.minRawMaterialUnit}
                                    name="minRawMaterialUnit"
                                    label="Units"
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                minRawMaterialUnit: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                minRawMaterialUnit: false
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
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.rawMaterialCategoryId}>Category</InputLabel>
                                <Select
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                rawMaterialCategoryId: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                rawMaterialCategoryId: false
                                            }))
                                        }
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.rawMaterialCategoryId ? formData.rawMaterialCategoryId : ''}
                                    error={formDataError.rawMaterialCategoryId}
                                    name="rawMaterialCategoryId"
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
                        <div className='col-span-3'>
                            <FormControlLabel control={<Checkbox name='isSupplayBranch' checked={formData.isSupplayBranch} value={formData.isSupplayBranch} onChange={() => {
                                setFormData((perv) => ({
                                    ...perv,
                                    isSupplayBranch: !formData.isSupplayBranch,
                                }))
                                setFormDataError((perv) => ({
                                    ...perv,
                                    isSupplayBranch: false
                                }))
                            }} />} label="Is supplied to branch?" />
                        </div>
                        {
                            formData.isSupplayBranch ?
                                <div className='col-span-3'>
                                    <FormControl style={{ minWidth: '100%' }}>
                                        <InputLabel id="demo-simple-select-label" required error={formDataError.productCategoryId}>Branch Category</InputLabel>
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
                                            label="Branch Category"
                                            onChange={onChange}
                                        >
                                            {
                                                branchCategoryList ? branchCategoryList.map((data) => (
                                                    <MenuItem key={data.stockInCategoryId} value={data.stockInCategoryId}>{data.stockInCategoryName}</MenuItem>
                                                )) : null
                                            }

                                        </Select>
                                    </FormControl>
                                </div> : <></>
                        }
                        <div className='col-span-3'>
                            <FormControlLabel control={<Checkbox name='isQtyNum' checked={formData.isQtyNum} value={formData.isQtyNum} onChange={() => {
                                setFormData((perv) => ({
                                    ...perv,
                                    isQtyNum: !formData.isQtyNum,
                                }))
                            }} />} label="is Used as Per Production Qty?" />
                        </div>
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
                                        // error={formDataError.minRawMaterialQty}
                                        // helperText={formDataError.minRawMaterialQty ? "Enter Quantity" : ''}
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
                                                // error={formDataError.minRawMaterialQty}
                                                // helperText={formDataError.minRawMaterialQty ? "Enter Quantity" : ''}
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
                                                // error={formDataError.minRawMaterialQty}
                                                // helperText={formDataError.minRawMaterialQty ? "Enter Quantity" : ''}
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
                            }}>Cancel</button>
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
                                value={stockInFormData.rawMaterialName}
                                name="rawMaterialName"
                                id="outlined-required"
                                label="Material Name"
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
                                value={stockInFormData.rawMaterialQty}
                                error={stockInFormDataError.rawMaterialQty}
                                helperText={stockInFormDataError.rawMaterialQty ? "Enter Material Qty" : ''}
                                name="rawMaterialQty"
                            // InputProps={{
                            //     endAdornment: <InputAdornment position="end">{stockInFormData.rawMaterialUnit}</InputAdornment>,
                            // }}
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.rawMaterialUnit}>StockIn Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockInFormData.rawMaterialUnit ? stockInFormData.rawMaterialUnit : null}
                                    error={stockInFormDataError.rawMaterialUnit}
                                    name="rawMaterialUnit"
                                    label="StockIn Unit"
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
                                value={stockInFormData.totalPrice === 'NaN' ? '' : stockInFormData.totalPrice}
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
                        <div className='col-span-3'>
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
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
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
                            }}>Cancel</button>
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
                    {openStockOut && stockOutFormData.rawMaterialName ? <>
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
                                value={stockOutFormData.rawMaterialName}
                                name="rawMaterialName"
                                id="outlined-required"
                                label="Material Name"
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
                                value={stockOutFormData.rawMaterialQty}
                                error={stockOutFormDataError.rawMaterialQty}
                                helperText={stockOutFormDataError.rawMaterialQty ? "Please Enter Qty" : ''}
                                name="rawMaterialQty"
                            // InputProps={{
                            //     endAdornment: <InputAdornment position="end">{stockOutFormData.rawMaterialUnit}</InputAdornment>,
                            // }
                            // }
                            />
                        </div >
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={stockOutFormDataError.rawMaterialUnit}>StockOut Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockOutFormData.rawMaterialUnit ? stockOutFormData.rawMaterialUnit : null}
                                    error={stockOutFormDataError.rawMaterialUnit}
                                    name="rawMaterialUnit"
                                    label="StockOut Unit"
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
                                        )) : null
                                        // <MenuItem key={''} value={''}>{''}</MenuItem>
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
                                    onChange={(e) => {
                                        onChangeStockOut(e); setStockOutFormDataError((perv) => ({
                                            ...perv,
                                            branchId: false,
                                        }))
                                    }}
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
                        <div className='col-span-3'>
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
                        <div className='col-span-9'>
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
                            }}>Cancel</button>
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
                        <div className='rawMaterialNameDetail'>
                            {viewData.rawMaterialName}
                        </div>
                        <button className='closeBtnModal' onClick={handleCloseViewDatail}><CloseIcon /></button>
                    </div>
                    <hr className='mt-3' />
                    <div className='detailsData grid grid-cols-12 gap-6'>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Min Material Qty :
                            </div>
                            <div className='col-span-8'>
                                {viewData.minRawMaterialQty} {viewData.minRawMaterialUnit}
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
                    <hr className='mb-3 mt-6' />
                    <div className='grid gap-6 grid-cols-12'>
                        {
                            viewData.allConversation ? viewData.allConversation?.map((row, index) => (
                                <div className='col-span-3 unitName'>
                                    {row.unitName} : {row.value}
                                </div>
                            )) : <></>
                        }
                    </div>
                    <hr className='mt-3' />
                </Box >
            </Modal >
            <ToastContainer />
        </div >
    )
}
export default MaterialListTableStock;
