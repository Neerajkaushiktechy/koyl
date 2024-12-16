import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const userModel = mongoose.Schema({
  firstName: {
    type: String,
    // required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    // required: [true, "Last name is required"],
  },
  email: {
    type: String,
    // required: [true, 'Email is Required'],

  },
  password:
  {
    type: String,
    // required: [true, 'Password is Required'],
  },
  location:
  {
    type: String,
    // required: [true, 'Location is Required'],
  },
  doctor: {
    type: String,
    // required: [true, 'Docter is Required'],
  },
  age: {
    type: Number,
    // required: [true, "Age is Required"]
  },
  weight: {
    type: String,
    // required: [true, "Weight is Required"]
  },
  race: {
    type: String,
    // required: "Race is Required"
  },
  gender: {
    type: String,
    // required: "Gender is Required"
  },
  allergies: {
    type: String,
    // required: "Allergies is Required"
  },
  symptoms: {
    type: String,
  },
  epicPatientId: {
    type: String,
  },
  epicNutritionOrder: {
    type: String,
  },
 
  phone:
  {
    type:String,

  },
  role: {
    type: Number,
    default: 0,
  },
  created_at: { 
    type: Date, 
    required: true, 
    default: Date.now },

    updateDate: {
      default: Date.now,
      type: Date,
    },

    IsDeleted:{
      type: Boolean,
      required: true,
      default: false
    }
});
// encrypting password before saving 
userModel.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});



//compare user  password
userModel.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}






const user = mongoose.model('users', userModel);

module.exports = user;