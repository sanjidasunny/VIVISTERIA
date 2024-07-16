const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming you still want to keep userId for referencing users
  name: String, // User's name
  email: String, // User's email
  orderedItems: [{ name: String, price: Number }], // Array of ordered items
  orderDate: { type: Date, default: Date.now }, // Date of order
  totalAmount: Number, // Total amount of the order
  paymentMethod: String, // Chosen payment method
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
