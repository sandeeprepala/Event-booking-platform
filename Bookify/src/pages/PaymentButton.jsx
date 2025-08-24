import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const PaymentButton = ({ amount, bookingData }) => {

  const handlePayment = async () => {
    try {
      // 1. Create order on backend
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payments/create-order",
        { amount },
        { withCredentials: true }
      );

      const { id: order_id } = data.order;

      // 2. Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Bookify",
        description: "Ticket Booking Payment",
        order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/v1/payments/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful! 🎉"); // ✅ replaced alert

              // Optionally update booking status here
              // await axios.post("/api/v1/bookings/confirm", { bookingData });
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: "Sandeep Repala", // or dynamic user name
          email: "test@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again."); // ✅ replaced alert
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} /> {/* 🔹 Toast container */}
      <button onClick={handlePayment} className="btn btn-primary">
        Pay ₹{amount}
      </button>
    </>
  );
};

export default PaymentButton;
