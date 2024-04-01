import './categoriesTable.css'
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
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
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};

function CategoriesTable() {
    const [editCateory, setEditCategory] = React.useState({
        stockOutCategoryName: '',
        stockOutCategoryId: ''
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
    const [totalRowsStockOut, setTotalRowsStockOut] = React.useState(0);
    const [tab, setTab] = React.useState(2);
    const [isEdit, setIsEdit] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [categoryStockIn, setCategoryStockIn] = React.useState({
        stockInCategoryName: '',
    });
    const [categoryStockOutFormData, setCategoryStockOutFormData] = React.useState({
        stockOutCategoryName: '',
    });
    const [categoryStockOut, setCategoryStockOut] = React.useState([]);
    const [categoryError, setCategoryError] = React.useState('');
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
        setCategoryError(false);
        setCategoryStockIn({
            stockInCategoryName: '',
            stockInCategoryId: ''
        });
        setCategoryStockOutFormData({
            stockOutCategoryName: '',
            stockOutCategoryId: ''
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
        setCategoryError(false);
        setCategoryStockIn({
            stockInCategoryName: '',
            stockInCategoryId: ''
        });
        setIsEdit(false);
    }
    const handleResetStockOut = () => {
        setCategoryError(false);
        setCategoryStockOutFormData({
            stockOutCategoryName: '',
            stockOutCategoryId: ''
        });
        setIsEdit(false);
    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
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




    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInCategoryList?page=${1}&numPerPage=${5}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInCategoryList?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getDataStockOut = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutCategoryList?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataStockOutByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutCategoryList?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataStockOutOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataStockOutOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCategoryStockOut(res.data.rows);
                setTotalRowsStockOut(res.data.numRows);
                setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }



    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removestockInCategory?stockInCategoryId=${id}`, config)
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
    const deleteDataStockOut = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeStockOutCategory?stockOutCategoryId=${id}`, config)
            .then((res) => {
                setSuccess(true);
                setPage(0);
                setRowsPerPage(5);
                getDataStockOut();
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
        else {
            if (filter) {
                getDataStockOutOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDataStockOutOnPageChange(1, parseInt(event.target.value, 10))
            }
        }

    };
    const handleDelete = async (id) => {
        const password = window.prompt("Are you sure you want to delete category ?... Enter Password to delete")
        if (password) {
            await axios.post(`${BACKEND_BASE_URL}userrouter/chkPassword`, { "userPassword": password }, config)
                .then(async (res) => {
                    deleteData(id);
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
        // if (window.confirm("Are you sure you want to delete StockIn Category?")) {
        //     deleteData(id);
        // }
    }
    const handleDeleteStockOut = async (id) => {
        const password = window.prompt("Are you sure you want to delete Category ?... Enter Password to delete")
        if (password) {
            await axios.post(`${BACKEND_BASE_URL}userrouter/chkPassword`, { "userPassword": password }, config)
                .then(async (res) => {
                    deleteDataStockOut(id);
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
        // if (window.confirm("Are you sure you want to delete StockOut Category?")) {
        //     deleteDataStockOut(id);
        // }
    }
    const handleEdit = (id, name) => {
        setCategoryError(false);
        setIsEdit(true);
        setCategoryStockIn((perv) => ({
            ...perv,
            stockInCategoryId: id,
            stockInCategoryName: name
        }))
        setOpen(true)
    }
    const handleEditStockOut = (id, name) => {
        setCategoryError(false);
        setIsEdit(true);
        setCategoryStockOutFormData((perv) => ({
            ...perv,
            stockOutCategoryId: id,
            stockOutCategoryName: name
        }))
        setOpen(true)
    }
    const editCategory = async () => {
        if (loading || success) {

        } else {
            if (categoryStockIn && categoryStockIn.stockInCategoryName < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updatestockInCategory`, categoryStockIn, config)
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
            if (categoryStockOutFormData && categoryStockOutFormData.stockOutCategoryName < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateStockOutCategory`, categoryStockOutFormData, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        getDataStockOut();
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
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addstockInCategory`, categoryStockIn, config)
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
    const addCategoryStockOut = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addstockOutCategory`, categoryStockOutFormData, config)
            .then((res) => {
                setSuccess(true)
                getDataStockOut();
                setPage(0);
                setRowsPerPage(5);
                setLoading(false);
                handleResetStockOut();
                focus();
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
                setCategoryError(true);
            } else {
                addCategory()
            }
        }
    }
    const submitStockOut = () => {
        if (loading || success) {

        } else {
            if (categoryStockOutFormData && categoryStockOutFormData.stockOutCategoryName < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            } else {
                addCategoryStockOut()
            }
        }
    }
    const excelExportProductWise = async () => {
        if (window.confirm('Are you sure you want to export product wise Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportCategoryWisedProductUsedData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportCategoryWisedProductUsedData?startDate=${''}&endDate=${''}`,
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
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportPdfForInventoryCategoryData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportPdfForInventoryCategoryData?startDate=${''}&endDate=${''}`,
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
                                            setTab(2); setSearchWord(''); setPage(0); setRowsPerPage(5);
                                        }}>
                                        <div className='statusTabtext'>StockIn Category</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                        setTab(3); setSearchWord(''); setPage(0); setRowsPerPage(5); getDataStockOut();
                                    }}>
                                        <div className='statusTabtext'>StockOut Category</div>
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
                                                    setSearchWord('');
                                                    setFilter(true); setPage(0); handleClose()
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
                            {/* {tab === 2 || tab === '2' ?
                                <div className='col-span-3 pl-8'>
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
                                :
                                null} */}
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <div className='col-span-2 col-start-11 mr-6'>
                                    <div className='flex justify-end'>
                                        <button className='addCategoryBtn' onClick={handleOpen}>Add Category</button>
                                    </div>
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
                                                <TableCell>Category Name</TableCell>
                                                <TableCell align="right">StockIn Cost</TableCell>
                                                <TableCell align="right"></TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.stockInCategoryId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" onClick={() => navigateToStockInDetail(row.stockInCategoryName, row.stockInCategoryId)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row" onClick={() => navigateToStockInDetail(row.stockInCategoryName, row.stockInCategoryId)}>
                                                            {row.stockInCategoryName}
                                                        </TableCell>
                                                        <TableCell align="right" onClick={() => navigateToStockInDetail(row.stockInCategoryName, row.stockInCategoryId)}>{parseFloat(row.totalPurchase ? row.totalPurchase : 0).toLocaleString('en-IN')}</TableCell>
                                                        {/* <TableCell align="right" onClick={() => navigateToStockInDetail(row.stockInCategoryName, row.stockInCategoryId)}>{row.percentage}</TableCell> */}
                                                        <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.stockInCategoryId, row.stockInCategoryName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.stockInCategoryId)}>Delete</button></div></TableCell>
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
                                                    <TableCell>Category Name</TableCell>
                                                    <TableCell align="right">Used Cost</TableCell>
                                                    <TableCell align="right"></TableCell>
                                                    <TableCell align="right"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {categoryStockOut?.map((row, index) => (
                                                    totalRowsStockOut !== 0 ?
                                                        <TableRow
                                                            hover
                                                            key={row.stockOutCategoryId}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            style={{ cursor: "pointer" }}
                                                            className='tableRow'
                                                        >
                                                            <TableCell align="left" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                            <TableCell component="th" scope="row" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>
                                                                {row.stockOutCategoryName}
                                                            </TableCell>
                                                            <TableCell align="right" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>{parseFloat(row.totalUsedPrice ? row.totalUsedPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                            <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEditStockOut(row.stockOutCategoryId, row.stockOutCategoryName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDeleteStockOut(row.stockOutCategoryId)}>Delete</button></div></TableCell>
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
                    {
                        (tab === 2 || tab === '2') && <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {isEdit ? 'Edit StockIn Category' : 'Add StockIn Category'}
                            </Typography>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-6'>
                                    <TextField
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setCategoryError(true);
                                            }
                                            else {
                                                setCategoryError(false)
                                            }
                                        }}
                                        onChange={(e) => setCategoryStockIn((perv) => ({
                                            ...perv,
                                            stockInCategoryName: e.target.value
                                        }))}
                                        value={categoryStockIn.stockInCategoryName ? categoryStockIn.stockInCategoryName : ''}
                                        error={categoryError ? true : false}
                                        inputRef={textFieldRef}
                                        helperText={categoryError ? "Please Enter Category" : ''}
                                        name="stockInCategoryName"
                                        id="outlined-required"
                                        label="Category"
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        isEdit ? editCategory() : submit()
                                    }}>{isEdit ? 'Save' : 'Add'}</button>
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        handleCloseModal();
                                        setIsEdit(false)
                                    }}>Cancle</button>
                                </div>
                            </div></>
                    }{
                        (tab === '3' || tab === 3) && <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {isEdit ? 'Edit StockOut Category' : 'Add StockOut Category'}
                            </Typography>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-6'>
                                    <TextField
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setCategoryError(true);
                                            }
                                            else {
                                                setCategoryError(false)
                                            }
                                        }}
                                        onChange={(e) => setCategoryStockOutFormData((perv) => ({
                                            ...perv,
                                            stockOutCategoryName: e.target.value
                                        }))}
                                        value={categoryStockOutFormData.stockOutCategoryName ? categoryStockOutFormData.stockOutCategoryName : ''}
                                        error={categoryError ? true : false}
                                        inputRef={textFieldRef}
                                        helperText={categoryError ? "Please Enter Category" : ''}
                                        name="stockOutCategoryName"
                                        id="outlined-required"
                                        label="Category"
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        isEdit ? editCategoryStockOut() : submitStockOut()
                                    }}>{isEdit ? 'Save' : 'Add'}</button>
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        handleCloseModal();
                                        setIsEdit(false)
                                    }}>Cancle</button>
                                </div>
                            </div>
                        </>
                    }
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default CategoriesTable;