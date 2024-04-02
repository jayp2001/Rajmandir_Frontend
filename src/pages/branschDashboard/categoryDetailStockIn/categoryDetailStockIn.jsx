import './categoryDetailStockIn.css';
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
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useParams } from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import ProductListTableStockIn from './productListTable/productListTable';

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

function StockOutByCategoryStockIn() {
    var date = new Date(), y = date.getFullYear(), m = (date.getMonth());
    var firstDay = new Date(y, m, 1).toString().slice(4, 15);
    var lastDay = new Date(y, m + 1, 0).toString().slice(4, 15);
    let { categoryId, category } = useParams();
    const regex = /^\d*(?:\.\d*)?$/;
    const navigate = useNavigate();
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [expanded, setExpanded] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [supplier, setSupplierList] = React.useState();
    const [filter, setFilter] = React.useState(false);
    const [stockInData, setStockInData] = React.useState();
    const [stockOutData, setStockOutData] = React.useState();
    const [categories, setCategories] = React.useState();
    const [productList, setProductList] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tab, setTab] = React.useState(3);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [totalStockOutPrice, setTotalStockOutPrice] = React.useState();
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlProduct`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setProductList(null)
            })
    }

    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutDataByCategory?page=${pageNum}&numPerPage=${rowPerPageNum}&categoryId=${categoryId}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalStockOutPrice(res.data.totalStockOutPrice)
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutDataByCategory?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&categoryId=${categoryId}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutDataByCategory?page=${page + 1}&numPerPage=${rowsPerPage}&categoryId=${categoryId}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutDataByCategory?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&categoryId=${categoryId}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (filter) {
            getStockOutDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
        }
        else {
            getStockOutDataOnPageChange(newPage + 1, rowsPerPage)
        }

    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (filter) {
            getStockOutDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
        }
        else {
            getStockOutDataOnPageChange(1, parseInt(event.target.value, 10))
        }
    };
    const stockInExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
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
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockOutDataByCategoryId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&categoryId=${categoryId}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockOutDataByCategoryId?startDate=${''}&endDate=${''}&categoryId=${categoryId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? category + '_' + 'StockOut_' + state[0].startDate.toLocaleDateString() + ' To ' + state[0].endDate.toLocaleDateString() + '.xlsx'
                    : category + '_' + 'StockOut_' + firstDay + ' To ' + lastDay + '.xlsx'
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
    useEffect(() => {
        getCategoryList();
        getProductList();
        getStockOutData()
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
        setLoading(false);
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
                                    <div className={`flex col-span-6 justify-center ${tab === 3 || tab === '3' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        navigate(`/categories`);
                                    }}>
                                        <div className='statusTabtext'>StockIn for {category}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductListTableStockIn id={categoryId} name={category} />
            <ToastContainer />
        </div >
    )
}

export default StockOutByCategoryStockIn;