const mongoose = require("mongoose");
const ALLOWED_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Dark Brown", hex: "#5C4033" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Dark Blue", hex: "#00008B" },
  { name: "Graphite Black", hex: "#1C1C1C" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Light Gray", hex: "#D3D3D3" },
];

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productSubtitle: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productDate: { type: Date, default: Date.now },
    productSale: { type: Number, default: 0 },
    productCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    productDescription: { type: String },
    brand: { type: String },

    colors: [
      {
        name: {
          type: String,
          required: true,
          enum: ALLOWED_COLORS.map((c) => c.name),
        },
        hex: { type: String },
        // images: [{ type: String, required: true }],
        images: [
          {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],

        quantity: { type: Number, required: true },
        sku: { type: String, unique: true },
      },
    ],

    additionalInformation: {
      general: {
        salesPackage: { type: String },
        modelNumber: { type: String },
        secondaryMaterial: { type: String },
        configuration: { type: String },
        upholsteryMaterial: { type: String },
        upholsteryColor: { type: String },
      },
      productDetails: {
        fillingMaterial: { type: String },
        finishType: { type: String },
        adjustableHeadrest: { type: Boolean },
        maximumLoadCapacity: { type: Number },
        originOfManufacture: { type: String },
      },
      dimensions: {
        width: { type: Number },
        height: { type: Number },
        depth: { type: Number },
        seatHeight: { type: Number },
        legHeight: { type: Number },
      },
      materials: {
        primaryMaterial: { type: String },
        upholsteryMaterial: { type: String },
        upholsteryColor: { type: String },
        fillingMaterial: { type: String },
        finishType: { type: String },
      },
      specifications: {
        adjustableHeadrest: { type: Boolean },
        maximumLoadCapacity: { type: Number },
        originOfManufacture: { type: String },
        weight: { type: Number },
        brand: { type: String },
      },
      warranty: {
        summary: { type: String },
        serviceType: { type: String },
        covered: { type: String },
        notCovered: { type: String },
        domesticWarranty: { type: String },
      },
    },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  this.colors.forEach((color) => {
    const colorInfo = ALLOWED_COLORS.find((c) => c.name === color.name);
    if (colorInfo) {
      color.hex = colorInfo.hex;
      console.log("aadsasdcdasaedAF", color.hex);
    } else {
      return next(new Error(`Invalid color name: ${color.name}`));
    }

    if (!color.sku) {
      color.sku = `${this.productName}-${color.name}`
        .toUpperCase()
        .replace(/\s+/g, "-");
    }
  });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
