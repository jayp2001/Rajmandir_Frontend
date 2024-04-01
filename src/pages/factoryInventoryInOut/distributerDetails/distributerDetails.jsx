import './distributerDetails.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CountCard from '../countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import ProductQtyCountCard from './productQtyCard/productQtyCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Menutemp from '../transactionTable/menu';
import MenuStockInOut from './menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FactoryDistributerDetailInOut() {
    let { id } = useParams();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [formData, setFormData] = React.useState({
        distributorId: '',
        receivedBy: '',
        paidAmount: '',
        transactionNote: '',
        remainingAmount: '',
        supplierName: '',
    });
    const [formDataError, setFormDataError] = React.useState({
        receivedBy: false,
        paidAmount: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'receivedBy',
        'paidAmount',
    ]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [stockInData, setStockInData] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsDebit, setTotalRowsDebit] = React.useState(0);
    const [totalRowsProduct, setTotalRowsProduct] = React.useState(0);
    const [filter, setFilter] = React.useState(false);
    const [tab, setTab] = React.useState(1);
    const [tabStockIn, setTabStockIn] = React.useState('');
    const [suppilerDetails, setSuppilerDetails] = useState();
    const [statisticsCount, setStatisticsCounts] = useState();
    const [productQtyCount, setProductQty] = useState();
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [productTable, setProductTable] = React.useState();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
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
    const getSuppilerDetails = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getFactoryDistributorDetailsById?distributorId=${id}`, config)
            .then((res) => {
                console.log(">>>", res.data);
                setSuppilerDetails(res.data);
                setFormData((perv) => ({
                    ...perv,
                    supplierName: res.data.firmName,
                    receivedBy: res.data.nickName,
                    distributorId: id
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatistics = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCounterDetailsById?distributorId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
                setFormData((perv) => ({
                    ...perv,
                    remainingAmount: res.data.remainingAmount,
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?&page=${page + 1}&numPerPage=${rowsPerPage}&distributorId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByTab = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?&page=${1}&numPerPage=${5}&distributorId=${id}&payType=${tab}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByTabByFilter = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&distributorId=${id}&payType=${tab}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    // const getStockInDataonRemoveFilter = async (tab) => {
    //     await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${page + 1}&numPerPage=${rowsPerPage}&distributorId=${id}&payType=${tabStockIn}`, config)
    //         .then((res) => {
    //             setStockInData(res.data.rows);
    //             setTotalRows(res.data.numRows);
    //         })
    //         .catch((error) => {
    //              setError(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?page=${pageNum}&numPerPage=${rowPerPageNum}&distributorId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&distributorId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCashAndDebit?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&distributorId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatisticsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getDistributorCounterDetailsById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&distributorId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getRawMaterialsBySupplierId?distributorId=${id}`, config)
            .then((res) => {
                setProductQty(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getRawMaterialsBySupplierId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&distributorId=${id}`, config)
            .then((res) => {
                setProductQty(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tabStockIn !== 'transaction' && tabStockIn !== 'products') {
            if (filter) {
                getStockInDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockInDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else if (tabStockIn === 'products') {
            if (filter) {
                getProductDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getProductDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else {
            if (filter) {
                getDebitDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDebitDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabStockIn !== 'transaction' && tabStockIn !== 'products') {
            if (filter) {
                getStockInDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockInDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabStockIn === 'products') {
            if (filter) {
                getProductDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getProductDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else {
            if (filter) {
                getDebitDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDebitDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;

    const getDebitData = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getdistributorDebitTransactionList?&page=${page + 1}&numPerPage=${rowsPerPage}&distributorId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitDataByTab = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getdistributorDebitTransactionList?&page=${1}&numPerPage=${5}&distributorId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductDataByTab = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getAllProductDetailsByDistributorId?&page=${1}&numPerPage=${5}&distributorId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getdistributorDebitTransactionList?page=${pageNum}&numPerPage=${rowPerPageNum}&distributorId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getProductDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getAllProductDetailsByDistributorId?page=${pageNum}&numPerPage=${rowPerPageNum}&distributorId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getdistributorDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&distributorId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getProductDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getAllProductDetailsByDistributorId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&distributorId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getdistributorDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&distributorId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/getAllProductDetailsByDistributorId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&distributorId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getProductCount();
        getStatistics();
        getSuppilerDetails();
        getStockInData()
    }, [])
    const onChange = (e) => {
        if (e.target.name === 'paidAmount') {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const makePayment = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addFacttorySupplierTransactionDetails`, formData, config)
            .then((res) => {
                setSuccess(true)
                setLoading(false)
                setFormData((perv) => ({
                    ...perv,
                    receivedBy: '',
                    paidAmount: '',
                    transactionNote: '',
                }))
                getStatistics();
                getDebitData();
                setFormDataError((perv) => ({
                    ...perv,
                    receivedBy: false,
                    paidAmount: false,
                }))

            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitPayment = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeild.filter(element => {
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
                makePayment()
            }
        }
    }
    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeRawMaterialStockInTransaction?rmStockInId=${id}`, config)
            .then((res) => {
                setSuccess(true)
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
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}mfProductrouter/removeFactorySupplierTransactionDetails?supplierTransactionId=${id}`, config)
            .then((res) => {
                getStatistics();
                setSuccess(true)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete transaction?")) {
            deleteData(id);
            setTimeout(() => {
                getDebitData();
            }, 1000)
        }
    }
    const getInvoice = async (tId, suppilerName) => {
        if (window.confirm('Are you sure you want to Download Invoice ... ?')) {
            await axios({
                url: `${BACKEND_BASE_URL}mfProductrouter/exportTransactionInvoice?transactionId=${tId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = suppilerName + '_' + new Date().toLocaleDateString() + '.pdf'
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
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForRawMaterialStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&distributorId=${id}&payType=${tabStockIn}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForRawMaterialStockInList?startDate=${''}&endDate=${''}&distributorId=${id}&payType=${tabStockIn}`,
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

    const allProductExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForAllRawMaterialsBySupplierId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&distributorId=${id}&payType=${tabStockIn}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForAllRawMaterialsBySupplierId?startDate=${''}&endDate=${''}&distributorId=${id}&payType=${tabStockIn}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'AllProducts_' + new Date().toLocaleDateString() + '.xlsx'
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

    const transactionExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForRmDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&distributorId=${id}` : `${BACKEND_BASE_URL}mfProductrouter/exportExcelSheetForRmDebitTransactionList?startDate=${''}&endDate=${''}&distributorId=${id}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'Transactions_' + new Date(state[0].startDate).toLocaleDateString() + ' - ' + new Date(state[0].endDate).toLocaleDateString() + '.xlsx' : 'Transactions_' + new Date().toLocaleDateString();
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

    if (!suppilerDetails) {
        return null;
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
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-5 mt-6 grid gap-2 suppilerDetailContainer'>
                    <div className='suppilerHeader'>
                        Distributor Details
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Distributor Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.distributorFirstName} {suppilerDetails.distributorLastName}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Nick Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.distributorNickName}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Firm Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.distributorFirmName}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Address :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.distributorFirmAddress}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Mobile No :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.distributorPhoneNumber}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 '>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Email Id :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.distributorEmailId}
                        </div>
                    </div>
                </div>
                <div className='col-span-7 mt-6'>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-5'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-6 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                    }} >
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                                {/* <div className={`flex col-span-6 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(2);
                                                    }}>
                                                    <div className='statusTabtext'>Profits</div>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className='col-span-7 flex justify-end pr-4'>
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
                                                        getProductCount();
                                                        getStatistics();
                                                        setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTab('')
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
                                                                setFilter(true); handleClose(); getStatisticsByFilter(); setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
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
                            <div className='grid grid-cols-6 gap-6'>
                                {/* <div className='col-span-3'>
                                    <CountCard color={'black'} count={statisticsCount && statisticsCount.totalBusiness ? statisticsCount.totalBusiness : 0} desc={'Total Business'} />
                                </div> */}
                                <div className='col-span-3'>
                                    <CountCard color={'pink'} count={statisticsCount && statisticsCount.remainingAmount ? statisticsCount.remainingAmount : 0} desc={'Remaining Payment'} />
                                </div>
                                <div className='col-span-3'>
                                    <CountCard color={'yellow'} count={statisticsCount && statisticsCount.totalProduct ? statisticsCount.totalProduct : 0} desc={'Total Product'} />
                                </div>
                            </div>
                            {/* <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalBusinessOfDebit ? statisticsCount.totalBusinessOfDebit : 0} desc={'Total Debit'} />
                                </div>
                                <div className='col-span-3'>
                                    <CountCard color={'orange'} count={statisticsCount && statisticsCount.totalPaid ? statisticsCount.totalPaid : 0} desc={'Paid'} />
                                </div>
                            </div>
                            <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    <CountCard color={'green'} count={statisticsCount && statisticsCount.totalBusinessOfCash ? statisticsCount.totalBusinessOfCash : 0} desc={'Total Cash'} />
                                </div>

                            </div> */}
                        </div> :
                        <div className='grid gap-4 mt-12' style={{ maxHeight: '332px', overflowY: 'scroll' }}>
                            <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    <CountCard color={'black'} count={statisticsCount && statisticsCount.totalBusiness ? statisticsCount.totalBusiness : 0} desc={'Total Business'} />
                                </div>
                                <div className='col-span-3'>
                                    <CountCard color={'pink'} count={statisticsCount && statisticsCount.totalCost ? statisticsCount.totalCost : 0} desc={'Production Cost'} />
                                </div>
                            </div>
                            <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalBusiness && statisticsCount.totalCost ? statisticsCount.totalBusiness - statisticsCount.totalCost : 0} desc={'Total Debit'} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='mt-6'>
                <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                    <AccordionSummary
                        sx={{ height: '60px', borderRadius: '0.75rem' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => {
                            setFormData((perv) => ({
                                ...perv,
                                paidAmount: null,
                                transactionNote: '',
                            }))
                            setFormDataError((perv) => ({
                                ...perv,
                                receivedBy: false,
                                paidAmount: false,
                            }))
                        }}
                    >
                        <div className='stockAccordinHeader'>Make Payment to {formData.supplierName}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='stockInOutContainer'>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <TextField
                                        disabled={formData.remainingAmount === 0 ? true : false}
                                        onBlur={(e) => {
                                            if (e.target.value < 2) {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    receivedBy: true
                                                }))
                                            }
                                            else {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    receivedBy: false
                                                }))
                                            }
                                        }}
                                        value={formData.receivedBy}
                                        error={formDataError.receivedBy}
                                        helperText={formDataError.receivedBy ? 'Enter Reciver Name' : ''}
                                        name="receivedBy"
                                        id="outlined-required"
                                        label="Received By"
                                        onChange={onChange}
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        disabled={formData.remainingAmount === 0 ? true : false}
                                        onBlur={(e) => {
                                            if (e.target.value < 0) {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    paidAmount: true
                                                }))
                                            }
                                            else {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    paidAmount: false
                                                }))
                                            }
                                        }}
                                        type="number"
                                        label="Paid Amount"
                                        fullWidth
                                        onChange={onChange}
                                        value={formData.paidAmount ? formData.paidAmount : ""}
                                        error={formDataError.paidAmount}
                                        // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                        helperText={`Remaining Payment ${formData.remainingAmount}`}
                                        name="paidAmount"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                        }}
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        disabled={formData.remainingAmount === 0 ? true : false}
                                        onChange={onChange}
                                        value={formData.transactionNote}
                                        name="transactionNote"
                                        id="outlined-required"
                                        label="Comment"
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                            </div>
                            <div className='mt-4 grid grid-cols-12 gap-6'>
                                <div className='col-span-3'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        !formData.remainingAmount == 0 && submitPayment();
                                    }}>Make Payment</button>
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        setFormData((perv) => ({
                                            ...perv,
                                            paidAmount: '',
                                            transactionNote: '',
                                        }))
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            receivedBy: false,
                                            paidAmount: false,
                                        }))
                                    }}>Cancle</button>
                                </div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-2 justify-center ${tabStockIn === null || tabStockIn === '' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTabStockIn(''); setPage(0); setRowsPerPage(5); filter ? getStockInDataByTabByFilter('') : getStockInDataByTab('');
                                    }}>
                                        <div className='statusTabtext'>Sold Product</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabStockIn === 'debit' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                        setTabStockIn('debit'); setPage(0); filter ? getStockInDataByTabByFilter('debit') : getStockInDataByTab('debit'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Debit</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabStockIn === 'cash' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                        setTabStockIn('cash'); setPage(0); filter ? getStockInDataByTabByFilter('cash') : getStockInDataByTab('cash'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Cash</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tabStockIn === 'transaction' ? 'tabTransaction' : 'productTab'}`} onClick={() => {
                                        setTabStockIn('transaction'); setPage(0); filter ? getDebitDataByFilter() : getDebitDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Transactions</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabStockIn === 'products' ? 'products' : 'productTab'}`} onClick={() => {
                                        setTabStockIn('products'); setPage(0); filter ? getProductDataByFilter() : getProductDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Products</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='userTableSubContainer mt-6'>
                <div className='grid grid-cols-12 pt-6'>
                    <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                        <button className='exportExcelBtn'
                            onClick={() => { tabStockIn !== 'transaction' && tabStockIn !== 'products' ? stockInExportExcel() : tabStockIn === 'products' ? allProductExportExcel() : transactionExportExcel() }}
                        ><FileDownloadIcon />&nbsp;&nbsp;Export Excel</button>
                    </div>
                </div>
                <div className='tableContainerWrapper'>
                    {
                        tabStockIn !== 'transaction' && tabStockIn !== 'products' ?
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Entered By</TableCell>
                                            <TableCell align="left">Product Name</TableCell>
                                            <TableCell align="left">Qty</TableCell>
                                            <TableCell align="right">Sold Price</TableCell>
                                            <TableCell align="left">Pay Mode</TableCell>
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
                                                    key={row.outDataId}
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
                                                    <TableCell align="left" >{row.mfProductName}</TableCell>
                                                    <TableCell align="left" >{row.qty}</TableCell>
                                                    <TableCell align="right" >{parseFloat(row.sellAmount ? row.sellAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="left" >{row.payType}</TableCell>
                                                    <Tooltip title={row.stockInComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.stockInComment}</div></TableCell></Tooltip>
                                                    <TableCell align="left" >{row.sellDate}</TableCell>
                                                    <TableCell align="right">
                                                        <MenuStockInOut stockInOutId={row.rmStockInId} data={row} deleteStockInOut={handleDeleteStockIn} />
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
                            </TableContainer> :
                            tabStockIn === 'products' ?
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell align="left">Sold Qty</TableCell>
                                                <TableCell align="left">Selling Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {productTable?.map((row, index) => (
                                                totalRowsProduct !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.mfProductId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.mfProductName}
                                                        </TableCell>
                                                        <TableCell align="left" >{row.remainingStock}</TableCell>
                                                        <TableCell align="left" >{parseFloat(row.totalSellPrice ? row.totalSellPrice : 0).toLocaleString('en-IN')}</TableCell>
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
                                        count={totalRowsProduct}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer> :
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Paid By</TableCell>
                                                <TableCell align="left">Received By</TableCell>
                                                <TableCell align="right">Pending Amount</TableCell>
                                                <TableCell align="right">Paid Amount</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {debitTransaction?.map((row, index) => (
                                                totalRowsDebit !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.supplierTransactionId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.paidBy}
                                                        </TableCell>
                                                        <TableCell align="left" >{row.receivedBy}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.pendingAmount ? row.pendingAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.paidAmount ? row.paidAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        <Tooltip title={row.transactionNote} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.transactionNote}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.transactionDate}</TableCell>
                                                        <TableCell align="left" >{row.transactionTime}</TableCell>
                                                        <TableCell align="right">
                                                            <Menutemp transactionId={row.supplierTransactionId} getInvoice={getInvoice} data={row} deleteTransaction={handleDeleteTransaction} />
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
                                        count={totalRowsDebit}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                    }
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default FactoryDistributerDetailInOut;