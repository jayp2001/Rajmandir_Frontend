import './materialTableByDepartment.css'
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Menutemp from './menu';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import { useNavigate } from "react-router-dom";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExportMenu from '../materialListTable/exportMenu';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};

function MaterialTableByDepartment() {
    const regex = /^\d*(?:\.\d*)?$/;
    const [editCateory, setEditCategory] = React.useState({
        otherSourceName: '',
        otherSourceId: ''
    })
    const navigate = useNavigate();
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
    var date = new Date(), y = date.getFullYear(), m = (date.getMonth());
    var firstDay = new Date(y, m, 1).toString().slice(4, 15);
    var lastDay = new Date(y, m + 1, 0).toString().slice(4, 15);
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [searchWord, setSearchWord] = React.useState('');
    const [unitsForProduct, setUnitsForProduct] = React.useState([
        'Kg',
        'Gm',
        'Ltr',
        'Mtr',
        'Pkts',
        'BOX',
        'Bottel',
        'ML',
        'Qty',
        'Piece',
        'glass',
        'crate',
        'cartoon',
        'Num',
        'lead',
        'bunch',
        'Bachku',
        'Spoon',
        'Container'
    ]);
    const [totalRowsStockOut, setTotalRowsStockOut] = React.useState(0);
    const [tab, setTab] = React.useState(2);
    const [isEdit, setIsEdit] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [categoryStockIn, setCategoryStockIn] = React.useState({
        stockInCategoryName: '',
    });
    const [formData, setFormData] = React.useState({
        otherSourceName: '',
        otherSourceUnit: '',
        otherSourcePrice: ''
    });
    const [formDataError, setFormDataError] = React.useState({
        otherSourceName: false,
        otherSourceUnit: false,
        otherSourcePrice: false
    });
    const [formDataErrorField, setFormDataErrorField] = React.useState([
        'otherSourceName',
        'otherSourceUnit',
        'otherSourcePrice',
    ]);
    const [categoryStockOut, setCategoryStockOut] = React.useState([]);
    const [categoryErrorStockOut, setCategoryErrorstockOut] = React.useState('');
    const [openModal, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [totalStockOutPrice, setTotalStockOutPrice] = React.useState();
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setFormDataError(false);
        setCategoryStockIn({
            stockInCategoryName: '',
            stockInCategoryId: ''
        });
        setFormData({
            otherSourceName: '',
            otherSourceId: ''
        });
        setIsEdit(false);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const handleReset = () => {
        setFormDataError(false);
        setCategoryStockIn({
            stockInCategoryName: '',
            stockInCategoryId: ''
        });
        setIsEdit(false);
    }
    const handleResetAddExpense = () => {
        setFormDataError({
            otherSourceName: false,
            otherSourceUnit: false,
            otherSourcePrice: false
        });
        setFormData({
            otherSourceName: '',
            otherSourceUnit: '',
            otherSourcePrice: ''
        });
        setIsEdit(false);
    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsProduct, setTotalRowsProduct] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();
    const [dataProduct, setDataProduct] = React.useState();



    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonRawMaterialData?page=${1}&numPerPage=${5}&searchWord=${''}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonRawMaterialData?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDataProduct = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonMfProductData?page=${1}&numPerPage=${5}&searchWord=${''}`, config)
            .then((res) => {
                setDataProduct(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataByFilterProduct = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonMfProductData?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
            .then((res) => {
                setDataProduct(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeProduct = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonMfProductData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setDataProduct(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeByFilterProduct = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonMfProductData?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
            .then((res) => {
                setDataProduct(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getExpenseDataByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonOtherSourceData?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonRawMaterialData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonRawMaterialData?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getExpenseData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonOtherSourceData?page=${1}&numPerPage=${5}&searchWord=${''}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataStockOutOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonOtherSourceData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataStockOutOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getCommonOtherSourceData?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removestockInCategory?stockInCategoryId=${id}`, config)
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
    const deleteDataExpense = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeOtherSourceData?otherSourceId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true);
                setPage(0);
                setRowsPerPage(5);
                getExpenseData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getData();
    }, [])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tab === 2 || tab === '2') {
            if (filter) {
                getDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tab === 1 || tab === '1') {
            if (filter) {
                getDataOnPageChangeByFilterProduct(newPage + 1, rowsPerPage)
            }
            else {
                getDataOnPageChangeProduct(newPage + 1, rowsPerPage)
            }
        }
        else {
            if (filter) {
                getDataStockOutOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDataStockOutOnPageChange(newPage + 1, rowsPerPage)
            }
        }

    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === 2 || tab === '2') {
            if (filter) {
                getDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tab === 1 || tab === '1') {
            if (filter) {
                getDataOnPageChangeByFilterProduct(1, parseInt(event.target.value, 10))
            }
            else {
                getDataOnPageChangeProduct(1, parseInt(event.target.value, 10))
            }
        }
        else {
            if (filter) {
                getDataStockOutOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDataStockOutOnPageChange(1, parseInt(event.target.value, 10))
            }
        }

    };

    const search = async (searchWord) => {
        await axios.get(filter ? `${BACKEND_BASE_URL}mfProductrouter/getCommonRawMaterialData?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}` : `${BACKEND_BASE_URL}mfProductrouter/getCommonRawMaterialData?page=${1}&numPerPage=${5}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setData(null)
            })
    }
    const searchOther = async (searchWord) => {
        console.log('tab2', tab);
        await axios.get(filter ? `${BACKEND_BASE_URL}mfProductrouter/getCommonOtherSourceData?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}` : `${BACKEND_BASE_URL}mfProductrouter/getCommonOtherSourceData?page=${1}&numPerPage=${5}&searchWord=${searchWord}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setData(null)
            })
    }
    const searchProduct = async (searchWord) => {
        console.log('tab3', tab);
        await axios.get(filter ? `${BACKEND_BASE_URL}mfProductrouter/getCommonMfProductData?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchWord=${searchWord}` : `${BACKEND_BASE_URL}mfProductrouter/getCommonMfProductData?page=${1}&numPerPage=${5}&searchWord=${searchWord}`, config)
            .then((res) => {
                setDataProduct(res.data.rows);
                setTotalRowsProduct(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setData(null)
            })
    }

    const productExportExcelMaterial = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelForCommonRawMaterialData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelForCommonRawMaterialData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'RawMaterial_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
        }
    }
    const productExportPdfMaterial = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportPDFForCommonRawMaterialData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportPDFForCommonRawMaterialData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'RawMaterials_Pdf' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
        }
    }

    const productExportExcelOtherSource = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelForCommonOtherSourceData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelForCommonOtherSourceData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Other_Expense_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
        }
    }
    const productExportPdfOtherSource = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportPDFForCommonOtherSourceData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportPDFForCommonOtherSourceData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Other_Expense_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
        }
    }

    const productExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelForCommonMfProductData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelForCommonMfProductData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'RawMaterial_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
        }
    }
    const productExportPdf = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportPDFForCommonMfProductData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportPDFForCommonMfProductData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'RawMaterials_Pdf' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
        }
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
    const handleSearchOther = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        searchOther(document.getElementById('searchWord').value)
    }
    const handleSearchProduct = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        searchProduct(document.getElementById('searchWord').value)
    }

    const debounceFunction = React.useCallback(debounce(handleSearch), [])
    const debounceFunctionOther = React.useCallback(debounce(handleSearchOther), [])
    const debounceFunctionProduct = React.useCallback(debounce(handleSearchProduct), [])


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete StockIn Category?")) {
            deleteData(id);
        }
    }
    const handleDeleteExpense = async (id) => {
        const password = window.prompt("Are you sure you want to delete Other Expense?... Enter Password to delete")
        if (password) {
            await axios.post(`${BACKEND_BASE_URL}userrouter/chkPassword`, { "userPassword": password }, config)
                .then(async (res) => {
                    deleteDataExpense(id);
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
        // if (window.confirm("Are you sure you want to delete Other Expense?")) {
        //     deleteDataExpense(id);
        // }
    }
    const handleEdit = (id, name) => {
        setFormDataError(false);
        setIsEdit(true);
        setCategoryStockIn((perv) => ({
            ...perv,
            stockInCategoryId: id,
            stockInCategoryName: name
        }))
        setOpen(true)
    }
    const handleEditExpense = (data) => {
        setFormDataError({
            otherSourceName: false,
            otherSourceUnit: false,
            otherSourcePrice: false
        });
        setIsEdit(true);
        setFormData(data)
        setOpen(true)
    }
    const editCategory = async () => {
        if (loading || success) {

        } else {
            if (categoryStockIn && categoryStockIn.stockInCategoryName < 2) {
                setError(
                    "Please Fill category"
                )
                setFormDataError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updatestockInCategory`, categoryStockIn, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        getData();
                        setPage(0);
                        setRowsPerPage(5)
                        setIsEdit(false)
                        handleCloseModal()
                    })
                    .catch((error) => {
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const editCategoryStockOut = async () => {
        if (loading || success) {

        } else {
            if (formData && formData.otherSourceName < 2) {
                setError(
                    "Please Fill category"
                )
                setFormDataError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateStockOutCategory`, formData, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        getExpenseData();
                        setPage(0);
                        setRowsPerPage(5)
                        setIsEdit(false)
                        handleCloseModal()
                    })
                    .catch((error) => {
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const addCategory = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addstockInCategory`, categoryStockIn, config)
            .then((res) => {
                setSuccess(true)
                getData();
                setLoading(false);
                handleReset();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addOtherExpense = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addOtherSourceData`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true)
                getExpenseData();
                setPage(0);
                setRowsPerPage(5);
                handleResetAddExpense();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editOtherExpense = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/updateOtherSourceData`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true)
                getExpenseData();
                setPage(0);
                setRowsPerPage(5);
                handleResetAddExpense();
                handleCloseModal();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            if (categoryStockIn && categoryStockIn.stockInCategoryName < 2) {
                setError(
                    "Please Fill category"
                )
                setFormDataError(true);
            } else {
                addCategory()
            }
        }
    }
    // const submitAddExpense = () => {
    //     if (loading || success) {

    //     } else {
    //         if (formData && formData.otherSourceName < 2) {
    //             setError(
    //                 "Please Fill category"
    //             )
    //             setFormDataError(true);
    //         } else {
    //             addOtherExpense()
    //         }
    //     }
    // }
    const submitAddExpense = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorField.filter(element => {
                if (formDataError[element] === true || formData[element] === '' || formData[element] === 0) {
                    setFormDataError((perv) => ({
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
                addOtherExpense()
            }
        }
    }
    const editAddExpense = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorField.filter(element => {
                if (formDataError[element] === true || formData[element] === '' || formData[element] === 0) {
                    setFormDataError((perv) => ({
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
                editOtherExpense()
            }
        }
    }
    const excelExportProductWise = async () => {
        if (window.confirm('Are you sure you want to export product wise Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportCategoryWisedProductUsedData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportCategoryWisedProductUsedData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'StockOut_ProductWise_' + state[0].startDate.toLocaleDateString() + ' To ' + state[0].endDate.toLocaleDateString() + '.xlsx'
                    : 'StockOut_ProductWise_' + firstDay + ' To ' + lastDay + '.xlsx'
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
    const pdfExportCategoryWise = async () => {
        if (window.confirm('Are you sure you want to export category wise Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportPdfForInventoryCategoryData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}mfProductrouter/exportPdfForInventoryCategoryData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'StockOut_CategoryWise_' + state[0].startDate.toLocaleDateString() + ' To ' + state[0].endDate.toLocaleDateString() + '.pdf'
                    : 'StockOut_ProductWise_' + firstDay + ' To ' + lastDay + '.pdf'
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
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
    }
    const navigateToDetail = (name, id) => {
        navigate(`/stockOutByCategory/${name}/${id}`);
    }
    const navigateToStockInDetail = (name, id) => {
        navigate(`/stockInByCategory/${name}/${id}`);
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
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => {
                                            setTab(2); setSearchWord(''); setPage(0); setRowsPerPage(5); filter ? getDataByFilter() : getData();
                                        }}>
                                        <div className='statusTabtext'>Raw Material</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                        setTab(3); setSearchWord(''); setPage(0); setRowsPerPage(5); filter ? getExpenseDataByFilter() : getExpenseData();
                                    }}>
                                        <div className='statusTabtext'>Other Expenses</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                        setTab(1); setSearchWord(''); setPage(0); setRowsPerPage(5); filter ? getDataByFilterProduct() : getDataProduct();
                                    }}>
                                        <div className='statusTabtext'>Factory Products</div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-4 col-start-9 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                </div>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                        setFilter(false);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                        setTab(0);
                                        setRowsPerPage(5);
                                        tab == 2 && getData();
                                        tab == 3 && getExpenseData();
                                    }}><CloseIcon /></button>
                                </div>
                                <Popover
                                    id={id}
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
                                                    setRowsPerPage(5);
                                                    tab == 2 ? filter ? getDataByFilter() : getData() : <></>
                                                    tab == 3 ? filter ? getExpenseDataByFilter() : getExpenseData() : <></>
                                                    tab == 1 ? filter ? getExpenseDataByFilter() : getExpenseData() : <></>
                                                    setFilter(true); setPage(0); handleClose();
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
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-3 ml-6'>
                                <TextField
                                    className='sarchText'
                                    onChange={(e) => { onSearchChange(e); tab == 2 ? debounceFunction() : tab == 3 ? debounceFunctionOther() : tab == 1 ? debounceFunctionProduct() : <></> }}
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
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <div className='col-span-2 col-start-11 mr-6'>
                                    {(tab == 3) ?
                                        <div className='flex justify-end'>
                                            <div className='mr-4'>
                                                {tab == 2 ? <ExportMenu exportExcel={productExportExcelMaterial} exportPdf={productExportPdfMaterial} /> : tab == 3 ? <ExportMenu exportExcel={productExportExcelOtherSource} exportPdf={productExportPdfOtherSource} /> : <ExportMenu exportExcel={productExportExcel} exportPdf={productExportPdf} />}
                                            </div>
                                            <button className='addCategoryBtn' onClick={handleOpen}>Add Other Expense</button>
                                        </div> :
                                        <div className=''>
                                            {tab == 2 ? <ExportMenu exportExcel={productExportExcelMaterial} exportPdf={productExportPdfMaterial} /> : tab == 3 ? <ExportMenu exportExcel={productExportExcelOtherSource} exportPdf={productExportPdfOtherSource} /> : <ExportMenu exportExcel={productExportExcel} exportPdf={productExportPdf} />}
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                        {tab === 2 || tab === '2' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Material Name</TableCell>
                                                <TableCell align="right">Used</TableCell>
                                                <TableCell align="right">Used Cost</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.rawMaterialId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.rawMaterialName}
                                                        </TableCell>
                                                        <TableCell align="right" >{row.remainingStock}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        {/* <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.stockInCategoryId, row.stockInCategoryName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.stockInCategoryId)}>Delete</button></div></TableCell> */}
                                                        <TableCell align="right">
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
                            tab === 3 || tab === '3' ?
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Expense Name</TableCell>
                                                    <TableCell align="right">Used Qty</TableCell>
                                                    <TableCell align="right">Cost</TableCell>
                                                    <TableCell align="right">Units</TableCell>
                                                    <TableCell align="right">Unit Price</TableCell>
                                                    <TableCell align="right"></TableCell>
                                                    <TableCell align="right"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {categoryStockOut?.map((row, index) => (
                                                    totalRowsStockOut !== 0 ?
                                                        <TableRow
                                                            hover
                                                            key={row.otherSourceId}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            style={{ cursor: "pointer" }}
                                                            className='tableRow'
                                                        >
                                                            <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                            <TableCell component="th" scope="row" >
                                                                {row.otherSourceName}
                                                            </TableCell>
                                                            <TableCell align="right" >{row.usedSource} {row.otherSourceUnit}</TableCell>
                                                            <TableCell align="right" >{parseFloat(row.usedPrice ? row.usedPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                            <TableCell align="right" >{row.otherSourceUnit}</TableCell>
                                                            <TableCell align="right" >{parseFloat(row.unitPrice ? row.unitPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                            <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEditExpense(row)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDeleteExpense(row.otherSourceId)}>Delete</button></div></TableCell>
                                                            <TableCell align="right">
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
                                            count={totalRowsStockOut}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableContainer>
                                </div> : tab === 1 || tab === '1' ?
                                    <div className='tableContainerWrapper'>
                                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>No.</TableCell>
                                                        <TableCell>Product Name</TableCell>
                                                        <TableCell align="right">Used</TableCell>
                                                        <TableCell align="right">Used Cost</TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataProduct?.map((row, index) => (
                                                        totalRowsProduct !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.mfProductId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.mfProductName}
                                                                </TableCell>
                                                                <TableCell align="right" >{row.remainingStock}</TableCell>
                                                                <TableCell align="right" >{parseFloat(row.usedPrice ? row.usedPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                                {/* <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.stockInCategoryId, row.stockInCategoryName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.stockInCategoryId)}>Delete</button></div></TableCell> */}
                                                                <TableCell align="right">
                                                                </TableCell>
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.mfProductId}
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
                                                count={totalRowsProduct}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableContainer>
                                    </div> : <></>
                        }
                    </div>
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Other Expense' : 'Add Other Expense'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 2) {
                                        setFormDataError(true);
                                    }
                                    else {
                                        setFormDataError(false)
                                    }
                                }}
                                onChange={(e) => setFormData((perv) => ({
                                    ...perv,
                                    otherSourceName: e.target.value
                                }))}
                                value={formData.otherSourceName ? formData.otherSourceName : ''}
                                error={formDataError.otherSourceName ? true : false}
                                inputRef={textFieldRef}
                                helperText={formDataError.otherSourceName ? "Please Enter name" : ''}
                                name="otherSourceName"
                                id="outlined-required"
                                label="Expense Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            otherSourcePrice: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            otherSourcePrice: false
                                        }))
                                    }
                                }}
                                onChange={(e) => {
                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                        setFormData((perv) => ({
                                            ...perv,
                                            otherSourcePrice: e.target.value
                                        }))
                                    }
                                }}
                                value={formData.otherSourcePrice === 'NaN' ? '' : formData.otherSourcePrice}
                                error={formDataError.otherSourcePrice}
                                helperText={formDataError.otherSourcePrice ? "Total Price" : ''}
                                name="otherSourcePrice"
                                id="outlined-required"
                                label="Total Cost"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={formDataError.otherSourceUnit}>StockIn Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.otherSourceUnit ? formData.otherSourceUnit : ''}
                                    error={formDataError.otherSourceUnit}
                                    name="otherSourceUnit"
                                    label="StockIn Unit"
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                otherSourceUnit: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                otherSourceUnit: false
                                            }))
                                        }
                                    }}
                                    onChange={(e) => setFormData((perv) => ({
                                        ...perv,
                                        otherSourceUnit: e.target.value
                                    }))}
                                >
                                    {
                                        unitsForProduct ? unitsForProduct?.map((data) => (
                                            <MenuItem key={data} value={data}>{data}</MenuItem>
                                        )) :
                                            <MenuItem key={''} value={''}>{''}</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? editAddExpense() : submitAddExpense()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModal();
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default MaterialTableByDepartment;