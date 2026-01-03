import { createRegistrationCheckout } from "../service/createRegistrationCheckout.js";

export const checkoutRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const booking = await  createRegistrationCheckout(
      req.user.id,
      req.body,
      eventId
    );

    // create payment session here
    return res.status(201).json({
      message: "CHECKOUT_CREATED",
      bookingId: booking.id,
      orderId: booking.orderId,
      amount: booking.payment
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};
