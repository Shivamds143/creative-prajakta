import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Color output
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const blue = (s) => `\x1b[34m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ${green("✔")} ${testName}`);
    passed++;
  } else {
    console.error(`  ${red("✖")} ${testName}`);
    failed++;
  }
}

async function run() {
  console.log(bold("\n=== GiftAura Backend Architecture & Schema Test Suite ===\n"));

  // 1. Test Models and Schemas import
  console.log(blue("1. Testing Schema Imports and Model Registrations..."));
  
  // Dynamic import of models
  const { Product } = await import("../models/Product.js");
  const { Category } = await import("../models/Category.js");
  const { Customer } = await import("../models/Customer.js");
  const { AdminUser } = await import("../models/AdminUser.js");
  const { Order } = await import("../models/Order.js");
  const { Cart } = await import("../models/Cart.js");
  const { Wishlist } = await import("../models/Wishlist.js");
  const { Coupon } = await import("../models/Coupon.js");
  const { GiftCustomization } = await import("../models/GiftCustomization.js");
  const { Banner } = await import("../models/Banner.js");

  assert(Product && Product.modelName === "Product", "Product model registered correctly");
  assert(Category && Category.modelName === "Category", "Category model registered correctly");
  assert(Customer && Customer.modelName === "Customer", "Customer model registered correctly");
  assert(AdminUser && AdminUser.modelName === "AdminUser", "AdminUser model registered correctly");
  assert(Order && Order.modelName === "Order", "Order model registered correctly");
  assert(Cart && Cart.modelName === "Cart", "Cart model registered correctly");
  assert(Wishlist && Wishlist.modelName === "Wishlist", "Wishlist model registered correctly");
  assert(Coupon && Coupon.modelName === "Coupon", "Coupon model registered correctly");
  assert(GiftCustomization && GiftCustomization.modelName === "GiftCustomization", "GiftCustomization model registered correctly");
  assert(Banner && Banner.modelName === "Banner", "Banner model registered correctly");

  // 2. Test Admin Password Hashing and Auth
  console.log(blue("\n2. Testing Admin Authentication and Password Hashing..."));
  const plainPassword = "SecureAdminPassword123!";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  assert(isMatch, "Bcrypt password hashing and verification works");
  assert(!await bcrypt.compare("WrongPassword", hashedPassword), "Bcrypt rejects incorrect passwords");

  // JWT Token Signing and Verification
  const jwtSecret = "test-secret-key-for-backend-verification-32-chars";
  const payload = { adminId: "650c1f1e1c9d440000a1b2c3", email: "admin@giftaura.com", role: "superadmin", name: "Super Admin" };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
  const verified = jwt.verify(token, jwtSecret);
  assert(verified.email === "admin@giftaura.com", "JWT signing and verification succeeds");
  assert(verified.role === "superadmin", "JWT preserves role claims");

  // 3. Test Order Service and WhatsApp Checkout Logic
  console.log(blue("\n3. Testing WhatsApp Checkout Generator & Pricing Logic..."));
  const { OrderService } = await import("../services/order.service.js");
  const orderNumber = OrderService.generateOrderNumber();
  assert(orderNumber.startsWith("GA-"), `Generated valid order number: ${orderNumber}`);

  const sampleCustomer = { name: "Ananya Sharma", phone: "9876543210", email: "ananya@example.com" };
  const sampleAddress = { street: "42 Park Avenue", city: "Mumbai", state: "Maharashtra", postalCode: "400001", country: "India" };
  const sampleItems = [
    {
      slug: "personalized-photo-frame",
      name: "Personalized Photo Frame",
      price: 599,
      quantity: 1,
      customization: {
        customText: "Happy Anniversary Mom & Dad",
        giftWrap: true,
        cardMessage: "With all our love!",
      },
    },
    {
      slug: "customized-coffee-mug",
      name: "Customized Coffee Mug",
      price: 349,
      quantity: 2,
      customization: {
        customText: "Best Dad Ever",
      },
    },
  ];

  const subtotal = 599 * 1 + 349 * 2; // 599 + 698 = 1297
  const discount = 100;
  const totalAmount = subtotal - discount;

  const msg = OrderService.generateWhatsAppMessage(
    orderNumber,
    sampleCustomer,
    sampleAddress,
    sampleItems,
    { subtotal, discount, totalAmount, couponCode: "GIFT100" },
    "Please pack carefully"
  );

  assert(msg.includes(orderNumber), "WhatsApp message contains order number");
  assert(msg.includes("Ananya Sharma"), "WhatsApp message contains customer name");
  assert(msg.includes("Personalized Photo Frame"), "WhatsApp message contains items");
  assert(msg.includes('Happy Anniversary Mom & Dad'), "WhatsApp message contains custom text");
  assert(msg.includes("Gift Wrap Requested: Yes"), "WhatsApp message contains gift wrap detail");
  assert(msg.includes("Total Amount to Pay: ₹1197"), "WhatsApp message computes correct total");
  assert(msg.includes("Direct on WhatsApp"), "WhatsApp message specifies WhatsApp payment method");
  assert(!msg.includes("Razorpay") && !msg.includes("Stripe"), "Strictly NO payment gateways referenced");

  // 4. Test Validation Schemas with Zod
  console.log(blue("\n4. Testing Input Validation Schemas with Zod..."));
  const {
    createProductSchema,
    createCategorySchema,
    createCustomerSchema,
    whatsAppCheckoutSchema,
    createCouponSchema,
  } = await import("../lib/api/validation/schemas.js");

  // Valid product test
  const validProd = createProductSchema.safeParse({
    name: "Handcrafted Rose Bouquet Box",
    price: 1299,
    mrp: 1799,
    category: "Hampers",
    occasion: ["Valentine's Day"],
    recipient: ["Her"],
    personalizable: true,
  });
  assert(validProd.success, "Zod correctly validates valid product creation payload");

  // Invalid product test (negative price)
  const invalidProd = createProductSchema.safeParse({
    name: "Bad Product",
    price: -50,
    mrp: 100,
    category: "Gifts",
  });
  assert(!invalidProd.success, "Zod correctly rejects invalid product with negative price");

  // Valid WhatsApp checkout payload test
  const validCheckout = whatsAppCheckoutSchema.safeParse({
    customer: { name: "Rohan Verma", phone: "919988776655" },
    shippingAddress: {
      street: "10 Rajpath",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
    },
    items: [
      {
        slug: "teddy-bear-gift-set",
        name: "Teddy Bear Gift Set",
        price: 899,
        quantity: 1,
      },
    ],
  });
  assert(validCheckout.success, "Zod correctly validates WhatsApp checkout payload");

  // Invalid WhatsApp checkout (empty items)
  const invalidCheckout = whatsAppCheckoutSchema.safeParse({
    customer: { name: "Rohan", phone: "919988776655" },
    shippingAddress: { street: "10 Rajpath", city: "Delhi", state: "Delhi", postalCode: "110001" },
    items: [],
  });
  assert(!invalidCheckout.success, "Zod correctly rejects checkout with empty items list");

  // 5. Test Coupon Model Method
  console.log(blue("\n5. Testing Coupon Validation Logic..."));
  const testCoupon = new Coupon({
    code: "FESTIVE20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderValue: 500,
    validFrom: new Date(Date.now() - 3600000),
    validUntil: new Date(Date.now() + 86400000),
    usageLimit: 10,
    usedCount: 2,
    isActive: true,
  });
  assert(testCoupon.isValidNow(600).valid === true, "Coupon isValidNow passes when conditions are met");
  assert(testCoupon.isValidNow(300).valid === false, "Coupon isValidNow rejects orders below minOrderValue");

  // 6. Test Upload Service File Type Check
  console.log(blue("\n6. Testing Upload Service Architecture..."));
  const { UploadService } = await import("../services/upload.service.js");
  assert(typeof UploadService.uploadImage === "function", "UploadService.uploadImage is defined and ready");

  console.log(bold(`\n=== Test Results: ${passed} Passed, ${failed} Failed ===\n`));
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(red("Test Runner Exception:"), err);
  process.exit(1);
});
