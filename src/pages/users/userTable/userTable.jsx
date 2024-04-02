import './userTable.css'
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Menutemp from './menu';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function UserTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const [rights, setRights] = useState();
    const [branch, setBranch] = useState();
    const [formData, setFormData] = useState({
        userFirstName: '',
        userLastName: '',
        userGender: '',
        userName: '',
        password: '',
        emailId: '',
        userRights: '',
    });
    const [formDataError, setFormDataError] = useState({
        userFirstName: false,
        userLastName: false,
        userGender: false,
        userName: false,
        password: false,
        emailId: false,
        userRights: false,
    })

    const [fields, setFields] = useState([
        'userFirstName',
        'userLastName',
        'userGender',
        'userName',
        'password',
        'emailId',
        'userRights',
    ])
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [data, setData] = React.useState();
    const [isEdit, setIsEdit] = React.useState(false);

    const reset = () => {
        setFormData({
            userFirstName: '',
            userLastName: '',
            userGender: '',
            userName: '',
            password: '',
            emailId: '',
            userRights: ''
        });
        setFormDataError({
            userFirstName: false,
            userLastName: false,
            userGender: false,
            userName: false,
            password: false,
            emailId: false,
            userRights: false,
        })
        setIsEdit(false);
    }
    const editUser = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/updateUserDetailsByBranchOwner`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                getData();
                setFormData({
                    userFirstName: '',
                    userLastName: '',
                    userGender: '',
                    userName: '',
                    password: '',
                    emailId: '',
                    userRights: '',
                });
                setFormDataError({
                    userFirstName: false,
                    userLastName: false,
                    userGender: false,
                    userName: false,
                    password: false,
                    emailId: false,
                    userRights: false,
                });
                setOpen(false);
                setIsEdit(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getRights = async () => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/ddlRights`, config)
            .then((res) => {
                setRights(res.data);
            })
    }
    const getBranches = async () => {
        await axios.get(`${BACKEND_BASE_URL}branchrouter/getBranchList`, config)
            .then((res) => {
                setBranch(res.data);
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            console.log('>>>>>>>>>>', formData)

            const isValidate = fields.filter(element => {
                if (element === 'emailId') {
                    return null
                } else if (formDataError[element] === true || formData[element] === '') {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addUser()
            }
        }
    }
    const addUser = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/addUserDetailsByBranchOwner`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                setFormData({
                    userFirstName: '',
                    userLastName: '',
                    userGender: '',
                    userName: '',
                    password: '',
                    emailId: '',
                    userRights: '',
                });
                setFormDataError({
                    userFirstName: false,
                    userLastName: false,
                    userGender: false,
                    userName: false,
                    password: false,
                    emailId: false,
                    userRights: false,
                });
                getData();
                reset();
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/fillUserDetails?userId=${id}`, config)
            .then((res) => {
                setFormData(res.data);
                setIsEdit(true);
                setOpen(true);
            })
    }
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const deleteData = async (id) => {
        setLoading(true);
        await axios.delete(`${BACKEND_BASE_URL}userrouter/removeUser?userId=${id}`, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                getData();
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    useEffect(() => {
        getData();
        getRights();
    }, [])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        getDataOnPageChange(newPage + 1, rowsPerPage)
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getDataOnPageChange(1, parseInt(event.target.value, 10))
    };
    const handleOpen = () => setOpen(true);
    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete User?")) {
            deleteData(id);
            setTimeout(() => {
                getData()
            }, 1000)
        }
    }
    const handleClose = () => {
        setOpen(false);
        setFormData({
            userFirstName: '',
            userLastName: '',
            userGender: '',
            userName: '',
            password: '',
            emailId: '',
            userRights: ''
        });
        setFormDataError({
            userFirstName: false,
            userLastName: false,
            userGender: false,
            userName: false,
            password: false,
            emailId: false,
            userRights: false,
        })
        setIsEdit(false);
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
    return (
        <div className='grid grid-cols-12 userTableContainer'>
            <div className='col-span-10 col-start-2'>
                <div className='userTableSubContainer'>
                    <div className='flex justify-center w-full'>
                        <div className='tableHeader flex justify-between'>
                            <div>
                                User List
                            </div>
                        </div>
                    </div>
                    <div className=' grid col-span-2 col-start-11 pr-6 flex'>
                        <div className='self-center justify-self-end'>
                            <button className='addProductBtn' onClick={handleOpen}>Add User</button>
                        </div>
                    </div>
                    <div className='tableContainerWrapper'>
                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">Gender</TableCell>
                                        <TableCell align="left">User Name</TableCell>
                                        <TableCell align="left">Password</TableCell>
                                        <TableCell align="left">Role</TableCell>
                                        <TableCell align="left">email</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row, index) => (
                                        totalRows !== 0 ?
                                            <TableRow
                                                hover
                                                key={row.userId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                style={{ cursor: "pointer" }}
                                                className='tableRow'
                                            >
                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.userFullName}
                                                </TableCell>
                                                <TableCell align="left" >{row.userGender}</TableCell>
                                                <TableCell align="left" >{row.userName}</TableCell>
                                                <TableCell align="left" >{row.password}</TableCell>
                                                <TableCell align="left" >{row.rightsName}</TableCell>
                                                <TableCell align="left" >{row.emailAddress}</TableCell>
                                                <TableCell align="right">
                                                    <Menutemp data={row} deleteUser={handleDeleteUser} handleEdit={handleEdit} />
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
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit User' : 'Add User'}
                    </Typography>
                    <div className="stockInOutContainer">
                        <div className='grid grid-cols-12 gap-6'>
                            <div className="col-span-3">
                                <TextField
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userFirstName: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userFirstName: false
                                            }))
                                        }
                                    }}
                                    onChange={onChange}
                                    value={formData && formData.userFirstName ? formData.userFirstName : ''}
                                    error={formDataError.userFirstName}
                                    helperText={formDataError.userFirstName ? "Please Enter First Name" : ''}
                                    name="userFirstName"
                                    id="outlined-required"
                                    label="First Name"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <TextField
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userLastName: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userLastName: false
                                            }))
                                        }
                                    }}
                                    onChange={onChange}
                                    value={formData && formData.userLastName ? formData.userLastName : ''}
                                    error={formDataError.userLastName}
                                    helperText={formDataError.userLastName ? "Please Enter Last Name" : ''}
                                    name="userLastName"
                                    id="outlined-required"
                                    label="Last Name"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <TextField
                                    onChange={onChange}
                                    value={formData && formData.emailId ? formData.emailId : ''}
                                    name="emailId"
                                    id="outlined-required"
                                    label="Email Id"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                            <div className='col-span-3'>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label" required error={formDataError.userGender}>Gender</FormLabel>
                                    <RadioGroup
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    userGender: true
                                                }))
                                            }
                                            else {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    userGender: false
                                                }))
                                            }
                                        }}
                                        row
                                        required
                                        onChange={(e) => {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userGender: false
                                            }))
                                            onChange(e)
                                        }}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        value={formData && formData.userGender ? formData.userGender : ''}
                                        error={formDataError.userGender}
                                        name="userGender"
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div className="col-span-3">
                                <TextField
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userName: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                userName: false
                                            }))
                                        }
                                    }}
                                    onChange={onChange}
                                    value={formData && formData.userName ? formData.userName : ''}
                                    error={formDataError.userName}
                                    helperText={formDataError.userName ? "Please Enter First Name" : ''}
                                    name="userName"
                                    id="outlined-required"
                                    label="User Name"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <TextField
                                    onBlur={(e) => {
                                        if (e.target.value.length < 4) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                password: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                password: false
                                            }))
                                        }
                                    }}
                                    onChange={onChange}
                                    value={formData && formData.password ? formData.password : ''}
                                    error={formDataError.password}
                                    helperText={formDataError.password ? "Enter valid password (min 4 character)" : ''}
                                    name="password"
                                    id="outlined-required"
                                    label="Password"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <FormControl style={{ minWidth: '100%' }}>
                                    <InputLabel id="demo-simple-select-label" required error={formDataError.userRights}>User Role</InputLabel>
                                    <Select
                                        onBlur={(e) => {
                                            if (!e.target.value) {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    userRights: true
                                                }))
                                            }
                                            else {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    userRights: false
                                                }))
                                            }
                                        }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData && formData.userRights ? formData.userRights : ''}
                                        error={formDataError.userRights}
                                        name="userRights"
                                        label="User Role"
                                        onChange={onChange}
                                    >
                                        {
                                            rights ? rights.map((right) => (
                                                <MenuItem key={right.rightsId} value={right.rightsId}>{right.rightsName}</MenuItem>
                                            )) : <MenuItem key={''} value={''}>{ }</MenuItem>
                                        }

                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className='addUserBtnContainer grid mt-6 grid-rows-1'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-start-7 col-span-3'>
                                    <button onClick={() => isEdit ? editUser() : submit()} className='saveBtn' >Save</button>
                                </div>
                                <div className='col-span-3'>
                                    <button onClick={() => handleClose()} className='resetBtn'>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default UserTable;