import './productQtyCard.css';
import Tooltip from '@mui/material/Tooltip';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

function ProductQtyCountCard(props) {
    return (
        <div className='productQtyCountcard flex gap-4' key={props.index}>
            <Tooltip title={props.productName} placement="top-start" arrow>
                <div className='productQtyNameProduct self-center'>
                    {props.productName}
                </div>
            </Tooltip>
            <div className='self-center countWwrpProduct'>
                <Tooltip title={parseFloat(props.productPrice ? props.productPrice : 0).toLocaleString('en-IN')} placement="top-end" arrow>
                    <div className='countTextProduct flex justify-between'>
                        <div className='text-ellipsis overflow-hidden w-full'>{props.productQty}</div>
                        {/* <div className='text-ellipsis overflow-hidden priceP'><CurrencyRupeeIcon /> {parseFloat(props.productPrice ? props.productPrice : 0).toLocaleString('en-IN')}</div> */}
                    </div>
                </Tooltip>
            </div>
        </div >
    )
}

export default ProductQtyCountCard;