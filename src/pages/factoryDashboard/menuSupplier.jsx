import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";


const ITEM_HEIGHT = 48;

function MenuSupplier(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const navigate = useNavigate();
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEditClick = (id) => {
        navigate(`/editSupplier/${id}`)
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem key={'makePayment'}
                    onClick={() => {
                        handleClose();
                        props.handleOpen(props.data)
                    }}>
                    Make Payment
                </MenuItem>
                <MenuItem key={'delete'}
                    onClick={() => {
                        handleClose();
                        props.deleteSupplier(props.supplierId)
                    }}>
                    Delete
                </MenuItem>
                <MenuItem key={'Edit'}
                    onClick={() => {
                        handleClose();
                        handleEditClick(props.supplierId)
                    }}>
                    Edit
                </MenuItem>
            </Menu>
        </div >
    );
}

export default MenuSupplier;


