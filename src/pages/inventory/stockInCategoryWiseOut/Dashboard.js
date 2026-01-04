/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import './css/Dashboard.css';
import '../stockManagement/stockInOut.css';
import { useState, useEffect } from "react";
import React from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TextField from '@mui/material/TextField';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Paper } from '@mui/material';
import Popover from '@mui/material/Popover';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function StockInCategoryWiseOutDashboard() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    // State for categories (sidebar)
    const [stockInCategories, setStockInCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // State for stock out categories (dropdown)
    const [stockOutCategories, setStockOutCategories] = useState([]);
    const [selectedStockOutCategoryId, setSelectedStockOutCategoryId] = useState('');

    // State for table data
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [itemDataNull, setItemDataNull] = useState(true);

    // State for search
    const [searchTerm, setSearchTerm] = useState('');

    // State for date range filter
    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    // State for errors
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getStockInCategories();
        getStockOutCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId && selectedStockOutCategoryId) {
            getTableData();
        }
    }, [selectedCategoryId, selectedStockOutCategoryId, filter]);

    useEffect(() => {
        if (!Array.isArray(tableData)) {
            setFilteredData([]);
            return;
        }

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = tableData.filter(item => {
                return (
                    item?.productName?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
                    String(item?.remainingStock || '').toLowerCase()?.includes(lowerCaseSearchTerm) ||
                    String(item?.totalOutPrice || '').toLowerCase()?.includes(lowerCaseSearchTerm)
                );
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(tableData);
        }
    }, [searchTerm, tableData]);

    // Get Stock In Categories for sidebar
    const getStockInCategories = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockInCategory`, config);
            setStockInCategories(response.data);
            if (response.data.length > 0) {
                setSelectedCategoryId(response.data[0].stockInCategoryId);
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...');
        }
    };

    // Get Stock Out Categories for dropdown
    const getStockOutCategories = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockOutCategory`, config);
            setStockOutCategories(response.data);
            if (response.data.length > 0) {
                setSelectedStockOutCategoryId(response.data[0].stockOutCategoryId);
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...');
        }
    };

    // Get table data
    const getTableData = async () => {
        if (!selectedCategoryId || !selectedStockOutCategoryId) return;

        try {
            let url = `${BACKEND_BASE_URL}inventoryrouter/getOutStockByCategory?productCategory=${selectedCategoryId}&outCategory=${selectedStockOutCategoryId}&export=true`;

            if (filter && state[0].startDate && state[0].endDate) {
                const startDate = state[0].startDate.toDateString();
                const endDate = state[0].endDate.toDateString();
                url += `&startDate=${startDate}&endDate=${endDate}`;
            } else {
                // Default date range if no filter
                const defaultStartDate = new Date('2001-01-10');
                const defaultEndDate = new Date('2030-01-10');
                url += `&startDate=${defaultStartDate.toDateString()}&endDate=${defaultEndDate.toDateString()}`;
            }

            const response = await axios.get(url, config);
            const data = Array.isArray(response.data) ? response.data : [];
            setTableData(data);
            setFilteredData(data);
            setItemDataNull(data.length === 0);
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...');
            setTableData([]);
            setFilteredData([]);
            setItemDataNull(true);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    const handleStockOutCategoryChange = (event) => {
        setSelectedStockOutCategoryId(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDateFilterApply = () => {
        setFilter(true);
        getTableData();
        handleClose();
    };

    const handleDateFilterReset = () => {
        setFilter(false);
        setState([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
        getTableData();
    };

    const handleExportPDF = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            if (!selectedCategoryId || !selectedStockOutCategoryId) {
                setError('Please select a category and stock out category');
                return;
            }

            let url = filter
                ? `${BACKEND_BASE_URL}inventoryrouter/exportPdfOutStockByCategory?productCategory=${selectedCategoryId}&outCategory=${selectedStockOutCategoryId}&startDate=${state[0].startDate.toDateString()}&endDate=${state[0].endDate.toDateString()}`
                : `${BACKEND_BASE_URL}inventoryrouter/exportPdfOutStockByCategory?productCategory=${selectedCategoryId}&outCategory=${selectedStockOutCategoryId}&startDate=${new Date('2001-01-10').toDateString()}&endDate=${new Date('2030-01-10').toDateString()}`;

            await axios({
                url: url,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Stock_Out_List_' + new Date().toLocaleDateString() + '.pdf'
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
    };

    if (success) {
        toast('success', {
            type: 'success',
            toastId: 'success',
            position: "top-right",
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
        }, 50);
    }

    if (error) {
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
        <div className='BilingDashboardContainer BilingDashboardContainerForDashBoardOnly p-3'>
            <div className='col-span-12'>
                <div className='productTableSubContainer static'>
                    <div className='h-full grid grid-cols-12'>
                        <div className='h-full col-span-9'>
                            <div className='flex gap-3 h-full'>
                                <div className='col-span-1 productTabAll'>
                                    <div className='statusTabtext' style={{ width: '270px' }}>Stock In Category Stock Out</div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4 col-span-3 justify-self-end w-full pr-3 h-full justify-end'>
                            <div className='self-center'>
                                <button className='addProductBtn' onClick={handleExportPDF}>
                                    <PictureAsPdfIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                                    Export PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <div className="maina_box">
                {stockInCategories.length > 0 && (
                    <div className="sidebar overflow-y-auto blackCountLogoWrp shadow-2xl py-4 my-4 mr-4 static">
                        {stockInCategories.map(category => (
                            <div
                                key={category.stockInCategoryId}
                                className={`sidebar_menu my-2 flex justify-between cursor-pointer rounded-lg p-2 text-start text-lg ${selectedCategoryId === category.stockInCategoryId ? 'ClickedBlueBg' : 'hover:bg-gray-700 hover:text-white'}`}
                                onClick={() => handleCategoryClick(category.stockInCategoryId)}
                            >
                                <span className='w-full'>{category.categoryName}</span>
                                <span className='w-6 text-end'>{category.numOfProduct}</span>
                            </div>
                        ))}
                    </div>
                )}
                <TableContainer className=''>
                    <div className="mt-4">
                        {!itemDataNull && (
                            <div>
                                <div className="patti rounded-lg shadow-md p-2 mb-2 bg-white w-full">
                                    <div className="mainANotherDiv gap-4 justify-between">
                                        <div className='flex gap-4'>
                                            <Search className='border'>
                                                <SearchIconWrapper>
                                                    <SearchIcon />
                                                </SearchIconWrapper>
                                                <StyledInputBase
                                                    placeholder="Search…"
                                                    inputProps={{ 'aria-label': 'search' }}
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                />
                                            </Search>
                                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                                <InputLabel id="stock-out-category-label">Stock Out Category</InputLabel>
                                                <Select
                                                    labelId="stock-out-category-label"
                                                    id="stock-out-category-select"
                                                    value={selectedStockOutCategoryId}
                                                    label="Stock Out Category"
                                                    onChange={handleStockOutCategoryChange}
                                                >
                                                    {stockOutCategories.map((category) => (
                                                        <MenuItem key={category.stockOutCategoryId} value={category.stockOutCategoryId}>
                                                            {category.stockOutCategoryName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <div className='flex'>
                                                <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;
                                                    {(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} --
                                                    {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                                </div>
                                                <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={handleDateFilterReset}>
                                                    <CloseIcon />
                                                </button>
                                            </div>
                                        </div>
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
                                            onChange={item => { setState([item.selection]); }}
                                            direction="horizontal"
                                            months={2}
                                            showSelectionPreview={true}
                                            moveRangeOnFirstSelection={false}
                                        />
                                        <div className='mt-8 grid gap-4 grid-cols-12'>
                                            <div className='col-span-3 col-start-7'>
                                                <button className='stockInBtn' onClick={handleDateFilterApply}>Apply</button>
                                            </div>
                                            <div className='col-span-3'>
                                                <button className='stockOutBtn' onClick={handleClose}>Cancel</button>
                                            </div>
                                        </div>
                                    </Box>
                                </Popover>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        borderBottomLeftRadius: '10px',
                                        borderBottomRightRadius: '10px',
                                        paddingLeft: '12px',
                                        paddingRight: '12px',
                                        paddingTop: '12px',
                                        overflowY: 'auto',
                                    }}
                                    className='CustomDashBoardTableHeight'
                                >
                                    <Table aria-label="sticky table" sx={{ minWidth: 750, overflow: 'hidden' }} className=''>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell>Total Out Stock</TableCell>
                                                <TableCell align="right">Total Out Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className=''>
                                            {Array.isArray(filteredData) && filteredData.length > 0 ? (
                                                filteredData.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell style={{ maxWidth: '15px', width: '15px' }}>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.productName || '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.remainingStock || '-'}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {item.totalOutPrice ? `₹${item.totalOutPrice.toLocaleString()}` : '₹0'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center" style={{ padding: '40px' }}>
                                                        <div className="text-center">
                                                            <RestaurantMenuIcon className='restaurantMenu' />
                                                            <br />
                                                            <div className="text-2xl text-gray">
                                                                No Data Found
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                        {itemDataNull && (
                            <div className="w-full flex justify-center">
                                <div className='text-center'>
                                    <RestaurantMenuIcon className='restaurantMenu' />
                                    <br />
                                    <div className="text-2xl text-gray">
                                        No Data Found
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TableContainer>
            </div>
        </div>
    );
}

export default StockInCategoryWiseOutDashboard;
