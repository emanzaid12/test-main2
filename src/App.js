import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; 
import store from "./redux/store"; 
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import Order from "./pages/Order";
import FilterData from "./pages/FilterData";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Setttings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FavoritesProvider } from "./pages/FavoritesContext";
import ReviewOrder from "./pages/ReviewOrder";
import OrderConfirmation from "./pages/OrderConfirmation";
import LoginRegister from "./pages/LoginRegister";
import ForgotPassword from "./pages/ForgotPassword"
import ResetConfirmation from "./pages/ResetConfirmation";
import ResetPassword from "./pages/ResetPassword";
import ResetSuccess from "./pages/PasswordResetSuccess";
import OrderTracking from "./pages/OrderTracking";
import Dashboard from "./pages/Seller/Dashboard";
import DashboardAdmin from "./pages/Admin/AdminDashboard";

import AddNewBrand from "./pages/Seller/AddNewBrand";
import AddYourProducts from "./pages/Seller/AddYourProducts";
import MyProducts from "./pages/Seller/MyProducts";
import OrderReceived from "./pages/Seller/OrderReceived";
import SellerMessages from "./pages/Seller/SellerMessages";
import Reviews from "./pages/Seller/Reviews";
import BrandSettings from "./pages/Seller/BrandSettings";
import CouponPage from "./pages/Seller/CouponPage";

import AccountSettingsPage from "./pages/Seller/AccountSettingsPage";
import LanguageSettingsPage from "./pages/Seller/LanguageSettingsPage";
import FAQPage from "./pages/Seller/FAQPage";
import PrivacyPolicyPage from "./pages/Seller/PrivacyPolicyPage";
import HelpPage from "./pages/Seller/HelpPage";
import TermsPage from "./pages/Seller/TermsPage";
import ManageProducts from "./pages/Admin/ManageProducts";
//import ManageOrders from "./pages/Admin/ManageOrders";
import ManageReviews from "./pages/Admin/ManageReviews";
import ManageSellers from "./pages/Admin/ManageSellers";
//import SellersReports from "./pages/Admin/SellersReports";
import Notifications from "./pages/Seller/Notifications";
import UpdateProduct from "./pages/Seller/UpdateProduct";
import  ManageOrders from"./pages/Admin/ManageOrders"
import  MyDiscount from"./pages/Seller/My Discount"
//import AdminMessages from "./pages/Admin/AdminMessages";
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const [order, setOrder] = useState(null);

  return (
    <Provider store={store}>
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/review-order" element={<ReviewOrder />} />
              <Route path="/filter-data" element={<FilterData />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/loginregister" element={<LoginRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-confirmation"
                element={<ResetConfirmation />}
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-success" element={<ResetSuccess />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route
                path="/order-tracking/:orderId"
                element={<OrderTracking />}
              />
              <Route path="/admin-dashboard" element={<DashboardAdmin />} />
              <Route path="/dashboard-seller" element={<Dashboard />} />
              <Route path="/add-new-brand" element={<AddNewBrand />} />
              <Route
                path="/dashboard/add-products"
                element={<AddYourProducts />}
              />
              <Route path="/dashboard/my-products" element={<MyProducts />} />
              <Route path="/dashboard/orders" element={<OrderReceived />} />
              <Route path="/dashboard/messages" element={<SellerMessages />} />
              <Route path="/dashboard/reviews" element={<Reviews />} />
              <Route
                path="/dashboard/brand-settings"
                element={<BrandSettings />}
              />
              <Route path="/dashboard/coupon-page" element={<CouponPage />} />
              <Route
                path="/dashboard/account-settings-page"
                element={<AccountSettingsPage />}
              />
              <Route
                path="/dashboard/language-settings-page"
                element={<LanguageSettingsPage />}
              />
              <Route path="/dashboard/faq-page" element={<FAQPage />} />
              <Route
                path="/dashboard/privacy-policy-page"
                element={<PrivacyPolicyPage />}
              />
              <Route path="/dashboard/help-page" element={<HelpPage />} />
              <Route path="/dashboard/terms-page" element={<TermsPage />} />
              <Route
                path="/dashboard/notifications"
                element={<Notifications />}
              />

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/reviews" element={<ManageReviews />} />
              <Route path="/admin/sellers" element={<ManageSellers />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/seller-myDiscount"element={<MyDiscount/>}/>
            </Routes>
          </div>
          <Footer />
        </div>
      </FavoritesProvider>
      <ToastContainer />
    </Provider>
  );
}

export default App;
