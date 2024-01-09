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
                <Route path="/" element={<ProtectedOwnerRoutes/>}>x
                  <Route path="/dashboardOwner" element={<BranchDashboard/>}/>
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
