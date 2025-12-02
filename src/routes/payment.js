const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const razorpayinstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const memebershipAmount = require("../utils/constants");
const user = require("../models/user");
const user = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershiptype } = req.body;
    const { firstname, lastname, emailId } = req.user;
    const order = await razorpayinstance.orders.create({
      amount: memebershipAmount[membershiptype],
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstname,
        lastname,
        emailId,
        membershiptype,
      },
    });
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedpayment = await payment.save();
    res.json({ ...savedpayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const iswebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_KEY_WEBHOOK_SECRET
    );
    if (!iswebhookValid) {
      return res.status(500).json({ msg: "webhook is not valid" });
    }
    //updating payment details in db
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    await payment.save();
    const user = await user.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershiptype;
    await user.save();

    if (req.body.event === "payment.captured") {
    }
    if (req.body.event === "payment.failed") {
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = await req.user.toJSON();
  if (user.isPremium) {
    return res.json({ isPremium: true });
  }
  return res.json({ isPremium: false });
});
module.exports = { paymentRouter };
