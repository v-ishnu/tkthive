import { prisma } from "../../../../config/prisma.js";
import { initiatePayment } from "../../payment/service/initiatePayment.js";

export const checkoutPayment = async (req, res) => {
  try {
    const { orderID } = req.params;
    const user = req.user; // ✅ correct

    console.log("user data --> ", user)

    if (!orderID) {
      return res.status(400).json({
        message: "ORDER_ID_REQUIRED"
      });
    }

    const order = await prisma.booking.findUnique({
      where: {
        orderId: orderID
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "ORDER_NOT_FOUND"
      });
    }

    // 🔒 ownership check
    if (order.userId !== user.id) {
      return res.status(403).json({
        message: "FORBIDDEN"
      });
    }

    // optional: prevent re-payment
    if (order.paymentStatus === "PAID") {
      return res.status(409).json({
        message: "ORDER_ALREADY_PAID"
      });
    }

    // Payment Initialization
    const session = await initiatePayment({orderId: orderID, user, totalAmount: order.payment })

    return res.status(200).json({
      message: "PAYMENT_CHECKOUT",
      order,
      session
    });

  } catch (error) {
    console.error("checkoutPayment error:", error);

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
};
