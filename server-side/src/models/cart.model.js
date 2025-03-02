const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        subtotal: { type: Number },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate subtotal & total price before saving   /// chat gpt ---
CartSchema.pre("save", function (next) {
  this.products.forEach((product) => {
    product.subtotal = product.price * product.quantity;
  });
  this.totalPrice = this.products.reduce(
    (acc, product) => acc + product.subtotal,
    0
  );
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
