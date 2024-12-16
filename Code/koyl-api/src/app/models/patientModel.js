import mongoose from 'mongoose';
const { Schema } = mongoose;

const childSchema = new Schema({ 
    text: 'String',
    coding: [{
        system: String,
        code: String,
        display: String,
    }] 
});

const medicationHistory = new Schema({
    stopped: Object,
    completed: Object,
    onHold: Object,
})

const patientModel = mongoose.Schema({
    epicPatientId:{
        type: String,
        default: ''
    },
    // userId:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    gender: {
        type: String,
        default: ''
    },
    maritalStatus: {
        type: String,
        default: ''
    },
    address: Object,
    name: Object,
    telecom: Object,
    contact: Object,
    medicalHistory: {
        type: [childSchema],
        default: null
    },
    medicationHistory: medicationHistory,
    currentMedication: Object,
    nutritionList: Object,
    allergyList: Object,
    labResults: Object,
    currentProblems: Object,
    hosPitalProblems: Object,
    currentTreatmentPlans: Object,
    latestEncounter: Object,


}, { timestamps: true });

const patient = mongoose.model('patients', patientModel);

module.exports = patient;