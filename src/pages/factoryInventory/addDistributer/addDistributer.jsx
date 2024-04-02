import './addDistributer.css'
import { useState, useEffect } from "react";
import React from "react";
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import OutlinedInput from '@mui/material/OutlinedInput';
import { BACKEND_BASE_URL } from '../../../url';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
function AddFactoryDistributer() {
    const theme = useTheme();
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [mfProductName, setProductName] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [productList, setProductList] = useState();
    const [formData, setFormData] = useState({
        distributorFirstName: '',
        distributorNickName: '',
        distributorLastName: '',
        distributorFirmName: '',
        distributorFirmAddress: '',
        distributorPhoneNumber: '',
        distributorEmailId: '',
        mfProductId: []
    });
    const [formDataError, setFormDataError] = useState({
        distributorNickName: false,
        distributorFirmName: false,
        distributorFirmAddress: false,
        distributorPhoneNumber: false,
        mfProductId: false
    })
    const handleChange = (event, value) => {
        const products = value?.map((obj) => {
            return obj.mfProductId
        });
        var res = products.filter(elements => {
            return (elements != null && elements !== undefined && elements !== "");
        });
        if (!value.length > 0) {
            setFormDataError((perv) => ({
                ...perv,
                mfProductId: true
            }))
        } else {
            setFormDataError((perv) => ({
                ...perv,
                mfProductId: false
            }))
        }
        setProductName(value);
        setFormData((pervState) => ({
            ...pervState,
            mfProductId: value.length > 0 ? res : [],
        }))
    };

    const [fields, setFields] = useState([
        'distributorNickName',
        'distributorFirmName',
        'distributorEmailId',
        'distributorFirmAddress',
        'distributorPhoneNumber',
        'mfProductId',
    ])

    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}mfProductrouter/ddlManufactureProductData`, config)
            .then((res) => {
                setProductList(res.data);
            })
    }

    useEffect(() => {
        getProductList();
    }, [])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const reset = () => {
        setFormData({
            distributorFirstName: '',
            distributorNickName: '',
            distributorLastName: '',
            distributorFirmName: '',
            distributorFirmAddress: '',
            distributorPhoneNumber: '',
            distributorEmailId: '',
            mfProductId: []
        });
        setFormDataError({
            distributorFirstName: false,
            distributorFirmName: false,
            distributorFirmAddress: false,
            distributorPhoneNumber: false,
            mfProductId: false
        })
        setProductName([]);
    }
    const addSupplier = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}mfProductrouter/addDistributorDetails`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                focus();
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        console.log('>>>>>>>>>>', formData)
        if (loading || success) {

        } else {
            const isValidate = fields.filter(element => {
                if (element === 'distributorEmailId') {
                    return null
                } else if (element === 'mfProductId') {
                    console.log('temp', formData[element])
                    if (!formData[element].length > 0) {
                        setFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return 'mfProductId';
                    }
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
                addSupplier();
            }
        }
    }

    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
        // window.alert()
    }
    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "bottom-right",
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
            setLoading(false)
            setSuccess(false)
            reset()
        }, 50)
    }
    if (error) {
        setLoading(false)
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "bottom-right",
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
        <div className='mainBodyAddSupplier grid content-center'>
            <div className="grid grid-cols-12">
                <div className="col-span-8 col-start-3">
                    <div className="addSupplierCard">
                        <div className="header flex items-center ">
                            <div className="grid justify-items-center w-full">
                                <div className="header_text">
                                    Add Supplier
                                </div>
                            </div>
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-rows-3 gap-6'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            inputProps={{ autoFocus: true }}
                                            onChange={onChange}
                                            value={formData.distributorFirstName}
                                            inputRef={textFieldRef}
                                            name="distributorFirstName"
                                            id="outlined-required"
                                            label="Supplier First Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.distributorLastName}
                                            error={formDataError.distributorLastName}
                                            helperText={formDataError.distributorLastName ? "Please Enter Last Name" : ''}
                                            name="distributorLastName"
                                            id="outlined-required"
                                            label="Distributor Last Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorFirmName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorFirmName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.distributorFirmName}
                                            error={formDataError.distributorFirmName}
                                            helperText={formDataError.distributorFirmName ? "Please Enter Distributor Firm Name" : ''}
                                            name="distributorFirmName"
                                            id="outlined-required"
                                            label="Distributor Firm Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorNickName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorNickName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.distributorNickName}
                                            error={formDataError.distributorNickName}
                                            helperText={formDataError.distributorNickName ? "Please Enter Last Name" : ''}
                                            name="distributorNickName"
                                            id="outlined-required"
                                            label="Distributor Nick Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (!emailRegx.test(e.target.value) && e.target.value) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorEmailId: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorEmailId: false
                                                    }))
                                                }
                                            }}
                                            error={formDataError.distributorEmailId}
                                            helperText={formDataError.distributorEmailId ? "Please Enter valid Email" : ''}
                                            onChange={onChange}
                                            value={formData.distributorEmailId}
                                            name="distributorEmailId"
                                            id="outlined-required"
                                            label="Distributor Email Id"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 10) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorPhoneNumber: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorPhoneNumber: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                    onChange(e)
                                                }
                                            }}
                                            value={formData.distributorPhoneNumber}
                                            error={formDataError.distributorPhoneNumber}
                                            helperText={formDataError.distributorPhoneNumber ? "Please Enter WhatsApp Number" : ''}
                                            name="distributorPhoneNumber"
                                            id="outlined-required"
                                            label="Mobile Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-12">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorFirmAddress: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        distributorFirmAddress: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.distributorFirmAddress}
                                            error={formDataError.distributorFirmAddress}
                                            helperText={formDataError.distributorFirmAddress ? "Please Enter Firm address" : ''}
                                            name="distributorFirmAddress"
                                            id="outlined-required"
                                            label="Distributor Firm Address"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-12">
                                        <Autocomplete
                                            multiple
                                            defaultValue={null}
                                            style={{ minWidth: '100%' }}
                                            limitTags={8}
                                            name='mfProductName'
                                            value={mfProductName ? mfProductName : null}
                                            fullWidth
                                            id="checkboxes-tags-demo"
                                            options={productList ? productList : []}
                                            disableCloseOnSelect
                                            onChange={handleChange}
                                            error={formDataError.mfProductId}
                                            getOptionLabel={(option) => option.mfProductName}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.mfProductName}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField {...params} error={formDataError.mfProductId} label="products" placeholder="Products" />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='addUserBtnContainer grid grid-rows-1'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-start-4 col-span-3'>
                                    <button onClick={() => submit()} className='saveBtn' >Save</button>
                                </div>
                                <div className='col-span-3'>
                                    <button onClick={() => reset()} className='resetBtn'>reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddFactoryDistributer;