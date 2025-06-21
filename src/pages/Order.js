import React from "react";
import { useNavigate } from "react-router-dom";

const Order = ({ order }) => {
  const navigate = useNavigate();

  const handleOrderTracking = () => {
    if (order?.orderNumber || order?.orderId) {
      navigate(`/order-tracking/${order.orderNumber || order.orderId}`);
    } else {
      navigate("/order-tracking");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <h2 className="text-2xl font-semibold mb-4">Thank you for your order!</h2>
      <p>
        Your Order has been placed successfully you will receive an email
        confirmation shortly
      </p>

      <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <p>Order Number: {order?.orderNumber || order?.orderId}</p>

        {order?.shippingInformation && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Shipping Information</h4>
            <p>
              {order.shippingInformation.name ||
                order.shippingInformation.fullName}
            </p>
            <p>{order.shippingInformation.address}</p>
            <p>{order.shippingInformation.city}</p>
            <p>
              {order.shippingInformation.zip ||
                order.shippingInformation.government}
            </p>
            {order.shippingInformation.phoneNumber && (
              <p>{order.shippingInformation.phoneNumber}</p>
            )}
          </div>
        )}

        {order?.products && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Items Ordered</h4>
            {order.products.map((product, index) => (
              <div
                key={product.id || index}
                className="flex justify-between mt-2"
              >
                <p>
                  {product.name || product.productName} x {product.quantity}
                </p>
                <p>
                  $
                  {(
                    (product.price ||
                      product.finalPrice ||
                      product.originalPrice) * product.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {order?.discountedProducts && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Items Ordered</h4>
            {order.discountedProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="flex justify-between mt-2"
              >
                <p>
                  {product.name || product.productName} x {product.quantity}
                </p>
                <p>${(product.finalPrice * product.quantity).toFixed(2)}</p>
                {product.originalPrice !== product.finalPrice && (
                  <p className="text-gray-500 line-through text-sm">
                    ${(product.originalPrice * product.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {order?.totalOriginalPrice && (
            <div className="flex justify-between">
              <span>Original Price:</span>
              <span>${order.totalOriginalPrice.toFixed(2)}</span>
            </div>
          )}
          {order?.discountedAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-${order.discountedAmount.toFixed(2)}</span>
            </div>
          )}
          {order?.firstOrderDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>First Order Discount:</span>
              <span>-${order.firstOrderDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          {order?.shippingFee && (
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>${order.shippingFee.toFixed(2)}</span>
            </div>
          )}
          {order?.platformFee && (
            <div className="flex justify-between">
              <span>Platform Fee:</span>
              <span>${order.platformFee.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t pt-2">
            <span className="font-semibold">Total Price:</span>
            <span className="font-semibold">
              $
              {(
                order?.totalWithShipping ||
                order?.totalFinalPrice ||
                order?.totalPrice ||
                0
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="bg-green-500 text-white py-2 px-4 hover:bg-green-600 rounded transition-colors"
            onClick={handleOrderTracking}
          >
            Order Tracking
          </button>
          <button
            className="ml-4 bg-red-600 text-white py-2 px-4 hover:bg-red-800 rounded transition-colors"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
