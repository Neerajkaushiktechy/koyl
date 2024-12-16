import mongoose from 'mongoose';

const SharedRecommendationModel = mongoose.Schema({
  disease: {
    type: String,
  },
  symptoms: {
    type: String,
  },
  allergies:{
    type: String,
  },
  recommendations: {
    type: String,
  },
  synopsis: { 
    type: String,
  },
  food: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
  },
  phone: {
    type: String,
  },
  StudiesLink: [
    {
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  participation: {
    type: String,
   default: "Didn't check in"
  },
});

const SharedRecommendation = mongoose.model(
  "SharedPatientRecommendation",
  SharedRecommendationModel
);

module.exports = SharedRecommendation;
