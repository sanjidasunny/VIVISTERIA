const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  orderedItems: [{
    name: String,
    size: String, // Portion
    price: Number,
    quantity: Number,
    category: String,

  }],
  orderDate: { type: Date, default: Date.now }, // Date of order
  totalAmount: Number,
  paymentMethod: String,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
