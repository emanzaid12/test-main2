import { useDispatch, useSelector } from "react-redux";
import {  FaTrashAlt, FaPlus, FaMinus,} from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import { useState } from "react";
import emptyCartImage from "../assets/images/no-product.jpg";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState("");
  const navigate = useNavigate();

  const handleApplyPromo = () => {
    const validPromo = "SAVE20";
    if (promoCode.toUpperCase() === validPromo) {
      setDiscount(0.2);
      setPromoStatus("Promo code applied!");
    } else {
      setDiscount(0);
      setPromoStatus("Invalid promo code.");
    }
  };

  const discountedTotal = (cart.totalPrice * (1 - discount)).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        {/* ✅ Header */}
        <h2 className="text-2xl font-bold text-white bg-red-800 p-4 rounded-t-lg flex items-center">
          <BsCartCheck className="text-3xl mr-2" />
          Shopping Cart
        </h2>

       

        <div className="flex mt-6">
          {/* ✅ Left side - Cart Items */}
          <div className="w-3/5 pr-6">
            <table className="w-full text-center">
              <thead>
                <tr className="text-red-800 font-semibold">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Quantity</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {cart.products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10">
                      <img src={emptyCartImage} alt="Empty Cart" className="w-64 mx-auto opacity-70" />
                      <p className="mt-4 text-red-800 text-lg font-semibold">Your cart is empty</p>
                    </td>
                  </tr>
                ) : (
                  cart.products.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200">
                      {/* Product */}
                      <td className="py-4">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-800 mb-2">{item.name}</span>
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-4">
                      <div className="flex items-stretch justify-center border border-gray-300 rounded w-fit mx-auto text-sm divide-x divide-gray-300 h-8">
  <button 
    className="text-red-800 px-3 font-bold flex items-center justify-center"
    onClick={() => dispatch(decreaseQuantity(item.id))}
  >
    <FaMinus />
  </button>
  <div className="px-4 text-gray-800 flex items-center justify-center">
    {item.quantity}
  </div>
  <button 
    className="text-red-800 px-3 font-bold flex items-center justify-center"
    onClick={() => dispatch(increaseQuantity(item.id))}
  >
    <FaPlus />
  </button>
</div>

                      </td>

                      {/* Price */}
                      <td className="py-4">
                        <span className="text-gray-800 font-medium">${item.price.toFixed(2)}</span>
                      </td>

                      {/* Total */}
                      <td className="py-4">
                        <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </td>

                      {/* Delete */}
                      <td className="py-4">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-red-700 hover:text-white hover:bg-red-700 border border-red-700 rounded-full w-8 h-8 flex items-center justify-center transition"
                          title="Remove"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Right side - Order Summary */}
          <div className="w-2/5 pl-6 mt-2">
            <div className="p-4 border-2 border-gray-300 rounded-[25px] bg-gray-50 shadow-lg">
              <h3 className="text-xl font-bold text-red-800 text-center">Order Summary</h3>
              <hr className="border-gray-300 my-2" />

              <div className="mt-4 flex justify-between w-full font-semibold text-red-800">
                <span>Items:</span>
                <span className="text-right">{cart.totalQuantity}</span>
              </div>

              

               {/* Promo Code */}
               <h4 className="text-md font-semibold text-red-800 mt-4">Promo Code</h4>
              <input
                type="text"
                placeholder="Enter Your Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              />
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleApplyPromo}
                  className="bg-red-800 text-white font-semibold px-6 py-2 rounded-full 
                    transition duration-300 ease-in-out transform hover:bg-red-600 hover:shadow-lg hover:scale-105"
                >
                  APPLY
                </button>
              </div>
              {promoStatus && (
                <p className={`mt-2 text-sm ${discount ? "text-green-600" : "text-red-600"}`}>
                  {promoStatus}
                </p>
              )}

              {/* Total */}
              <div className="mt-4 flex justify-between w-full font-semibold text-red-800">
                <span>Total Cost:</span>
                <span className="text-right">${discountedTotal}</span>
              </div>
              
              {/* Twist line */}
{discount > 0 && (
  <div className="mt-2 text-red-700 text-sm text-center font-medium italic">
    Twist! You just saved ${(cart.totalPrice * discount).toFixed(2)}$
  </div>
)}




              <button className="mt-6 w-full bg-red-800 text-white font-semibold py-2 rounded-full 
                transition duration-300 ease-in-out transform hover:bg-red-600 hover:shadow-lg hover:scale-105"
                onClick={() => navigate("/shipping")}
                >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
