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
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/loginregister" element={<LoginRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-confirmation" element={<ResetConfirmation/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
                <Route path="/reset-success" element={<ResetSuccess/>} />
                
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
