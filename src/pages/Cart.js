import { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import emptyCartImage from "../assets/images/no-product.jpg";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const fetchCart = async () => {
    try {
      const res = await fetch("https://shopyapi.runasp.net/api/Cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cartItems);
        setTotal(data.totalCartPrice);
      } else {
        setCartItems([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyPromo = async () => {
    const trimmedCode = promoCode.trim();

    // تحقق من أن الحقل غير فارغ
    if (!trimmedCode) {
      setPromoStatus("Please enter a promo code.");
      setDiscount(0);
      return;
    }

    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Order/apply-promocode?promoCode=${encodeURIComponent(
          trimmedCode
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const discountValue = data.discountPercentage / 100;
        setDiscount(discountValue);
        setPromoStatus(`Promo code applied: ${data.discountPercentage}% off`);
      } else {
        const data = await res.json();
        // معالجة الرسائل القادمة من السيرفر
        const serverMessage =
          data?.message ||
          data?.title ||
          (data?.errors?.promoCode && data.errors.promoCode[0]) ||
          "Invalid promo code.";
        setDiscount(0);
        setPromoStatus(serverMessage);
      }
    } catch (err) {
      console.error("Error applying promo code:", err);
      setPromoStatus("Something went wrong. Please try again.");
    }
  };
  

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Cart/update?productId=${productId}&newQuantity=${newQuantity}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await res.text();
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Cart/remove?productId=${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await res.text();
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const discountedTotal = (total * (1 - discount)).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading)
    return <div className="text-center py-12 text-xl">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white bg-red-800 p-4 rounded-t-lg flex items-center">
          <BsCartCheck className="text-3xl mr-2" />
          Shopping Cart
        </h2>
        <div className="flex mt-6 flex-col md:flex-row">
          <div className="md:w-3/5 pr-0 md:pr-6">
            {cartItems.length === 0 ? (
              <div className="text-center mt-10">
                <img
                  src={emptyCartImage}
                  alt="Empty Cart"
                  className="w-64 mx-auto opacity-70"
                />
                <p className="mt-4 text-red-800 text-lg font-semibold">
                  Your cart is empty
                </p>
              </div>
            ) : (
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
                  {cartItems.map((item) => (
                    <tr
                      key={item.productId}
                      className="border-t border-gray-200"
                    >
                      <td className="py-4">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-800 mb-2">
                            {item.productName}
                          </span>
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-stretch justify-center border border-gray-300 rounded w-fit mx-auto text-sm divide-x divide-gray-300 h-8">
                          <button
                            className="text-red-800 px-3 font-bold"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                          >
                            <FaMinus />
                          </button>
                          <div className="px-4 text-gray-800 flex items-center justify-center">
                            {item.quantity}
                          </div>
                          <button
                            className="text-red-800 px-3 font-bold"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 font-medium text-gray-800">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 font-medium text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-700 hover:text-white hover:bg-red-700 border border-red-700 rounded-full w-8 h-8 flex items-center justify-center"
                          title="Remove"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="md:w-2/5 pl-0 md:pl-6 mt-8 md:mt-0">
            <div className="p-4 border-2 border-gray-300 rounded-[25px] bg-gray-50 shadow-lg">
              <h3 className="text-xl font-bold text-red-800 text-center">
                Order Summary
              </h3>
              <hr className="border-gray-300 my-2" />
              <div className="mt-4 flex justify-between font-semibold text-red-800">
                <span>Items:</span>
                <span>{totalItems}</span>
              </div>

              <h4 className="text-md font-semibold text-red-800 mt-4">
                Promo Code
              </h4>
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
                  className="bg-red-800 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 hover:shadow-lg hover:scale-105 transition"
                >
                  APPLY
                </button>
              </div>
              {promoStatus && (
                <p
                  className={`mt-2 text-sm ${
                    discount ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {promoStatus}
                </p>
              )}

              <div className="mt-4 flex justify-between font-semibold text-red-800">
                <span>Total Cost:</span>
                <span>${discountedTotal}</span>
              </div>

              {discount > 0 && (
                <div className="mt-2 text-red-700 text-sm text-center font-medium italic">
                  You saved ${(total * discount).toFixed(2)}!
                </div>
              )}

              <button
                className="mt-6 w-full bg-red-800 text-white font-semibold py-2 rounded-full hover:bg-red-600 hover:shadow-lg hover:scale-105 transition"
                onClick={() => navigate("/shipping")}
                disabled={cartItems.length === 0}
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
