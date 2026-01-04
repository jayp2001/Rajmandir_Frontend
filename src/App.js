import './App.css';
import PageNotFoundRedirect from "./pageNotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import Dashboard from './pages/inventory/dashboard/dashboard';
import ProtectedUserRoutes from './protectedUserRoutes';
import NavBar from './pages/navBar/nav';
import AddUser from './pages/users/addUser/addUser'
import UserTable from './pages/users/userTable/userTable';
import EditUser from './pages/users/editUser/editUser';
import AddSupplier from './pages/inventory/addSupplier/addSupplier';
import SupplierTable from './pages/inventory/supplierTable/supplierTable';
import EditSupplier from './pages/inventory/editSupplier/editSupplier';
import ProductList from './pages/inventory/product/productList';
import CategoriesTable from './pages/inventory/categoriesTable/categoriesTable';
import StockInOut from './pages/inventory/stockManagement/stockInOut';
import TransactionTable from './pages/inventory/transactionTable/transactionTable';
import SupplierDetail from './pages/inventory/supplierDetails/supplierDetail';
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
import SupplierDetailOwner from './pages/branschDashboard/supplierDetails/supplierDetailOwner';
import ProtectedInOutRoutes from './protactedInOutRoutes';
import ProductDetailsInOut from './pages/inventory/roleWisePage/InOut/productDetails/productDetails';
import ProductListTableInOut from './pages/inventory/roleWisePage/InOut/productListTable/productListTable';
import StockInOutInOut from './pages/inventory/roleWisePage/InOut/stockManagement/stockInOut';
import AddSupplierInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/addSupplier/addSupplier';
import EditSupplierInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/editSupplier/editSupplier';
import SupplierDetailInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/supplierDetails/supplierDetail';
import SupplierTableInOutNpayment from './pages/inventory/roleWisePage/InOutNPayment/supplierTable/supplierTable';
import ProtactedInOutNpaymentRoutes from './protactedInOutNpaymentRoutes';
import MaterialListTable from './pages/factoryInventory/materialListTable/materialListTable';
import MaterialDetails from './pages/factoryInventory/materialDetails/material';
import FinalProductListTable from './pages/factoryInventory/finalProductListTable/finalProductListTable';
import FinalProductDetails from './pages/factoryInventory/finalProductDetails/finalProductDetails';
import AddFactorySupplier from './pages/factoryInventory/addSupplier/addSupplier';
import EditFactorySupplier from './pages/factoryInventory/editSupplier/editSupplier';
import FactorySupplierTable from './pages/factoryInventory/supplierTable/supplierTable';
import FactorySupplierDetail from './pages/factoryInventory/supplierDetails/supplierDetail';
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
import AddFactorySupplierInOut from './pages/factoryInventoryInOut/addSupplier/addSupplier';
import EditFactorySupplierInOut from './pages/factoryInventoryInOut/editSupplier/editSupplier';
import FactorySupplierTableInOut from './pages/factoryInventoryInOut/supplierTable/supplierTable';
import FactorySupplierDetailInOut from './pages/factoryInventoryInOut/supplierDetails/supplierDetail';
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
import MenuDashboard from './pages/menuItemPages/Dashboard/Dashboard';
import AddOns from './pages/menuItemPages/addOns/addOns';
import AssignAddonGroup from './pages/assignAddonGroup/AssignAddonGroup';
import StockInCategoryWiseOutDashboard from './pages/inventory/stockInCategoryWiseOut/Dashboard';
import BillingDashboard from './pages/billing/dashboard/billingDashboard';
import BillingBranchDashboard from './pages/billing/dashboard/billingBranchDashboard';
import CategoryBusinessReport from './billingPages/categoryBusinessReport/categoryBusinssReport';
import CommentListTable from './pages/commentData/comment';
import UPI from './pages/upi/upiDashboard';
import UpiDetailPage from './pages/upi/upiDetailPage';
import Firm from './pages/firm/firmList';
import FirmDetail from './pages/firm/firmDetail';
import CustomerList from './pages/menuItemPages/CustomerList/CustomerList';
import CustomerDetails from './pages/menuItemPages/customerDetailPage/customerDetails';
import BillCategories from './pages/menuItemPages/billCategories/BillCategories';
import SubCategory from './pages/menuItemPages/SubCategory/SubCategory';
import MenuCategory from './billingPages/MenuCategory/MenuCategory';
// import SetPrinter from './setPrinter';
function App() {
  return (
    <div className="">
      <BrowserRouter>
        <NavBar />
        <div className='mainBody'>
          <Routes>
            <Route path="/" element={<ProtectedStockManagerRoutes />}>
              <Route path="/stockOut" element={<StockOut />} />
              <Route path="/stockManager/productDetail/:id/:name/:unit/:remainingQty" element={<ProductDetailsManager />} />
              <Route path='*' element={<PageNotFoundRedirect />} />
            </Route>
            <Route path="/" element={<ProtectedInOutRoutes />}>
              <Route path="/InOut/productTable" element={<ProductListTableInOut />} />
              <Route path="/InOut/productDetail/:id/:name/:unit/:remainingQty" element={<ProductDetailsInOut />} />
              <Route path="/InOut/stockInOut" element={<StockInOutInOut />} />
              <Route path='*' element={<PageNotFoundRedirect />} />
            </Route>
            <Route path="/" element={<ProtactedInOutNpaymentRoutes />}>
              <Route path="/InOutNpayment/addSupplier" element={<AddSupplierInOutNpayment />} />
              <Route path="/InOutNpayment/supplierTable" element={<SupplierTableInOutNpayment />} />
              <Route path="/InOutNpayment/editSupplier/:id" element={<EditSupplierInOutNpayment />} />
              <Route path="/InOutNpayment/supplierDetails/:id" element={<SupplierDetailInOutNpayment />} />
              <Route path='*' element={<PageNotFoundRedirect />} />
            </Route>
            <Route path="/" element={<ProtectedOwnerRoutes />}>
              <Route path="/dashboardOwner" element={<BranchDashboard />} />
              <Route path="/billingDashboardOwner" element={<BillingBranchDashboard />} />
              <Route path="/units" element={<UnitsTable />} />
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
            <Route path="/" element={<ProtectedFactoryManagerRoutes />}>
              <Route path="/dashboardFactory" element={<FactoryDashboard />} />
              <Route path="/inOut/material/addSupplier" element={<AddFactorySupplierInOut />} />
              <Route path="/inOut/material/editSupplier/:id" element={<EditFactorySupplierInOut />} />
              <Route path="/inOut/material/supplierTable" element={<FactorySupplierTableInOut />} />
              <Route path="/inOut/material/supplierDetails/:id" element={<FactorySupplierDetailInOut />} />
              <Route path="/inOut/material/stockOutByCategory/:category/:categoryId" element={<StockOutByCategoryMaterialInOut />} />
              <Route path="/inOut/material/stockInByCategory/:category/:categoryId" element={<StockOutByCategoryStockInMaterialInOut />} />
              <Route path="/inOut/material/materialTable" element={<MaterialListTableInOut />} />
              <Route path="/inOut/material/materialDetails/:id/:name/:unit/:remainingQty/:status" element={<MaterialDetailsInOut />} />
              <Route path="/inOut/material/transactionTable" element={<TransactionTableMaterialInOut />} />
              <Route path="/inOut/material/categories" element={<CategoriesTableMaterialInOut />} />
              <Route path="/inOut/material/materialInOut" element={<StockInOutMaterialInOut />} />
              <Route path="/inOut/factory/productTable" element={<FinalProductListTableInOut />} />
              <Route path="/inOut/factory/categoryWiseOut" element={<CategoryWiseOutInOut />} />
              <Route path="/inOut/factory/productDetails/:id/:name/:unit/:remainingQty" element={<FinalProductDetailsInOut />} />
              <Route path="/inOut/factory/production" element={<StockInOutFactoryInOut />} />
              <Route path="/inOut/factory/rawMaterialTable" element={<MaterialTableByDepartmentInOut />} />
              <Route path="/inOut/distributor/transactionTable" element={<TransactionTableDistributerInOut />} />
              <Route path="/inOut/distributor/addDistributor" element={<AddFactoryDistributerInOut />} />
              <Route path="/inOut/distributor/distributorTable" element={<FactoryDistributerTableInOut />} />
              <Route path="/inOut/distributor/editDistributor/:id" element={<EditFactoryDistributerInOut />} />
              <Route path="/inOut/distributor/distributorDetails/:id" element={<FactoryDistributerDetailInOut />} />


              <Route path="/stock/material/materialTable" element={<MaterialListTableStock />} />
              <Route path="/stock/material/materialDetails/:id/:name/:unit/:remainingQty/:status" element={<MaterialDetailsStock />} />
              <Route path="/stock/factory/productTable" element={<FinalProductListTableStock />} />
              <Route path="/stock/factory/productDetails/:id/:name/:unit/:remainingQty" element={<FinalProductDetailsStock />} />
              <Route path="/stock/factory/rawMaterialTable" element={<MaterialTableByDepartmentStock />} />
            </Route>
            <Route path="/" element={<ProtectedFactoryRoutes />}>
              <Route path="/dashboardFactory" element={<FactoryDashboard />} />
              <Route path="/material/addSupplier" element={<AddFactorySupplier />} />
              <Route path="/material/editSupplier/:id" element={<EditFactorySupplier />} />
              <Route path="/material/supplierTable" element={<FactorySupplierTable />} />
              <Route path="/material/supplierDetails/:id" element={<FactorySupplierDetail />} />
              <Route path="/material/stockOutByCategory/:category/:categoryId" element={<StockOutByCategoryMaterial />} />
              <Route path="/material/stockInByCategory/:category/:categoryId" element={<StockOutByCategoryStockInMaterial />} />
              <Route path="/material/materialTable" element={<MaterialListTable />} />
              <Route path="/material/materialDetails/:id/:name/:unit/:remainingQty/:status" element={<MaterialDetails />} />
              <Route path="/material/transactionTable" element={<TransactionTableMaterial />} />
              <Route path="/material/categories" element={<CategoriesTableMaterial />} />
              <Route path="/material/materialInOut" element={<StockInOutMaterial />} />
              <Route path="/material/editHistory/:id" element={<EditHistoryMaterial />} />
              <Route path="/factory/productTable" element={<FinalProductListTable />} />
              <Route path="/factory/categoryWiseOut" element={<CategoryWiseOut />} />
              <Route path="/factory/productDetails/:id/:name/:unit/:remainingQty" element={<FinalProductDetails />} />
              <Route path="/factory/production" element={<StockInOutFactory />} />
              <Route path="/factory/rawMaterialTable" element={<MaterialTableByDepartment />} />
              <Route path="/distributor/transactionTable" element={<TransactionTableDistributer />} />
              <Route path="/distributor/addDistributor" element={<AddFactoryDistributer />} />
              <Route path="/distributor/distributorTable" element={<FactoryDistributerTable />} />
              <Route path="/distributor/editDistributor/:id" element={<EditFactoryDistributer />} />
              <Route path="/distributor/distributorDetails/:id" element={<FactoryDistributerDetail />} />
            </Route>
            <Route path="/" element={<ProtectedUserRoutes />}>
              <Route path='/menu/Dashboard' element={<MenuDashboard />} />
              <Route path='/menu/addOns' element={<AddOns />} />
              <Route path='/menu/assignAddonGroup/:groupId/:groupName' element={<AssignAddonGroup />} />
              <Route path='/menu/salesReport' element={<CategoryBusinessReport />} />
              <Route path='/menu/SubCategory' element={<SubCategory />} />
              <Route path='/menu/MenuCategory' element={<MenuCategory />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/billingDashboard" element={<BillingDashboard />} />
              <Route path="/comment" element={<CommentListTable />} />
              <Route path="/upi" element={<UPI />} />
              <Route path="/upi/detail/:onlineId/:holderName" element={<UpiDetailPage />} />
              <Route path="/firmList" element={<Firm />} />
              <Route path="/firmList/firmDetail/:id" element={<FirmDetail />} />
              <Route path="/customerList" element={<CustomerList />} />
              <Route path="/customerList/customerDetail/:id" element={<CustomerDetails />} />
              <Route path="/billCategories" element={<BillCategories />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/addSupplier" element={<AddSupplier />} />
              <Route path="/userTable" element={<UserTable />} />
              <Route path="/userTableOwner" element={<UserTableOwner />} />
              {/* <Route path="/productList" element={<ProductList />}/> */}
              <Route path="/productTable" element={<ProductListTable />} />
              <Route path="/stockInOut" element={<StockInOut />} />
              <Route path="/stockInCategoryWiseOut" element={<StockInCategoryWiseOutDashboard />} />
              <Route path="/transactionTable" element={<TransactionTable />} />
              <Route path="/supplierTable" element={<SupplierTable />} />
              <Route path="/categories" element={<CategoriesTable />} />
              <Route path="/editUser/:id" element={<EditUser />} />
              <Route path="/editHistory/:id" element={<EditHistory />} />
              <Route path="/editSupplier/:id" element={<EditSupplier />} />
              <Route path="/supplierDetails/:id" element={<SupplierDetail />} />
              <Route path="/supplierDetailsOwner/:id" element={<SupplierDetailOwner />} />
              <Route path="/stockOutByCategory/:category/:categoryId" element={<StockOutByCategory />} />
              <Route path="/stockInByCategory/:category/:categoryId" element={<StockOutByCategoryStockIn />} />
              <Route path="/productDetails/:id/:name/:unit/:remainingQty" element={<ProductDetails />} />
            </Route>
            {/* <Route path='/thermal' exact element={<PrintButton />}/> */}
            {/* <Route path='/setPrinter' exact element={<SetPrinter />}/> */}
            <Route path='/login' exact element={<LoginPage />} />
            <Route path='*' element={<PageNotFoundRedirect />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
