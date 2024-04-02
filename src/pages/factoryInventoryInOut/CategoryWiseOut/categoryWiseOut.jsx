import './categoryWiseOut.css';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
// import Menutemp from './menu';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { validateDate } from '@mui/x-date-pickers/internals';
import CountCard from '../countCard/countCard';

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

function CategoryWiseOutInOut() {
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
    const [counts, setCounts] = React.useState();
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
    const [filterFormData, setFilterFormData] = React.useState({
        outCategoryId: '',
        branchId: '',
    });
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
    const getMainCategory = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockInCategory`, config)
            .then((res) => {
                setCategoryList(res.data);
            })
            .catch((error) => {
                setSupplierList(['No Data'])
            })
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
    const handleOpen = () => setOpenM(true);
    const handleCloseDate = () => {
        setAnchorEl(null);
    };


    const getAllDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseMfProductData?page=${pageNum}&numPerPage=${rowPerPageNum}&outCategoryId=${filterFormData.outCategoryId}&branchId=${filterFormData.branchId}&searchWord=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getAllDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseMfProductData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}&outCategoryId=${filterFormData.outCategoryId}&branchId=${filterFormData.branchId}`, config)
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
        if (filter) {
            getAllDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
        }
        else {
            getAllDataOnPageChange(newPage + 1, rowsPerPage)
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (filter) {
            getAllDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
        }
        else {
            getAllDataOnPageChange(1, parseInt(event.target.value, 10))
        }

    };
    const getDebitCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getStaticsOutCategoryWiseMfProductData?`, config)
            .then((res) => {
                setCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitCountsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getStaticsOutCategoryWiseMfProductData?`, config)
            .then((res) => {
                setCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getAllData = async (outId, branchId) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseMfProductData?outCategoryId=${outId}&branchId=${branchId}&page=${1}&numPerPage=${10}&searchWord=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }

    const getAllDataByFilter = async (outId, branchId) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseMfProductData?outCategoryId=${outId}&branchId=${branchId}&page=${1}&numPerPage=${10}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
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
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getmfProductOutCategoryList`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    useEffect(() => {
        getAllData('', '');
        getCategoryList();
        getUnits();
        getDebitCounts();
        getMainCategory();
        getCountData();
        getMaterialList();
        getExpenseList();
        getProductList();
        getBranchList();
    }, [])
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
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
        navigate(`/factory/productDetails/${id}/${name}/${unit}/${remainingQty}`)
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
    const search = async (searchWord, outId, branchId) => {
        console.log('>>>LLL>>>search', filter, searchWord, outId, branchId)
        await axios.get(filter ? `${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseMfProductData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${10}&searchWord=${searchWord}&outCategoryId=${outId}&branchId=${branchId}` : `${BACKEND_BASE_URL}mfProductrouter/getOutCategoryWiseMfProductData?page=${1}&numPerPage=${10}&searchWord=${searchWord}&outCategoryId=${outId}&branchId=${branchId}`, config)
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
        search(document.getElementById('searchWord').value, filterFormData.outCategoryId, filterFormData.branchId)
    }

    const debounceFunction = React.useCallback(debounce(handleSearch), [filterFormData, state, filter])

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
                                    }}>
                                        <div className='statusTabtext'>Category Wise Out</div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-5 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                </div>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button
                                        className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                        onClick={() => {
                                            setFilter(false);
                                            getAllData(filterFormData.outCategoryId, filterFormData.branchId);
                                            setPage(0);
                                            setSearchWord('')
                                            setRowsPerPage(10);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                        }}><CloseIcon /></button>
                                </div>
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
                                                <button className='stockInBtn' onClick={() => { getAllDataByFilter(filterFormData.outCategoryId, filterFormData.branchId); setFilter(true); setPage(0); setRowsPerPage(10); handleCloseDate() }}>Apply</button>
                                            </div>
                                            <div className='col-span-3'>
                                                <button className='stockOutBtn' onClick={handleCloseDate}>cancel</button>
                                            </div>
                                        </div>
                                    </Box>
                                </Popover>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-3 pl-6'>
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
                            <div></div>
                            <div className='col-span-2'>
                                <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="Category"
                                        value={filterFormData.outCategoryId ? filterFormData.outCategoryId : ''}
                                        name="outCategoryId"
                                        label="Category"
                                        onChange={(e) => {
                                            setFilterFormData((perv) => ({
                                                ...perv,
                                                outCategoryId: e.target.value,
                                                branchId: ''
                                            }))
                                            filter ? getAllDataByFilter(e.target.value, '') : getAllData(e.target.value, '')
                                        }}
                                    >
                                        <MenuItem key={'Clear'} value={''}>Clear</MenuItem>
                                        {
                                            categories ? categories.map((category) => (
                                                <MenuItem key={category.stockOutCategoryId} value={category.stockOutCategoryId}>{category.stockOutCategoryName}</MenuItem>
                                            )) : null
                                        }

                                    </Select>
                                </FormControl>
                            </div>
                            {filterFormData.outCategoryId == 'Branch' &&
                                <div className='col-span-2 pl-6'>
                                    <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                        <InputLabel id="demo-simple-select-label">Branches</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="branch"
                                            value={filterFormData.branchId ? filterFormData.branchId : null}
                                            name="branchId"
                                            label="Branches"
                                            onChange={(e) => {
                                                setFilterFormData((perv) => ({
                                                    ...perv,
                                                    branchId: e.target.value,
                                                }))
                                                filter ? getAllDataByFilter(filterFormData.outCategoryId, e.target.value) : getAllData(filterFormData.outCategoryId, e.target.value)
                                            }}
                                        >
                                            <MenuItem key={"Clear"} value={""}>Clear</MenuItem>
                                            {
                                                ddlBranch ? ddlBranch.map((category) => (
                                                    <MenuItem key={category.branchId} value={category.branchId}>{category.branchName}</MenuItem>
                                                )) : null
                                            }

                                        </Select>
                                    </FormControl>
                                </div>}
                            <div className='col-span-4 col-start-9 pr-5 flex justify-end'>
                                <button className='exportExcelBtn' onClick={productExportExcel}><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell >No.</TableCell>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell align="left">Sold Qty</TableCell>
                                            <TableCell align="left">Product Cost</TableCell>
                                            <TableCell align="left">Sold Price</TableCell>
                                            <TableCell align="left">Profit</TableCell>
                                            {/* <TableCell align="left">LastIn Date</TableCell> */}
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
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                    <TableCell component="th" scope="row" >
                                                        {row.mfProductName}
                                                    </TableCell>
                                                    {/* </Tooltip> */}
                                                    <TableCell align="left" >{row.remainingStock}</TableCell>
                                                    <TableCell align="left" >{parseFloat(row.costPrice ? row.costPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="left" >{parseFloat(row.sellAmt ? row.sellAmt : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="left" >{parseFloat(row.costPrice && row.sellAmt ? row.sellAmt - row.costPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                    {/* <TableCell align="left" >{row.lastUpdatedStockInDate}</TableCell> */}
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
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}
export default CategoryWiseOutInOut;
