import './branchCard.css'
import Logo from '../../../assets/branch/RAJMANDIR.png'
import LogoWithDate from '../../../assets/branch/RAJMANDIR_withDate.png'
import TEMP from '../../../assets/factory/production.png'
import material from '../../../assets/factory/organic.png'
import Menutemp from '../menu';
import { useNavigate } from "react-router-dom";

function MaterialCard(props) {
    const navigate = useNavigate();
    const goToMaterial = () => {
        props.role == 6 ? navigate('/inOut/material/materialTable') : props.role == 1 ? navigate('/material/materialTable') : navigate('/stock/material/materialTable');
    }
    return (
        <div className='BranchCard'>
            <div className='flex justify-end pt-10' onClick={goToMaterial}>
                {/* <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} /> */}
            </div>
            <div className='h-3/5 flex w-full' onClick={goToMaterial}>
                <div className='BranchLogo flex justify-center'>
                    <img src={material} alt='delivery boy' />
                </div>
            </div>
            <div className='consoleName mb-4' onClick={goToMaterial}>
                {'Raw Materials'}
            </div>
        </div >
    )
}

export default MaterialCard;

