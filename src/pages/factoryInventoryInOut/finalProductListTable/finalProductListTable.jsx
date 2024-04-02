import './finalProductListTable.css';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
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
import { validateDate } from '@mui/x-date-pickers/internals';

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

function FinalProductListTableInOut() {
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
    const [materialList, setMaterialList] = React.useState([]);
    const [productList, setProductList] = React.useState([]);
    const [otherExpenseList, setOtherExpenseList] = React.useState([]);
    const [unitConversation, setUnitConversation] = React.useState([]);
    const [recipe, setRecipe] = React.useState([]);
    const [recipeProduct, setRecipeProduct] = React.useState([]);
    const [recipeExpense, setRecipeExpense] = React.useState([]);
    const [recipeStockIn, setRecipeStockIn] = React.useState([]);
    const [recipeProductStockIn, setRecipeProductStockIn] = React.useState([]);
    const [recipeExpenseStockIn, setRecipeExpenseStockIn] = React.useState([]);
    const [recipeError, setRecipeError] = React.useState([]);
    const [recipeErrorProduct, setRecipeErrorProduct] = React.useState([]);
    const [recipeErrorExpense, setRecipeErrorExpense] = React.useState([]);
    const [recipeErrorStockIn, setRecipeErrorStockIn] = React.useState([]);
    const [recipeErrorProductStockIn, setRecipeErrorProductStockIn] = React.useState([]);
    const [recipeErrorExpenseSockIn, setRecipeErrorExpenseStockIn] = React.useState([]);
    const [unitConversationError, setUnitConversationError] = React.useState([]);
    const [batchFormData, setBatchFormData] = React.useState({
        batchQty: '',
        batchUnit: ''
    });
    const [batchFormDataError, setBatchFormDataError] = React.useState({
        batchQty: false,
    });
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalRows, setTotalRows] = React.useState(0);
    const [unitsForProduct, setUnitsForProduct] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const [viewData, setViewData] = React.useState({});

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [selectedMaterial, setSelectedMaterial] = useState({
        materialName: null,
        units: []
    });
    const [selectedProduct, setSelectedProduct] = useState({
        mfProductName: null,
        units: []
    });
    const [selectedExpense, setSelectedExpense] = useState({
        expenseName: '',
        expense: null,
        unit: ''
    });
    const [formData, setFormData] = React.useState({
        productCategoryId: '',
        gujaratiProductName: '',
        productName: '',
        minProductQty: '',
        minProductUnit: '',
        productionTime: '',
        isExpired: false,
        expiredDays: '',
    })
    const [stockInFormData, setStockInFormData] = React.useState({
        mfProductId: "",
        mfProductQty: "",
        mfProductUnit: "",
        totalPrice: "",
        mfStockInComment: "",
        mfStockInDate: dayjs(),
        isAuto: true,
        batchQty: ""
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        mfProductQty: false,
        mfProductUnit: false,
        totalPrice: false,
        mfStockInDate: false,
        batchQty: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'mfProductQty',
        'mfProductUnit',
        'totalPrice',
        'mfStockInDate',
        'batchQty'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
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
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        mfProductQty: false,
        productUnit: false,
        mfProductOutCategory: false,
        mfStockOutDate: false,
        branchId: false,
        outDataId: false,
        distributorId: false,
        sellAmount: false,
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'mfProductQty',
        'productUnit',
        'mfProductOutCategory',
        'mfStockOutDate',
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
    const [openAddRecipe, setOpenAddRecipe] = React.useState(false);
    const [recipeId, setRecipeId] = React.useState({
        mfProductName: '',
        mfProductId: ''
    });
    const [openStockIn, setOpenStockIn] = React.useState(false);
    const [openStockOut, setOpenStockOut] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [allData, setAllData] = React.useState();
    const [supplier, setSupplierList] = React.useState();
    const [categories, setCategories] = React.useState([]);
    const [ddlDistributer, setDdlDistributer] = React.useState([]);
    const [ddlBranch, setDdlBranch] = React.useState([]);
    const [categoryList, setCategoryList] = React.useState();
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
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/productWiseSupplierDDL?mfProductId=${id}`, config)
            .then((res) => {
                setSupplierList(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const getUnitForProduct = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlmfProductUnitById?mfProductId=${id}`, config)
            .then((res) => {
                setUnitsForProduct(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const getUnitForProductRecipe = async (id, value) => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRmUnitById?rawMaterialId=${id}`, config)
            .then((res) => {
                // setUnitsForProduct(res.data);
                setSelectedMaterial({
                    materialName: value,
                    units: res.data
                })
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const getUnitForProductRecipeProduct = async (id, value) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlmfProductUnitById?mfProductId=${id}`, config)
            .then((res) => {
                setSelectedProduct({
                    mfProductName: value,
                    units: res.data
                })
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const getMainCategory = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockInCategory`, config)
            .then((res) => {
                setCategoryList(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
    }
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductOutCategoryList`, config)
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
    const getMaterialList = async () => {
        await axios.get(`${BACKEND_BASE_URL}rawMaterialrouter/ddlRawMaterial`, config)
            .then((res) => {
                setMaterialList(res.data);
            })
            .catch((error) => {
                setMaterialList([])
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
    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlManufactureProductData`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                setProductList([])
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
    const onChange = (e) => {
        console.log('unitConversation', unitConversation)
        if ([e.target.name] == 'minProductUnit') {
            let qtySmall = units.filter((data) => (data !== e.target.value));
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
    const onChangeRecipe = (e, index) => {
        setRecipe(prev =>
            prev.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: e.target.value } : user
            )
        );
        setRecipeError(perv =>
            perv.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: (e.target.value > 0 || e.target.value ? false : true) } : user,
                // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
            ))
        console.log("addRecipeData", recipe, recipeError)
    }
    const onChangeRecipeExpense = (e, index) => {
        setRecipeExpense(prev =>
            prev.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: e.target.value } : user
            )
        );
        setRecipeErrorExpense(perv =>
            perv.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: (e.target.value > 0 || e.target.value ? false : true) } : user,
                // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
            ))
        // console.log("addRecipeData", recipe, recipeError)
    }
    const onChangeRecipeProduct = (e, index) => {
        setRecipeProduct(prev =>
            prev.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: e.target.value } : user
            )
        );
        setRecipeErrorProduct(perv =>
            perv.map((user, idx) =>
                idx === index ? { ...user, [e.target.name]: (e.target.value > 0 || e.target.value ? false : true) } : user,
                // console.log('unit check', e.target.value > 1 ? false : true, e.target.value)
            ))
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
    const deleteMaterial = (indexToDelete) => {
        setMaterialList([
            ...materialList,
            recipe[indexToDelete].materialObject
        ])
        const updatedRecipe = recipe.filter((_, index) => index !== indexToDelete);
        const updatedRecipe2 = recipeError.filter((_, index) => index !== indexToDelete);
        setRecipe(updatedRecipe)
        setRecipeError(updatedRecipe2)
    }
    const deleteExpense = (indexToDelete) => {
        setOtherExpenseList([
            ...otherExpenseList,
            recipeExpense[indexToDelete].expenseObject
        ])
        const updatedRecipe = recipeExpense.filter((_, index) => index !== indexToDelete);
        const updatedRecipe2 = recipeErrorExpense.filter((_, index) => index !== indexToDelete);
        setRecipeExpense(updatedRecipe)
        setRecipeErrorExpense(updatedRecipe2)
    }
    const deleteProduct = (indexToDelete) => {
        setProductList([
            ...productList,
            recipeProduct[indexToDelete].productObject
        ])
        const updatedRecipe = recipeProduct.filter((_, index) => index !== indexToDelete);
        const updatedRecipe2 = recipeErrorProduct.filter((_, index) => index !== indexToDelete);
        setRecipeProduct(updatedRecipe)
        setRecipeErrorProduct(updatedRecipe2)
    }
    const handleMaterialNameAutoComplete = (event, value) => {
        value && value.rawMaterialId && getUnitForProductRecipe(value.rawMaterialId, value);
    }
    const handleProductNameAutoComplete = (event, value) => {
        value && value.mfProductId && getUnitForProductRecipeProduct(value.mfProductId, value);
    }
    const handleExpenseNameAutoComplete = (event, value) => {
        setSelectedExpense({
            expense: value,
            units: []
        })
        // value && value.mfProductId && getUnitForProductRecipe(value.mfProductId, value);
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
    const onChangeStockOut = (e) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
        // }
    }
    const handleOpen = () => setOpenM(true);
    const handleOpenAddRecipe = (id, name, unit) => {
        setOpenAddRecipe(true); setRecipeId({
            mfProductName: name,
            mfProductId: id
        });
        setBatchFormData({
            batchQty: '',
            batchUnit: unit
        })
    }
    const fillRecipeDataForStockIn = async (id, qty, unit, batchQty) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillRecipeeDataByQty?mfProductId=${id}&batchQty=${batchQty}&unit=${unit}&qty=${qty}`, config)
            .then((res) => {
                setRecipeStockIn(res.data.recipeMaterial);
                setRecipeExpenseStockIn(res.data.otherExpense);
                setRecipeProductStockIn(res.data.produceProductdata);
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
                setRecipeErrorProductStockIn(res && res.data && res.data.produceProductdata ? res.data.produceProductdata?.map((data, index) => (
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
                setRecipeProductStockIn(res.data.produceProductdata);
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
                setRecipeErrorProductStockIn(res && res.data && res.data.produceProductdata ? res.data.produceProductdata?.map((data, index) => (
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
    const handleOpenEditRecipe = async (id, name, unit) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/fillEditRecipeeDataById?mfProductId=${id}`, config)
            .then((res) => {
                setIsEdit(true);
                setOpenAddRecipe(true);
                setRecipeId({
                    mfProductName: name,
                    mfProductId: id,
                });
                setBatchFormData({
                    batchQty: res.data.batchQty,
                    batchUnit: unit
                });
                setBatchFormDataError({
                    batchQty: false
                })
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
                setAllData(null)
            })
    }
    const handleOpenStockIn = (row) => {
        getUnitForProduct(row.mfProductId)
        setStockInFormData((perv) => ({
            ...perv,
            mfProductId: row.mfProductId,
            mfProductName: row.mfProductName,
            mfProductUnit: row.mfProductUnit,
            isAuto: true
        }))
        setOpenStockIn(true);
    }
    const handleOpenStockOut = (row) => {
        getCategoryList();
        getDistributorList(row.mfProductId)
        getUnitForProduct(row.mfProductId)
        setStockOutFormData((perv) => ({
            ...perv,
            mfProductId: row.mfProductId,
            mfProductName: row.mfProductName,
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
            gujaratiProductName: '',
            productName: '',
            minProductQty: '',
            minProductUnit: '',
            productionTime: '',
            isExpired: false,
            expiredDays: '',
        });
        setFormDataError({
            productName: false,
            minProductQty: false,
            minProductUnit: false,
            expiredDays: false,
            productCategoryId: false,
        });
        setQtyUnit(units)
        setUnitConversation([]);
        setUnitConversationError([]);
        setIsEdit(false);
    }
    // const handleResetAddRecipe = () => {
    //     setFormData({
    //         productCategoryId: '',
    //         gujaratiProductName: '',
    //         productName: '',
    //         minProductQty: '',
    //         minProductUnit: '',
    //         productionTime: '',
    //         isExpired: false,
    //         expiredDays: '',
    //     });
    //     setFormDataError({
    //         productName: false,
    //         minProductQty: false,
    //         minProductUnit: false,
    //         expiredDays: false,
    //         productCategoryId: false,
    //     });
    //     setQtyUnit(units)
    //     setUnitConversation([]);
    //     setUnitConversationError([]);
    //     setIsEdit(false);
    // }
    const handleClose = () => {
        setOpenM(false);
        // setCategory('');
        // setCategoryError(false);
        setFormData({
            stockOutCategoryName: '',
            mfProductOutCategory: ''
        });
        setIsEdit(false);
    }
    const handleCloseAddRecipe = () => {
        setOpenAddRecipe(false);
        setRecipeId({
            mfProductName: '',
            mfProductId: ''
        });
        setBatchFormData({
            batchQty: '',
            batchUnit: ''
        })
        setBatchFormDataError({
            batchQty: false
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
    const handleCloseStockIn = () => {
        setStockInFormData({
            mfProductId: "",
            mfProductQty: "",
            mfProductUnit: "",
            totalPrice: "",
            mfStockInComment: "",
            mfStockInDate: dayjs(),
            isAuto: true,
            batchQty: ""
        })
        setStockInFormDataError({
            mfProductQty: false,
            mfProductUnit: false,
            totalPrice: false,
            mfStockInDate: false,
            batchQty: false
        })
        setRecipeStockIn([])
        setRecipeExpenseStockIn([])
        setRecipeProductStockIn([])
        setRecipeErrorStockIn([])
        setRecipeErrorExpenseStockIn([])
        setRecipeErrorProductStockIn([])
        setOpenStockIn(false);
    }
    const handleStockInDate = (date) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ["mfStockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };

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
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["mfStockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleOpenViewDetail = (data) => {
        setOpenViewDetail(true);
        setViewData(data)
    }
    const getAllData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?productStatus=${tab}&page=${1}&numPerPage=${10}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?productStatus=${tab}&page=${1}&numPerPage=${10}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productStatus=${tab}&page=${1}&numPerPage=${10}&searchProduct=${searchWord}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getMfProductListCounter`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeMfProductData?mfProductId=${id}`, config)
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
        getUnits();
        getMainCategory();
        getCountData();
        getMaterialList();
        getExpenseList();
        getProductList();
        getBranchList();
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
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateMfProductData`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                setTab('');
                setFormData({
                    productCategoryId: '',
                    gujaratiProductName: '',
                    productName: '',
                    minProductQty: '',
                    minProductUnit: '',
                    productionTime: '',
                    isExpired: false,
                    expiredDays: '',
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
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addMfProductData`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                getAllData();
                setTab(null);
                getCountData();
                handleClose();
                handleReset();
                handleOpenAddRecipe(res.data.mfProductId, res.data.mfProductName, res.data.minProductUnit)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addRecipe = async () => {
        setLoading(true)
        const combinedData = { ...recipeId, batchQty: batchFormData.batchQty, batchUnit: batchFormData.batchUnit, recipeMaterial: recipe, otherExpense: recipeExpense, produceProduct: recipeProduct }
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addRecipeeData`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                getAllData();
                setTab(null);
                getCountData();
                getMaterialList();
                getExpenseList();
                getProductList();
                handleCloseAddRecipe();
                // handleReset();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editRecipe = async () => {
        setLoading(true)
        const combinedData = { ...recipeId, batchQty: batchFormData.batchQty, batchUnit: batchFormData.batchUnit, recipeMaterial: recipe, otherExpense: recipeExpense, produceProduct: recipeProduct }
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateRecipeeData`, combinedData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                getAllData();
                setTab(null);
                setIsEdit(false);
                getCountData();
                getMaterialList();
                getExpenseList();
                getProductList();
                handleCloseAddRecipe();
                // handleReset();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const stockIn = async () => {
        setLoading(true)
        const newStockInData = {
            ...stockInFormData,
            autoJson: {
                recipeMaterial: recipeStockIn,
                otherExpense: recipeExpenseStockIn,
                produceProductdata: recipeProductStockIn
            }
        }
        console.log("dddd", newStockInData)
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addMfProductStockInData`, newStockInData, config)
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
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addMfProductStockOutData`, stockOutFormData, config)
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
                getProductList();
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
    const onAddMaterial = (e) => {
        console.log('>>>')
        if (selectedMaterial && selectedMaterial.materialName && selectedMaterial.materialName.rawMaterialName) {
            if (recipe.length == 0) {
                setRecipe([{
                    materialName: selectedMaterial.materialName.rawMaterialName,
                    materialId: selectedMaterial.materialName.rawMaterialId,
                    materialObject: selectedMaterial.materialName,
                    value: '',
                    unit: '',
                    materialUnits: selectedMaterial.units
                }])
                setRecipeError([{
                    value: false,
                    unit: false
                }])
                setMaterialList(prevItems => prevItems.filter(item => item.rawMaterialId !== selectedMaterial.materialName.rawMaterialId));
                setSelectedMaterial({
                    materialName: null,
                    units: []
                })
            }
            else {
                setRecipe([
                    ...recipe,
                    {
                        materialName: selectedMaterial.materialName.rawMaterialName,
                        materialId: selectedMaterial.materialName.rawMaterialId,
                        materialObject: selectedMaterial.materialName,
                        value: '',
                        Unit: '',
                        materialUnits: selectedMaterial.units
                    }
                ])
                setRecipeError([
                    ...recipeError,
                    {
                        value: false,
                        unit: false
                    }
                ])
                setMaterialList(prevItems => prevItems.filter(item => item.rawMaterialId !== selectedMaterial.materialName.rawMaterialId));
                setSelectedMaterial({
                    materialName: null,
                    units: []
                })
            }
        }
    }
    const onAddProduct = (e) => {
        if (selectedProduct && selectedProduct.mfProductName && selectedProduct.mfProductName.mfProductName) {
            if (recipeProduct.length == 0) {
                setRecipeProduct([{
                    mfProductName: selectedProduct.mfProductName.mfProductName,
                    produceProductId: selectedProduct.mfProductName.mfProductId,
                    productObject: selectedProduct.mfProductName,
                    value: '',
                    unit: '',
                    productUnits: selectedProduct.units
                }])
                setRecipeErrorProduct([{
                    value: false,
                    unit: false
                }])
                setProductList(prevItems => prevItems.filter(item => item.mfProductId !== selectedProduct.mfProductName.mfProductId));
                setSelectedProduct({
                    mfProductName: null,
                    units: []
                })
            }
            else {
                setRecipeProduct([
                    ...recipeProduct,
                    {
                        mfProductName: selectedProduct.mfProductName.mfProductName,
                        produceProductId: selectedProduct.mfProductName.mfProductId,
                        productObject: selectedProduct.mfProductName,
                        value: '',
                        Unit: '',
                        productUnits: selectedProduct.units
                    }
                ])
                setRecipeErrorProduct([
                    ...recipeErrorProduct,
                    {
                        value: false,
                        unit: false
                    }
                ])
                setProductList(prevItems => prevItems.filter(item => item.mfProductId !== selectedProduct.mfProductName.mfProductId));
                setSelectedProduct({
                    mfProductName: null,
                    units: []
                })
            }
        }
    }
    const onAddExpense = (e) => {
        if (selectedExpense && selectedExpense.expense && selectedExpense.expense.otherSourceName) {
            if (recipeExpense.length == 0) {
                setRecipeExpense([{
                    expenseName: selectedExpense.expense.otherSourceName,
                    otherSouceId: selectedExpense.expense.otherSourceId,
                    expenseObject: selectedExpense.expense,
                    value: '',
                    unit: selectedExpense.expense.otherSourceUnit,
                }])
                setRecipeErrorExpense([{
                    value: false,
                }])
                setOtherExpenseList(prevItems => prevItems.filter(item => item.otherSourceId !== selectedExpense.expense.otherSourceId));
                setSelectedExpense({
                    expense: null,
                    units: []
                })
            }
            else {
                setRecipeExpense([
                    ...recipeExpense,
                    {
                        expenseName: selectedExpense.expense.otherSourceName,
                        otherSouceId: selectedExpense.expense.otherSourceId,
                        expenseObject: selectedExpense.expense,
                        value: '',
                        unit: selectedExpense.expense.otherSourceUnit,
                    }
                ])
                setRecipeErrorExpense([
                    ...recipeErrorExpense,
                    {
                        value: false,
                    }
                ])
                setOtherExpenseList(prevItems => prevItems.filter(item => item.otherSourceId !== selectedExpense.expense.otherSourceId));
                setSelectedExpense({
                    expense: null,
                    units: []
                })
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
    const submitAddRecipe = () => {
        if (loading || success) {

        } else {
            // const isValidate = fields.filter(element => {
            //     if (element === 'isExpired') {
            //         if (formData.isExpired && (formData.expiredDays <= 0 || !formData.expiredDays)) {
            //             setFormDataError((perv) => ({
            //                 ...perv,
            //                 expiredDays: true
            //             }))
            //             return element;
            //         }
            //     } else if (formDataError[element] === true || formData[element] === '' || formData[element] === 0 || !formData[element]) {
            //         setFormDataError((perv) => ({
            //             ...perv,
            //             [element]: true
            //         }))
            //         return element;
            //     }
            // })
            const isVelidate2 = recipe.filter((element, index) => {
                if (element.value < 0 || element.value == '' || !element.value || element.unit <= 0 || element.unit == '' || !element.unit) {
                    setRecipeError(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, value: element.value < 0 || element.value == '' || !element.value ? true : false, unit: element.unit <= 0 || element.unit == '' || !element.unit ? true : false } : user,
                        ))
                    return element;
                }
            })
            const isVelidate3 = recipeProduct.filter((element, index) => {
                if (element.value < 0 || element.value == '' || !element.value || element.unit <= 0 || element.unit == '' || !element.unit) {
                    setRecipeErrorProduct(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, value: element.value < 0 || element.value == '' || !element.value ? true : false, unit: element.unit <= 0 || element.unit == '' || !element.unit ? true : false } : user,
                        ))
                    return element;
                }
            })
            const isVelidate4 = recipeExpense.filter((element, index) => {
                if (element.value < 0 || element.value == '' || !element.value) {
                    setRecipeErrorExpense(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, value: element.value < 0 || element.value == '' || !element.value ? true : false } : user,
                        ))
                    return element;
                }
            })
            const isVelidate5 = batchFormData && (batchFormData.batchQty > 0) ? false : true;
            batchFormData && (batchFormData.batchQty > 0) ? setBatchFormDataError({ batchQty: false }) : setBatchFormDataError({ batchQty: true });
            if (isVelidate2.length > 0 || isVelidate3.length > 0 || isVelidate4.length > 0 || isVelidate5) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                // addProduct()
                addRecipe()
            }
            // addProduct()
        }
    }
    const submitEditRecipe = () => {
        if (loading || success) {

        } else {
            const isVelidate2 = recipe.filter((element, index) => {
                if (element.value < 0 || element.value == '' || !element.value || element.unit <= 0 || element.unit == '' || !element.unit) {
                    setRecipeError(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, value: element.value < 0 || element.value == '' || !element.value ? true : false, unit: element.unit <= 0 || element.unit == '' || !element.unit ? true : false } : user,
                        ))
                    return element;
                }
            })
            const isVelidate3 = recipeProduct.filter((element, index) => {
                if (element.value < 0 || element.value == '' || !element.value || element.unit <= 0 || element.unit == '' || !element.unit) {
                    setRecipeErrorProduct(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, value: element.value < 0 || element.value == '' || !element.value ? true : false, unit: element.unit <= 0 || element.unit == '' || !element.unit ? true : false } : user,
                        ))
                    return element;
                }
            })
            const isVelidate4 = recipeExpense.filter((element, index) => {
                if (element.value < 0 || element.value == '' || !element.value) {
                    setRecipeErrorExpense(perv =>
                        perv.map((user, idx) =>
                            idx === index ? { ...user, value: element.value < 0 || element.value == '' || !element.value ? true : false } : user,
                        ))
                    return element;
                }
            })
            const isVelidate5 = batchFormData && (batchFormData.batchQty > 0) ? false : true;
            batchFormData && (batchFormData.batchQty > 0) ? setBatchFormDataError({ batchQty: false }) : setBatchFormDataError({ batchQty: true });
            if (isVelidate2.length > 0 || isVelidate3.length > 0 || isVelidate4.length > 0 || isVelidate5) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                // addProduct()
                editRecipe()
            }
            // addProduct()
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
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductDetailsById?mfProductId=${id}`, config)
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
        getEditFillData(row.mfProductId);
        // setFormData({
        //     mfProductName: row.mfProductName,
        //     mfProductId: row.mfProductId,
        //     minMfProductQty: row.minMfProductQty,
        //     minMfProductUnit: row.minMfProductUnit
        // })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const getAllDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?page=${pageNum}&numPerPage=${rowPerPageNum}&productStatus=${tab}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getAllDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&productStatus=${tab}&searchProduct=${searchWord}`, config)
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
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForProductTable?startDate=${''}&endDate=${''}`,
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
    const handleViewDetail = (id, name, unit, remainingQty) => {
        navigate(`/inOut/factory/productDetails/${id}/${name}/${unit}/${remainingQty}`)
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
        await axios.get(filter ? `${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productStatus=${tab}&page=${1}&numPerPage=${10}&searchProduct=${searchWord}` : `${BACKEND_BASE_URL}mfProductrouter/getManufactureProductTable?productStatus=${tab}&page=${1}&numPerPage=${10}&searchProduct=${searchWord}`, config)
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
                                        <div className='statusTabtext'>All</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === null || tab === '' || !tab ? 'blueCount' : ''} `}>{countData && countData.allMfProduct ? countData.allMfProduct : 0}</div>
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
                                        <div className='statusTabtext'>Low-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 2 || tab === '2' ? 'orangeCount' : ''} `}>{countData && countData.underStockedMfProduct ? countData.underStockedMfProduct : 0}</div>
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
                                                <button className='stockOutBtn' onClick={handleCloseDate}>cancel</button>
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
                                {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null : <button className='exportExcelBtn' onClick={productExportExcel}><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button>}
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
                                                        key={row.mfProductId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>
                                                            {row.mfProductName}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.remainingStock}</TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.lastUpdatedQty}</TableCell> */}
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{parseFloat(row.lastPrice ? row.lastPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.minMfProductQty}</TableCell>
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}><div className={row.stockStatus == 'In-Stock' ? 'greenStatus' : row.stockStatus == 'Low-Stock' ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.lastUpdatedStockInDate}</TableCell> */}
                                                        <TableCell align="right">
                                                            <Menutemp mfProductId={row.mfProductId} data={row} handleOpenAddRecipe={handleOpenAddRecipe} handleOpenEditRecipe={handleOpenEditRecipe} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
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
                                                        key={row.mfProductId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" onClick={() => handleOpenViewDetail(row)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        {/* <Tooltip title={row.mfProductName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" onClick={() => handleOpenViewDetail(row)}>
                                                            {row.mfProductName}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.purchese} </TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{parseFloat(row.totalExpense ? row.totalExpense : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        {/* <Tooltip title={row.mfStockOutComment} placement="top-start" arrow> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}><div className='Comment'>{row.totalUsed} </div></TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{parseFloat(row.totalStockOutPrice ? row.totalStockOutPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.remainingStock} </TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{parseFloat(row.remainPrice ? row.remainPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.minMfProductQty} </TableCell> */}
                                                        <TableCell align="center" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}><div className={row.stockStatus == 'In-Stock' ? 'greenStatus' : row.stockStatus == 'Low-Stock' ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
                                                        {/* <TableCell align="left" onClick={() => handleViewDetail(row.mfProductId, row.mfProductName, row.minMfProductUnit, row.remainingStock)}>{row.lastUpdatedStockInDate}</TableCell> */}
                                                        <TableCell align="right">
                                                            <Menutemp mfProductId={row.mfProductId} data={row} handleOpenAddRecipe={handleOpenAddRecipe} handleOpenEditRecipe={handleOpenEditRecipe} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
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
                        <div className='col-span-3'>
                            <TextField
                                onChange={onChange}
                                value={formData.gujaratiProductName ? formData.gujaratiProductName : ''}
                                name="gujaratiProductName"
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
                        <div className='col-span-2'>
                            <TextField
                                type='number'
                                onChange={onChange}
                                value={formData.productionTime ? formData.productionTime : ''}
                                name="productionTime"
                                id="outlined-required"
                                label="Lead Time"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
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
                                        // error={formDataError.minMfProductQty}
                                        // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
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
                                                // error={formDataError.minMfProductQty}
                                                // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
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
                                                // error={formDataError.minMfProductQty}
                                                // helperText={formDataError.minMfProductQty ? "Enter Quantity" : ''}
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
                <Box sx={style}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        Stock In
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                value={stockInFormData.mfProductName}
                                name="mfProductName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
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
                                disabled={stockInFormData.isAuto ? stockInFormData.batchQty ? false : true : false}
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
                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.mfProductUnit}>StockIn Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={stockInFormData.isAuto ? stockInFormData.batchQty ? false : true : false}
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
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControlLabel control={<Checkbox name='isAuto' checked={stockInFormData.isAuto} value={stockInFormData.isAuto} onChange={() => {
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
                            <TextField
                                value={stockOutFormData.mfProductName}
                                name="mfProductName"
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
                        {(stockOutFormData.mfProductOutCategory == 'Distributor' || stockOutFormData.mfProductOutCategory == 'Branch') &&
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
                        }{stockOutFormData.mfProductOutCategory == 'Distributor' &&
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
                        <div className='productNameDetail'>
                            {viewData.mfProductName}
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
                                {viewData.minMfProductQty} {viewData.minMfProductUnit}
                            </div>
                        </div>
                        <div className='col-span-6 grid grid-cols-12'>
                            <div className='col-span-4 headerNameTxt'>
                                Production Time :
                            </div>
                            <div className='col-span-8'>
                                {viewData.productionTime}
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
                                Production :
                            </div>
                            <div className='col-span-8'>
                                {viewData.purchese}
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
                                Remaining :
                            </div>
                            <div className='col-span-8'>
                                {viewData.remainingStock}
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
            <Modal
                open={openAddRecipe}
                onClose={handleCloseAddRecipe}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Recipe' : 'Add Recipe'} for {recipeId.mfProductName}
                    </Typography>
                    <hr className='mt-2' />
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4 addUnitBox'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-8'>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            defaultValue={null}
                                            id='stockIn'
                                            disablePortal
                                            sx={{ width: '100%' }}
                                            value={selectedMaterial.materialName ? selectedMaterial.materialName : null}
                                            onChange={handleMaterialNameAutoComplete}
                                            options={materialList ? materialList : []}
                                            getOptionLabel={(options) => options.rawMaterialName}
                                            renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Material Name" />}
                                        />
                                    </FormControl>
                                </div>
                                <div className='col-span-4'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        onAddMaterial()
                                    }}>{'Add'}</button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-4 addUnitBox'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-8'>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            defaultValue={null}
                                            id='stock'
                                            disablePortal
                                            sx={{ width: '100%' }}
                                            value={selectedProduct.mfProductName ? selectedProduct.mfProductName : null}
                                            onChange={handleProductNameAutoComplete}
                                            options={productList ? productList : []}
                                            getOptionLabel={(options) => options.mfProductName}
                                            renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Product Name" />}
                                        />
                                    </FormControl>
                                </div>
                                <div className='col-span-4'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        onAddProduct()
                                    }}>{'Add'}</button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-4'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-8'>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            defaultValue={null}
                                            id='stockIn'
                                            disablePortal
                                            sx={{ width: '100%' }}
                                            value={selectedExpense.expense ? selectedExpense.expense : null}
                                            onChange={handleExpenseNameAutoComplete}
                                            options={otherExpenseList ? otherExpenseList : []}
                                            getOptionLabel={(options) => options.otherSourceName}
                                            renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Other Expense" />}
                                        />
                                    </FormControl>
                                </div>
                                <div className='col-span-4'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        onAddExpense()
                                    }}>{'Add'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='mt-6' />
                    <div className='grid grid-cols-12 mt-6'>
                        <div className='col-span-3'>
                            <div className='col-span-4'>
                                <TextField
                                    type='text'
                                    onBlur={(e) => {
                                        if (e.target.value <= 0 || !e.target.value) {
                                            setBatchFormDataError((perv) => ({
                                                ...perv,
                                                batchQty: true
                                            }))
                                        }
                                        else {
                                            setBatchFormDataError((perv) => ({
                                                ...perv,
                                                batchQty: false
                                            }))
                                        }
                                    }}
                                    onChange={(e) => {
                                        if ((regex.test(e.target.value) || e.target.value === '')) {
                                            setBatchFormData((perv) => ({
                                                ...perv,
                                                batchQty: e.target.value
                                            }))
                                        }
                                    }}
                                    value={batchFormData.batchQty ? batchFormData.batchQty : ''}
                                    error={batchFormDataError && batchFormDataError.batchQty ? true : false}
                                    helperText={batchFormDataError && batchFormDataError.batchQty ? "Enter Quantity" : ''}
                                    name="value"
                                    id="outlined-requi"
                                    label="Per Batch Qty"
                                    // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                    InputProps={{ style: { fontSize: 14 }, endAdornment: <InputAdornment position="start">{batchFormData.batchUnit}</InputAdornment> }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>
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
                                                    onChange={(e) => onChangeRecipe(e, index)}
                                                    value={data.value ? data.value : ''}
                                                    error={recipeError[index] && recipeError[index].value ? true : false}
                                                    helperText={recipeError[index] && recipeError[index].value ? "Enter Quantity" : ''}
                                                    name="value"
                                                    id="outlined-required"
                                                    label="Qty"
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
                                                        onChange={(e) => onChangeRecipe(e, index)}
                                                    >
                                                        {
                                                            data.materialUnits ? data.materialUnits?.map((unit) => (
                                                                <MenuItem key={unit.unitName} value={unit.unitName}>{unit.unitName}</MenuItem>
                                                            )) : null
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className='col-span-1 flex'>
                                                <button className='redDeleteBtn self-center' onClick={() => {
                                                    deleteMaterial(index);
                                                }}><DeleteForeverIcon fontSize='large' /></button>
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
                                                    onChange={(e) => onChangeRecipeExpense(e, index)}
                                                    value={data.value ? data.value : ''}
                                                    error={recipeErrorExpense[index] && recipeErrorExpense[index].value ? true : false}
                                                    helperText={recipeErrorExpense[index] && recipeErrorExpense[index].value ? "Enter Quantity" : ''}
                                                    name="value"
                                                    id="outlined-required"
                                                    label="Qty"
                                                    // endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                                    InputProps={{ style: { fontSize: 14 }, endAdornment: <InputAdornment position="start">{data.unit}</InputAdornment> }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    fullWidth
                                                />
                                            </div>
                                            <div className='col-span-1 flex'>
                                                <button className='redDeleteBtn self-center' onClick={() => {
                                                    deleteExpense(index);
                                                }}><DeleteForeverIcon fontSize='large' /></button>
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
                                                    onChange={(e) => onChangeRecipeProduct(e, index)}
                                                    value={data.value ? data.value : ''}
                                                    error={recipeErrorProduct[index] && recipeErrorProduct[index].value ? true : false}
                                                    helperText={recipeErrorProduct[index] && recipeErrorProduct[index].value ? "Enter Quantity" : ''}
                                                    name="value"
                                                    id="outlined-required"
                                                    label="Qty"
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
                                                        onChange={(e) => onChangeRecipeProduct(e, index)}
                                                    >
                                                        {
                                                            data.productUnits ? data.productUnits?.map((unit) => (
                                                                <MenuItem key={unit.unitName} value={unit.unitName}>{unit.unitName}</MenuItem>
                                                            )) : null
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className='col-span-1 flex'>
                                                <button className='redDeleteBtn self-center' onClick={() => {
                                                    deleteProduct(index);
                                                }}><DeleteForeverIcon fontSize='large' /></button>
                                            </div>
                                        </div>
                                    )) : <></>
                                }
                            </div>
                        </>
                    }
                    <hr className='mt-6' />
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? submitEditRecipe() : submitAddRecipe()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddRecipe();
                                // handleResetAddRecipe();
                                setIsEdit(false)
                            }}>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}
export default FinalProductListTableInOut;
