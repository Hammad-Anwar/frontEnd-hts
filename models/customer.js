const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const customerSchema = Schema({
    customerid: Number, 
    customerName: String, 
    email: String,
    password: String,    
});

module.exports = model('customer', customerSchema);