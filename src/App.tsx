import { lazy, Suspense, useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // ✅ changed from BrowserRouter
import Loader from "./components/loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "./components/header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { userExist, userNotExist } from "./redux/reducer/userreducer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/api/Userapi";
import { userReducerinitialstate } from "./types/reducer-types";
import ProtectedRoute from "./components/protectedroutes";
import DiscountManagement from "./pages/admin/management/dicountmanagement";
import Footer from "./components/footer";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Search = lazy(() => import("./pages/Search"));
const Productdetails = lazy(() => import("./pages/Productdetails"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const Notfound = lazy(() => import("./pages/Not-found"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Admin routes
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const Discount = lazy(() => import("./pages/admin/management/coupoun"));
const ProductManagement = lazy(() =>
  import("./pages/admin/management/productmanagement")
);
const Newdiscount = lazy(() => import("./pages/admin/management/Newdiscount"));
const TransactionManagement = lazy(() =>
  import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  const [isloading, setIsLoading] = useState(false);
  const { user, loading } = useSelector(
    (state: { user: userReducerinitialstate }) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        const data = await getUser(user.uid);
        data ? dispatch(userExist(data.user)) : dispatch(userNotExist());
      } else {
        dispatch(userNotExist());
      }
      setIsLoading(false);
    });
  }, []);

  return loading || isloading ? (
    <Loader />
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<Productdetails />} />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!user}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Authenticated User Routes */}
          <Route element={<ProtectedRoute isAuthenticated={!!user} />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/pay" element={<Checkout />} />

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin"}
              />
            }
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path="/admin/customer" element={<Customers />} />
          <Route path="/admin/transaction" element={<Transaction />} />
          <Route path="/admin/discount" element={<Discount />} />
          <Route path="/admin/chart/bar" element={<Barcharts />} />
          <Route path="/admin/chart/pie" element={<Piecharts />} />
          <Route path="/admin/chart/line" element={<Linecharts />} />
          <Route path="/admin/app/coupon" element={<Coupon />} />
          <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
          <Route path="/admin/app/toss" element={<Toss />} />
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<ProductManagement />} />
          <Route path="/admin/discount/new" element={<Newdiscount />} />
          <Route
            path="/admin/discount/:id"
            element={<DiscountManagement />}
          />
          <Route
            path="/admin/transaction/:id"
            element={<TransactionManagement />}
          />

          {/* 404 */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
