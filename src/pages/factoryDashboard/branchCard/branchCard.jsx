import './branchCard.css'
import Logo from '../../../assets/branch/RAJMANDIR.png'
import LogoWithDate from '../../../assets/branch/RAJMANDIR_withDate.png'
import TEMP from '../../../assets/factory/production.png'
import material from '../../../assets/factory/organic.png'
import Menutemp from '../menu';

function BranchCard(props) {
    const handleEdit = (row) => {
        props.editBranch(props.data.mfProductCategoryId, props.data.mfProductCategoryName)
    }
    const handleDelete = () => {
        props.deleteBranch(props.data.mfProductCategoryId);
    }
    return (
        <div className='BranchCard' key={props.data.mfProductCategoryId}>
            {props.role == 1 ?
                <div className='flex justify-end'>
                    <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} />
                </div> :
                <div className='pt-8'>
                </div>
            }
            <div className='h-3/5 flex w-full' onClick={() => props.goToBranch(props.data.mfProductCategoryId, props.data.mfProductCategoryName)} >
                <div className='BranchLogo flex justify-center'>
                    <img src={TEMP} alt='delivery boy' />
                </div>
            </div>
            <div className='consoleName mb-4' onClick={() => props.goToBranch(props.data.mfProductCategoryId, props.data.mfProductCategoryName)} >
                {props.data.mfProductCategoryName}
            </div>
        </div >
    )
}

export default BranchCard;

