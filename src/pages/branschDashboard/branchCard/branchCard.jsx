import './branchCard.css'
import Logo from '../../../assets/branch/RAJMANDIR.png'
import LogoWithDate from '../../../assets/branch/RAJMANDIR_withDate.png'
import Menutemp from '../menu';

function BranchCard(props) {
    // const getImg = (imgname) => {
    //     switch (imgname) {
    //         case 'BOB':
    //             return BOB;
    //         case 'Centrel':
    //             return CentralBank;
    //         case 'Dena':
    //             return DenaBank;
    //         case 'HDFC':
    //             return HDFCBank;
    //         case 'ICICI':
    //             return ICICIBank;
    //         case 'Nagrik':
    //             return NagrikBank;
    //         case 'POST':
    //             return PostBank;
    //         case 'SBI':
    //             return SBI;
    //         case 'HomeBank':
    //             return HomeBank;
    //         case 'Wallet':
    //             return Wallet;
    //         case 'Other':
    //             return OtherBank;
    //         case 'caterers':
    //             return caterers;
    //         default:
    //             return OtherBank;
    //     }
    // }
    const handleEdit = (row) => {
        props.editBranch(props.data.branchId, props.data.branchName)
    }
    const handleDelete = () => {
        props.deleteBranch(props.data.branchId);
    }
    return (
        <div className='BranchCard' key={props.data.branchId}>
            <div className='flex justify-end'>
                <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} />
            </div>
            <div className='h-3/5 flex w-full' onClick={() => props.goToBranch(props.data.branchId, props.data.branchName)} >
                <div className='BranchLogo flex justify-center'>
                    <img src={LogoWithDate} alt='delivery boy' />
                </div>
            </div>
            <div className='consoleName mb-4' onClick={() => props.goToBranch(props.data.branchId, props.data.branchName)} >
                {props.data.branchName}
            </div>
        </div >
    )
}

export default BranchCard;

