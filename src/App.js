import logo from './logo.svg';
import './App.css';
import PageNotFoundRedirect from "./pageNotFound";
import { BrowserRouter ,Route,Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import Dashboard from './pages/inventory/dashboard/dashboard';
import ProtectedUserRoutes from './protectedUserRoutes';
import NavBar from './pages/navBar/nav';
import AddUser from './pages/users/addUser/addUser'
import UserTable from './pages/users/userTable/userTable';
import EditUser from './pages/users/editUser/editUser';
import AddSuppiler from './pages/inventory/addSuppiler/addSuppiler';
import SuppilerTable from './pages/inventory/suppilerTable/suppilerTable';
import EditSuppiler from './pages/inventory/editSuppiler/editSuppiler';
import ProductList from './pages/inventory/product/productList';
import CategoriesTable from './pages/inventory/categoriesTable/categoriesTable';
import StockInOut from './pages/inventory/stockManagement/stockInOut';
import TransactionTable from './pages/inventory/transactionTable/transactionTable';
import SuppilerDetail from './pages/inventory/suppilerDetails/suppilerDetail';
import ProductDetails from './pages/inventory/productDetails/productDetails';
import ProductListTable from './pages/inventory/productListTable/productListTable';
import 'react-toastify/dist/ReactToastify.css';
import EditHistory from './pages/inventory/editHistory/editHistory';
import StockOut from './pages/inventory/stockOut/stockOut';
import ProtectedStockManagerRoutes from './protectedStockManageRoutes';
// import PrintButton from './testThermal';
import ProductDetailsManager from './pages/inventory/stockOut/productDetailsManager';
import StockOutByCategory from './pages/inventory/categoryDetail/categoryDetail';
import ProtectedOwnerRoutes from './protectedOwnerRoutes';
import BranchDashboard from './pages/branschDashboard/branchDashboard';
import UserTableOwner from './pages/branschDashboard/userTable/userTableBranch';
import StockOutByCategoryStockIn from './pages/branschDashboard/categoryDetailStockIn/categoryDetailStockIn';
import SuppilerDetailOwner from './pages/branschDashboard/suppilerDetails/suppilerDetailOwner';
import ProtectedInOutRoutes from './protactedInOutRoutes';
import ProductDetailsInOut from './pages/inventory/roleWisePage/InOut/productDetails/productDetails';
import ProductListTableInOut from './pages/inventory/roleWisePage/InOut/productListTable/productListTable';
import StockInOutInOut from './pages/inventory/roleWisePage/InOut/stockManagement/stockInOut';
import AddSuppilerInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/addSuppiler/addSuppiler';
import EditSuppilerInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/editSuppiler/editSuppiler';
import SuppilerDetailInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/suppilerDetails/suppilerDetail';
import SuppilerTableInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/suppilerTable/suppilerTable';
import ProtactedInOutNpaymentRoutes from './protactedInOutNpaymentRoutes';
import MaterialListTable from './pages/factoryInventory/materialListTable/materialListTable';
import MaterialDetails from './pages/factoryInventory/materialDetails/material';
import FinalProductListTable from './pages/factoryInventory/finalProductListTable/finalProductListTable';
import FinalProductDetails from './pages/factoryInventory/finalProductDetails/finalProductDetails';
import AddFactorySupplier from './pages/factoryInventory/addSuppiler/addSuppiler';
import EditFactorySuppiler from './pages/factoryInventory/editSuppiler/editSuppiler';
import FactorySuppilerTable from './pages/factoryInventory/suppilerTable/suppilerTable';
import FactorySuppilerDetail from './pages/factoryInventory/suppilerDetails/suppilerDetail';
import StockInOutMaterial from './pages/factoryInventory/stockManagementMaterial/stockInOutMaterial';
import EditHistoryMaterial from './pages/factoryInventory/editHistory/editHistory';
import CategoriesTableMaterial from './pages/factoryInventory/categoriesTable/categoriesTable';
import TransactionTableMaterial from './pages/factoryInventory/transactionTable/transactionTable';
import FactoryDashboard from './pages/factoryDashboard/factoryDashboard';
import StockOutByCategoryMaterial from './pages/factoryInventory/categoryDetail/categoryDetail';
import StockOutByCategoryStockInMaterial from './pages/factoryInventory/categoryDetailStockIn/categoryDetailStockIn';
import AddFactoryDistributer from './pages/factoryInventory/addDistributer/addDistributer';
import EditFactoryDistributer from './pages/factoryInventory/editDistributer/editDistributer';
import FactoryDistributerTable from './pages/factoryInventory/distributerTable/distributerTable';
import FactoryDistributerDetail from './pages/factoryInventory/distributerDetails/distributerDetails';
import MaterialTableByDepartment from './pages/factoryInventory/materialTableByDepartment/materialTableByDepartment';
import StockInOutFactory from './pages/factoryInventory/factoryStockManagement/stockInOutFactory';
import TransactionTableDistributer from './pages/factoryInventory/transactionTableDistributer/transactionTableDistributer';
import UnitsTable from './pages/inventory/addUnit/unitTable';
import CategoryWiseOut from './pages/factoryInventory/CategoryWiseOut/categoryWiseOut';
import ProtectedFactoryRoutes from './protectedFactoryRoutes';
import ProtectedFactoryManagerRoutes from './protectedFactoryManagerRoutes';
import MaterialListTableStock from './pages/factoryInventoryStock/materialListTable/materialListTable';
import MaterialDetailsStock from './pages/factoryInventoryStock/materialDetails/material';
import FinalProductListTableStock from './pages/factoryInventoryStock/finalProductListTable/finalProductListTable';
import FinalProductDetailsStock from './pages/factoryInventoryStock/finalProductDetails/finalProductDetails';
import StockInOutFactoryStock from './pages/factoryInventoryStock/factoryStockManagement/stockInOutFactory';
import MaterialTableByDepartmentStock from './pages/factoryInventoryStock/materialTableByDepartment/materialTableByDepartment';
import AddFactorySupplierInOut from './pages/factoryInventoryInOut/addSuppiler/addSuppiler';
import EditFactorySuppilerInOut from './pages/factoryInventoryInOut/editSuppiler/editSuppiler';
import FactorySuppilerTableInOut from './pages/factoryInventoryInOut/suppilerTable/suppilerTable';
import FactorySuppilerDetailInOut from './pages/factoryInventoryInOut/suppilerDetails/suppilerDetail';
import StockOutByCategoryMaterialInOut from './pages/factoryInventoryInOut/categoryDetail/categoryDetail';
import StockOutByCategoryStockInMaterialInOut from './pages/factoryInventoryInOut/categoryDetailStockIn/categoryDetailStockIn';
import MaterialListTableInOut from './pages/factoryInventoryInOut/materialListTable/materialListTable';
import MaterialDetailsInOut from './pages/factoryInventoryInOut/materialDetails/material';
import TransactionTableMaterialInOut from './pages/factoryInventoryInOut/transactionTable/transactionTable';
import CategoriesTableMaterialInOut from './pages/factoryInventoryInOut/categoriesTable/categoriesTable';
import StockInOutMaterialInOut from './pages/factoryInventoryInOut/stockManagementMaterial/stockInOutMaterial';
import FinalProductListTableInOut from './pages/factoryInventoryInOut/finalProductListTable/finalProductListTable';
import CategoryWiseOutInOut from './pages/factoryInventoryInOut/CategoryWiseOut/categoryWiseOut';
import FinalProductDetailsInOut from './pages/factoryInventoryInOut/finalProductDetails/finalProductDetails';
import StockInOutFactoryInOut from './pages/factoryInventoryInOut/factoryStockManagement/stockInOutFactory';
import MaterialTableByDepartmentInOut from './pages/factoryInventoryInOut/materialTableByDepartment/materialTableByDepartment';
import TransactionTableDistributerInOut from './pages/factoryInventoryInOut/transactionTableDistributer/transactionTableDistributer';
import AddFactoryDistributerInOut from './pages/factoryInventoryInOut/addDistributer/addDistributer';
import FactoryDistributerTableInOut from './pages/factoryInventoryInOut/distributerTable/distributerTable';
import EditFactoryDistributerInOut from './pages/factoryInventoryInOut/editDistributer/editDistributer';
import FactoryDistributerDetailInOut from './pages/factoryInventoryInOut/distributerDetails/distributerDetails';
// import SetPrinter from './setPrinter';
function App() {
  return (
    <div className="">
      <BrowserRouter>
       <NavBar/>
            <div className='mainBody'>
              <Routes>
                <Route path="/" element={<ProtectedStockManagerRoutes/>}>
                  <Route path="/stockOut" element={<StockOut />}/>
                  <Route path="/stockManager/productDetail/:id/:name/:unit/:remainingQty" element={<ProductDetailsManager />}/>
                  <Route path='*' element={<PageNotFoundRedirect/>}/>
                </Route>
                 <Route path="/" element={<ProtectedInOutRoutes/>}>
                  <Route path="/InOut/productTable" element={<ProductListTableInOut />}/>
                  <Route path="/InOut/productDetail/:id/:name/:unit/:remainingQty" element={<ProductDetailsInOut />}/>
                  <Route path="/InOut/stockInOut" element={<StockInOutInOut />}/>
                  <Route path='*' element={<PageNotFoundRedirect/>}/>
                </Route>
                <Route path="/" element={<ProtactedInOutNpaymentRoutes/>}>
                  <Route path="/InOutNpayment/addSuppiler" element={<AddSuppilerInOutNpayment />}/>
                  <Route path="/InOutNpayment/suppilerTable" element={<SuppilerTableInOutNpayment />}/>
                  <Route path="/InOutNpayment/editSuppiler/:id" element={<EditSuppilerInOutNpayment/>}/>
                  <Route path="/InOutNpayment/suppilerDetails/:id" element={<SuppilerDetailInOutNpayment/>}/>
                  <Route path='*' element={<PageNotFoundRedirect/>}/>
                </Route>
                <Route path="/" element={<ProtectedOwnerRoutes/>}>
                  <Route path="/dashboardOwner" element={<BranchDashboard/>}/>
                  <Route path="/units" element={<UnitsTable/>}/>
                </Route>
                 {/* <Route path="/" element={<ProtectedAdminRoutes />}>
                  <Route path="/staff/addStaff" element={<AddEditStaff/>}/>
                  <Route path="/staff/staffList" element={<StaffList/>}/>
                  <Route path="/staff/staffCategory" element={<StaffCategoryTable/>}/>
                  <Route path="/staff/allPayments" element={<AllPayments/>}/>
                  <Route path="/staff/leaves" element={<Leaves/>}/>
                  <Route path="/staff/editStaff/:id" element={<AddEditStaff/>}/>
                  <Route path="/staff/employeeDetail/:id" element={<EmployeeDetails/>}/>
                </Route> */}
                <Route path="/" element={<ProtectedFactoryManagerRoutes/>}>
                  <Route path="/dashboardFactory" element={<FactoryDashboard/>}/>
                  <Route path="/inOut/material/addSuppiler" element={<AddFactorySupplierInOut />}/>
                  <Route path="/inOut/material/editSuppiler/:id" element={<EditFactorySuppilerInOut/>}/>
                  <Route path="/inOut/material/suppilerTable" element={<FactorySuppilerTableInOut />}/>
                  <Route path="/inOut/material/suppilerDetails/:id" element={<FactorySuppilerDetailInOut/>}/>
                  <Route path="/inOut/material/stockOutByCategory/:category/:categoryId" element={<StockOutByCategoryMaterialInOut/>}/>
                  <Route path="/inOut/material/stockInByCategory/:category/:categoryId" element={<StockOutByCategoryStockInMaterialInOut/>}/>
                  <Route path="/inOut/material/materialTable" element={<MaterialListTableInOut />}/>
                  <Route path="/inOut/material/materialDetails/:id/:name/:unit/:remainingQty/:status" element={<MaterialDetailsInOut/>}/>
                  <Route path="/inOut/material/transactionTable" element={<TransactionTableMaterialInOut />}/>
                  <Route path="/inOut/material/categories" element={<CategoriesTableMaterialInOut />}/>
                  <Route path="/inOut/material/materialInOut" element={<StockInOutMaterialInOut />}/>
                  <Route path="/inOut/factory/productTable" element={<FinalProductListTableInOut />}/>
                  <Route path="/inOut/factory/categoryWiseOut" element={<CategoryWiseOutInOut />}/>
                  <Route path="/inOut/factory/productDetails/:id/:name/:unit/:remainingQty" element={<FinalProductDetailsInOut/>}/>
                  <Route path="/inOut/factory/production" element={<StockInOutFactoryInOut/>}/>
                  <Route path="/inOut/factory/rawMaterialTable" element={<MaterialTableByDepartmentInOut />}/>
                  <Route path="/inOut/distributor/transactionTable" element={<TransactionTableDistributerInOut />}/>
                  <Route path="/inOut/distributor/addDistributor" element={<AddFactoryDistributerInOut />}/>
                  <Route path="/inOut/distributor/distributorTable" element={<FactoryDistributerTableInOut />}/>
                  <Route path="/inOut/distributor/editDistributor/:id" element={<EditFactoryDistributerInOut/>}/>
                  <Route path="/inOut/distributor/distributorDetails/:id" element={<FactoryDistributerDetailInOut/>}/>
                  
                  
                  <Route path="/stock/material/materialTable" element={<MaterialListTableStock />}/>
                  <Route path="/stock/material/materialDetails/:id/:name/:unit/:remainingQty/:status" element={<MaterialDetailsStock/>}/>
                  <Route path="/stock/factory/productTable" element={<FinalProductListTableStock />}/>
                  <Route path="/stock/factory/productDetails/:id/:name/:unit/:remainingQty" element={<FinalProductDetailsStock/>}/>                  
                  <Route path="/stock/factory/rawMaterialTable" element={<MaterialTableByDepartmentStock />}/>
                </Route>
                <Route path="/" element={<ProtectedFactoryRoutes/>}>
                  <Route path="/dashboardFactory" element={<FactoryDashboard/>}/>
                   <Route path="/material/addSuppiler" element={<AddFactorySupplier />}/>
                  <Route path="/material/editSuppiler/:id" element={<EditFactorySuppiler/>}/>
                  <Route path="/material/suppilerTable" element={<FactorySuppilerTable />}/>
                  <Route path="/material/suppilerDetails/:id" element={<FactorySuppilerDetail/>}/>
                  <Route path="/material/stockOutByCategory/:category/:categoryId" element={<StockOutByCategoryMaterial/>}/>
                  <Route path="/material/stockInByCategory/:category/:categoryId" element={<StockOutByCategoryStockInMaterial/>}/>
                  <Route path="/material/materialTable" element={<MaterialListTable />}/>
                  <Route path="/material/materialDetails/:id/:name/:unit/:remainingQty/:status" element={<MaterialDetails/>}/>
                  <Route path="/material/transactionTable" element={<TransactionTableMaterial />}/>
                  <Route path="/material/categories" element={<CategoriesTableMaterial />}/>
                  <Route path="/material/materialInOut" element={<StockInOutMaterial />}/>
                  <Route path="/material/editHistory/:id" element={<EditHistoryMaterial/>}/>
                  <Route path="/factory/productTable" element={<FinalProductListTable />}/>
                  <Route path="/factory/categoryWiseOut" element={<CategoryWiseOut />}/>
                  <Route path="/factory/productDetails/:id/:name/:unit/:remainingQty" element={<FinalProductDetails/>}/>
                  <Route path="/factory/production" element={<StockInOutFactory/>}/>
                  <Route path="/factory/rawMaterialTable" element={<MaterialTableByDepartment />}/>
                  <Route path="/distributor/transactionTable" element={<TransactionTableDistributer />}/>
                  <Route path="/distributor/addDistributor" element={<AddFactoryDistributer />}/>
                  <Route path="/distributor/distributorTable" element={<FactoryDistributerTable />}/>
                  <Route path="/distributor/editDistributor/:id" element={<EditFactoryDistributer/>}/>
                  <Route path="/distributor/distributorDetails/:id" element={<FactoryDistributerDetail/>}/>
                </Route>
                <Route path="/" element={<ProtectedUserRoutes/>}>
                  <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/addUser" element={<AddUser />}/>
                  <Route path="/addSuppiler" element={<AddSuppiler />}/>
                  <Route path="/userTable" element={<UserTable />}/>
                  <Route path="/userTableOwner" element={<UserTableOwner />}/>
                  {/* <Route path="/productList" element={<ProductList />}/> */}
                  <Route path="/productTable" element={<ProductListTable />}/>
                  <Route path="/stockInOut" element={<StockInOut />}/>
                  <Route path="/transactionTable" element={<TransactionTable />}/>
                  <Route path="/suppilerTable" element={<SuppilerTable />}/>
                  <Route path="/categories" element={<CategoriesTable />}/>
                  <Route path="/editUser/:id" element={<EditUser/>}/>
                  <Route path="/editHistory/:id" element={<EditHistory/>}/>
                  <Route path="/editSuppiler/:id" element={<EditSuppiler/>}/>
                  <Route path="/suppilerDetails/:id" element={<SuppilerDetail/>}/>
                  <Route path="/suppilerDetailsOwner/:id" element={<SuppilerDetailOwner/>}/>
                  <Route path="/stockOutByCategory/:category/:categoryId" element={<StockOutByCategory/>}/>
                  <Route path="/stockInByCategory/:category/:categoryId" element={<StockOutByCategoryStockIn/>}/>
                  <Route path="/productDetails/:id/:name/:unit/:remainingQty" element={<ProductDetails/>}/>
                </Route>
                {/* <Route path='/thermal' exact element={<PrintButton />}/> */}
                {/* <Route path='/setPrinter' exact element={<SetPrinter />}/> */}
                <Route path='/login' exact element={<LoginPage />}/>
                <Route path='*' element={<PageNotFoundRedirect/>}/>
              </Routes>
            </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
