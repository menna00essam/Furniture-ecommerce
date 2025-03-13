const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true }, // - - - //
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Direct Bank Transfer", "Cash on Delivery"],
      required: true,
    },
    orderNumber: { type: String, unique: true },

    transactionId: { type: String },
  },
  { timestamps: true }
);
// Middleware to generate orderNumber before saving

OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)
      .toString()
      .slice(0, 5)}`;
  }
  next();
});
module.exports = mongoose.model("Order", OrderSchema);
