import './consoleCard.css'
import deliveryBoyLogo from '../../../../../assets/deliveryBoy.svg'
import bhagwatiLogo from '../../../../../assets/bhagwatiLogo.png';
import img11 from '../../../../../assets/img11.png';
import userAdd from '../../../../../assets/userAdd.png';
import staff from '../../../../../assets/staff2.png';
import expense from '../../../../../assets/expense.png';
import userList from '../../../../../assets/userList.png';
import bank from '../../../../../assets/bank.png';
import report from '../../../../../assets/report.png';
import factory from '../../../../../assets/factory/factory.png'
import units from '../../../../../assets/factory/unit.png'
import Menu from '../../../../../assets/menu.png'
import comment from '../../../../../assets/comment.png'
import gst from '../../../../../assets/gst.png'
import upi from '../../../../../assets/upi.svg'
import billcategory from '../../../../../assets/billcategory.png'
import checkout from '../../../../../assets/checkout.png'
function ConsoleCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            case 'img11':
                return img11;
            case 'staff':
                return staff;
            case 'expense':
                return expense;
            case 'userList':
                return userList;
            case 'bank':
                return bank;
            case 'report':
                return report;
            case 'sales':
                return report;
            case 'Menu':
                return Menu;
            case 'comment':
                return comment;
            case 'upi':
                return upi;
            case 'firm':
                return gst;
            case 'customer':
                return userList;
            case 'category':
                return billcategory;
            case 'factory':
                return factory;
            case 'units':
                return units;
            case 'checkout':
            case 'billing':
                return checkout;
            default:
                return userAdd;
        }
    }
    return (
        <div className='consoleCard' onClick={() => props.goToAddUSer()}>
            <div className='consoleLogo flex justify-center'>
                <img src={getImg(props.imgName)} alt='delivery boy' />
            </div>
            <div className='consoleName'>
                {props.name}
            </div>
        </div>
    )
}

export default ConsoleCard;

