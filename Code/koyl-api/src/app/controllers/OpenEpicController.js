import { json } from "express";
import bcrypt from 'bcrypt';
import { createToken } from "../helper/authHelper";
import nodemailer from "nodemailer";
import { CREATE_PATIENT_USER_ACCOUNT, DOCTOR_CREDENTIALS } from "../../globalConstants";
const Patient = require('../models/patientModel')
const UserModel = require('../models/userModel')
const mongoose = require('mongoose')
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const qs = require('qs');
const clientSecret = '+c1eLQ7s9RAtTOG0Rd7+zEgzdkEa2twuJsiQ6F40sMQcEqrJFBs8rOE4ndI1XzWAz32eNtr58kFWCgCH519c1w==';
const redirectUri = `${process.env.BASE_URL}/open-epic-launch/`;

const getAccessToken = async () => { // Use the correct token URL
    const clientId = process.env.OPEN_EPIC_CLIENT_ID; // Replace with your actual client ID
    const privateKey = fs.readFileSync('private-key.pem'); // Path to your private key

    // JWT payload
    const payload = {
        iss: clientId,
        sub: clientId,
        aud: process.env.OPEN_EPIC_TOKEN_URL,
        exp: Math.floor(Date.now() / 1000) + (5 * 60), // Token expiration time (5 minutes from now)
        jti: Math.random().toString(36).substring(2), // Unique identifier for the token
    };

    // Sign the JWT
    const jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    // console.log('jwtToken....', jwtToken)
    // Request access token
    const requestBody = {
        grant_type: 'client_credentials',
        client_id: clientId,
        // client_secret: clientSecret,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: jwtToken,
    };

    try {
        const response = await axios.post(process.env.OPEN_EPIC_TOKEN_URL, requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;
        // console.log('Access Token:', access_token);
        return access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};



const getPatientDetails = async (accesToken, patientId) => {
    try {
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/Patient/${patientId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accesToken}`,
                            Accept: 'application/fhir+json',
                        }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const searchPatientByQueryString = async (accessToken, searchParams) => {
    console.log(new URLSearchParams(searchParams).toString())
    try {
        const resp = await axios.get(`${process.env.FHIR_BASE_URL_R4}/Patient?${new URLSearchParams(searchParams).toString()}`,
            { headers: { Authorization: `Bearer ${accessToken}` } });
        return resp?.data;;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getPatientMedicalHistoryFromEpic = async (accesToken, patientId) => {
    try {
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/Condition`,
                    {
                        params: {
                            category: 'medical-history',
                            patient: `${patientId}`
                        },
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getPatientMedicationRequestFromEpic = async (accesToken, searchParams) => {
    try {
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/MedicationRequest?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getAllergyIntoleranceFromEpic = async (accesToken, searchParams) => {
    try {
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/AllergyIntolerance?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getNutritionOrderFromEpic = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/NutritionOrder?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getDiagnosticReportFromEpic = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/DiagnosticReport?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const decodeJwtToken = async (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const getPractitionerDetailFromIdToken = async (accesToken, fhirUserUrl) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    fhirUserUrl,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getLocationFromEpic = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/Location/${searchParams}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const generateLoginToken = async (user) => {

    try {
        const { email } = user;

        let User = await UserModel.findOne({ email });
        if (!User) {
            User = await UserModel.create(user)
        }


        const token = createToken({
            id: User._id,
            role: User.role,
            firstName: User.firstName,
            lastName: User.lastName,
            email: User.email,
            userId: User._id,
        });
        await sendEmailToNewRegistredDoctor(email, `${User.firstName} ${User.lastName}`);
        return token;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getObservationSearch = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/Observation?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getListSearch = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/List?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getCarePlanSearch = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/CarePlan?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const fetchPatientEncounter = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/Encounter?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const documentReferenceCreateClinicalNotes = async (accesToken, requestBody) => {
    try {
        if (accesToken != "") {
            const resp = await axios
                .post(
                    `${process.env.FHIR_BASE_URL_R4}/DocumentReference`,
                    requestBody,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.status;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const fetchEpicClinicalDocument = async (accesToken, searchParams) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/DocumentReference?${new URLSearchParams(searchParams).toString()}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getdetailDocumentReferenceUrl = async (accesToken, fhirUserUrl) => {
    try {
        console.log(accesToken)
        if (accesToken != "") {
            const resp = await axios
                .get(
                    fhirUserUrl,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const fetchEpicBinaryDocument = async (accesToken, binaryId) => {
    try {
        if (accesToken != "") {
            const resp = await axios
                .get(
                    `${process.env.FHIR_BASE_URL_R4}/${binaryId}`,
                    {
                        headers: { Authorization: `Bearer ${accesToken}` }
                    }
                );
            return resp?.data;
        }
        return {}
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const sendEmailToNewRegistredDoctor = async (user, name) => {
    const doctorEmail = user.toLowerCase();
    console.log(doctorEmail, "what is dpctor email")
    const doctorExits = await UserModel.findOne({ doctorEmail });
    console.log(doctorExits, "doctorExist")
    const userData = {name}
    if (!doctorExits) {
        // Write Code for sending mail to patient 
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SENDER_EMAIL_ID,
                pass: process.env.SENDER_EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: {
                name: "Koyl.io",
                address: process.env.SENDER_EMAIL_ID,
            }, // sender address
            to: doctorEmail, // list of receivers
            subject: "Your Account Credentials", // Subject line
            text: DOCTOR_CREDENTIALS(userData, doctorEmail), // plain text body
        };

        const sendMail = async (transporter, mailOptions) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(
                        "Error sending email in creat aaccount:",
                        error
                    );
                } else {
                    console.log("Email sent:", info.response);
                }
            });
        };
        sendMail(transporter, mailOptions);
    }
}


module.exports = {
    getEpicAccessToken: async () => {
        const accessToken = await getAccessToken();
        return accessToken;
    },
    getPatientById: async (req, res) => {
        const { patientId } = req.params; //'ebHdgxihff2ykTZyvPdS1ew3'
        const epicAccessToken = req.headers.epicaccesstoken;

        const patientDetails = await getPatientDetails(epicAccessToken, patientId);
        return { patientDetails };
    },
    searchPatientByParams: async (req, res) => {
        const epicAccessToken = req.headers.epicaccesstoken;
        const patientList = await searchPatientByQueryString(epicAccessToken, req.query)
        let patients = [];
        if (patientList && patientList.total === 0) {
            return { patientList: [], message: 'No Record Found' }
        } else {
            patients = await patientList.entry.map(patient => {
                let obj = {}
                if (patient.resource.id) {
                    obj['epicPatientId'] = patient.resource.id
                    obj['name'] = patient.resource.name
                    obj['telecom'] = patient.resource.telecom
                    obj['gender'] = patient.resource.gender
                    obj['birthDate'] = patient.resource.birthDate
                    obj['address'] = patient.resource.address
                    // obj['maritalStatus'] = patient?.resource?.maritalStatus?.text ? patient?.resource?.maritalStatus?.text : 'Un Married'
                    obj['contact'] = patient.resource.contact
                    return obj
                }
                return false
            }).filter(patient => patient)
            return { patientList: patients, message: 'Seclect best match Record' }
        }
    },
    savePatientRecord: async (req, res) => {
        try {
            const filter = {
                epicPatientId: req.body.epicPatientId,
                // userId: new mongoose.Types.ObjectId(req.body.userId)
            }
            const update = {
                ...req.body
            }
            const record = await Patient.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true // Make this update into an upsert
            });
            return { data: record, message: 'Patient Information Stored Successfully' }
        } catch (error) {
            throw error;
        }
    },

    createPatientUserAccount: async (req, res) => {
        const { email } = req.body;
        try {
            const filter = {
                epicPatientId: req.body.epicPatientId,
                // userId: new mongoose.Types.ObjectId(req.body.userId)
            }
            let newUserFlag = false;
            const userData = req.body;
            console.log(userData, "what is userdata")
            const userExits = await UserModel.findOne({ email });
            if (!userExits) {
                const password = await bcrypt.hash('12345', 10);
                userData.password = password;
                newUserFlag = true
            }
            const record = await UserModel.findOneAndUpdate(filter, userData, {
                new: true,
                upsert: true // Make this update into an upsert
            });
            if (newUserFlag) {
                // Write Code for sending mail to patient 
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.SENDER_EMAIL_ID,
                        pass: process.env.SENDER_EMAIL_APP_PASSWORD,
                    },
                });

                const mailOptions = {
                    from: {
                        name: "Koyl.io",
                        address: process.env.SENDER_EMAIL_ID,
                    }, // sender address
                    to: email, // list of receivers
                    subject: "Your Account Credentials", // Subject line
                    text: CREATE_PATIENT_USER_ACCOUNT(userData), // plain text body
                };

                const sendMail = (transporter, mailOptions) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(
                                "Error sending email in creat aaccount:",
                                error
                            );
                        } else {
                            console.log("Email sent:", info.response);
                        }
                    });
                };
                sendMail(transporter, mailOptions);
            }
            return { data: record, success: true, message: 'User account created/updated successfully' };
        } catch (error) {
            console.log('Error creating/updating user account...', error);
            return { success: false, message: 'Error creating/updating user account', error };
        }
    },


    getPatientRecordFromDB: async (req, res) => {
        try {
            const { patientId } = req.params;
            const filter = {
                epicPatientId: patientId
            }

            const record = await Patient.findOne(filter).exec();
            return { data: record, message: 'Patient Information Retrieved Successfully' }
        } catch (err) {
            throw error;
        }
    },
    fetchPatientMedicalHistoryFromEpic: async (req, res) => {
        try {
            const { patientId } = req.params; //'ebHdgxihff2ykTZyvPdS1ew3'
            const epicAccessToken = req.headers.epicaccesstoken;

            const patientDetails = await getPatientMedicalHistoryFromEpic(epicAccessToken, patientId);
            // return { patientDetails };
            if (patientDetails?.total === 0) {
                return { data: [], message: 'Resource request returns no results.' }
            } else {
                const medicalHistory = patientDetails.entry.map(item => item.resource.code)
                return { data: medicalHistory, message: 'Patient Medical Retrieved Successfully' }
            }

        } catch (err) {
            throw error;
        }
    },
    savePatientMedicalHistory: async (req, res) => {
        try {
            const { userId } = req.params;
            const filter = {
                userId: new mongoose.Types.ObjectId(userId)
            }
            const update = {
                medicalHistory: req.body.medicalHistory
            }
            const record = await Patient.findOneAndUpdate(filter, update, {
                new: true,
                // upsert: true 
            });
            return { data: record, message: 'Patient Medical History Stored/Updated Successfully' }
        } catch (error) {

            throw error;
        }
    },
    searchPatientMedicationRequestFromEpic: async (req, res) => {
        try {
            const epicAccessToken = req.headers.epicaccesstoken;
            const medications = await getPatientMedicationRequestFromEpic(epicAccessToken, req.query)
            const medicineObj = {}
            if (medications?.total && medications.total > 0) {
                const allEntries = medications.entry;
                for (let i = 0; i < medications.total; i++) {
                    let obj = {
                        status: allEntries[i].resource.status,
                        medicationReference: allEntries[i].resource.medicationReference,
                        encounter: allEntries[i].resource.encounter,
                        authoredOn: allEntries[i].resource.authoredOn,
                        requester: allEntries[i].resource.requester,
                        recorder: allEntries[i].resource.recorder,
                        courseOfTherapyType: allEntries[i].resource.courseOfTherapyType.text,
                        dosageInstruction: allEntries[i].resource.dosageInstruction,
                    }
                    if (!medicineObj[allEntries[i].resource.status]) {
                        medicineObj[allEntries[i].resource.status] = [obj]
                    } else {
                        medicineObj[allEntries[i].resource.status].push(obj)
                    }
                }
            }
            return { medication: medicineObj, message: 'Seclect best match Record' }
        } catch (error) {
            throw error;
        }
    },
    savePatientMedicationRequestFromEpic: async (req, res) => {
        try {
            const { userId } = req.params;
            const filter = {
                userId: new mongoose.Types.ObjectId(userId)
            }
            const update = {
                medicationHistory: {
                    stopped: req.body.medication.stopped,
                    completed: req.body.medication.completed,
                    onHold: req.body.medication["on-hold"]
                },
                currentMedication: req.body.medication.active
            }
            const record = await Patient.findOneAndUpdate(filter, update, {
                new: true,
            });
            return { data: record, message: 'Patient Medical History Stored/Updated Successfully' }
        } catch (error) {

            throw error;
        }
    },
    searchAllergyIntoleranceFromEpic: async (req, res) => {
        try {
            const epicAccessToken = req.headers.epicaccesstoken;
            const allergyList = await getAllergyIntoleranceFromEpic(epicAccessToken, req.query)

            return { allergyList: allergyList, message: 'Seclect best match Record' }
        } catch (error) {
            throw error;
        }
    },
    searchNutritionOrderFromEpic: async (req, res) => {
        try {
            const epicAccessToken = req.headers.epicaccesstoken;
            const medication = await getNutritionOrderFromEpic(epicAccessToken, req.query)
            return { medication: medication, message: 'Seclect best match Record' }
        } catch (error) {
            throw error;
        }
    },
    searchDiagnosticReportFromEpic: async (req, res) => {
        try {
            const epicAccessToken = req.headers.epicaccesstoken;
            const medication = await getDiagnosticReportFromEpic(epicAccessToken, req.query)
            return { medication: medication, message: 'Seclect best match Record' }
        } catch (error) {
            throw error;
        }
    },
    docRefCreateClinicalNotes: async (req, res) => {
        try {
            const epicAccessToken = req.headers.epicaccesstoken;
            const status = await documentReferenceCreateClinicalNotes(epicAccessToken, req.body)
            if (status === 201) {
                return { status: status, message: 'Clinical Notes Created Successfully' }
            } else {
                return { status: status, message: 'Something went wrong' }
            }
        } catch (error) {
            throw error;
        }
    },
    fetchLatestEncounter: async (req, res) => {
        try {
            const latestEncounter = [];
            const epicAccessToken = req.headers.epicaccesstoken;
            const encounterList = await fetchPatientEncounter(epicAccessToken, req.query);
            if (encounterList.total > 0) {
                const encounter = {
                    "reference": `Encounter/${encounterList?.entry[0]?.resource?.id}`
                }
                latestEncounter.push(encounter)
            }
            return { latestEncounter: latestEncounter, message: 'Seclect best match Record' }
        } catch (error) {
            throw error;
        }
    },
    fetchLatestClinicalDocument: async (req, res) => {
        try {
            const latestEncounter = [];
            const epicAccessToken = req.headers.epicaccesstoken;
            const documentsList = await fetchEpicClinicalDocument(epicAccessToken, req.query);
            if (documentsList.total > 0) {
                const documentReference = await getdetailDocumentReferenceUrl(epicAccessToken, documentsList.entry[0].fullUrl);
                const binaryId = documentReference?.content.find(binary => binary.attachment.contentType == "text/html")
                const binaryDocument = await fetchEpicBinaryDocument(epicAccessToken, binaryId?.attachment?.url)
                return { documentReference: binaryDocument.replace(/(\r\n|\n|\r)/gm, ""), message: 'Document Fetched Successfully' }
            } else {
                return { documentReference: "", success: true, message: 'Document not found' };
            }

        } catch (error) {
            throw error;
        }
    },
    accessTokenCallBack: async (req, res) => {
        const code = req.query.code;
        const state = req.query.state;
        const iss = req.query.iss;
        const tokenData = qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.BASE_URL}/open-epic-launch/`,
            client_id: process.env.OPEN_EPIC_CLIENT_ID,
            client_secret: process.env.OPEN_EPIC_CLIENT_APP_SECRET,
        });
        console.log('process.env.BASE_URL', process.env.BASE_URL, `${process.env.BASE_URL}/open-epic-launch/`);
        console.log('tokenData...', JSON.stringify(tokenData));
        try {
            const tokenResponse = await axios.post(process.env.OPEN_EPIC_TOKEN_URL, tokenData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            console.log('tokenResponse...', tokenResponse.data)
            const { access_token, refresh_token, patient, id_token, user, loginDepartment, location } = tokenResponse.data;
            const decodedIDToken = await decodeJwtToken(id_token);
            const patientDetails = await getPatientDetails(access_token, patient);
            const organizationDetails = await getLocationFromEpic(access_token, location)
            const practitionerDetails = await getPractitionerDetailFromIdToken(access_token, decodedIDToken?.fhirUser);
            const nutritionOrder = await getNutritionOrderFromEpic(access_token, { patient: patient });
            const medicalHis = await getPatientMedicalHistoryFromEpic(access_token, patient)
            const allergyList = await getAllergyIntoleranceFromEpic(access_token, { patient: patient });
            const getLabResults = await getObservationSearch(access_token, { patient: patient, category: 'laboratory' });
            const currentProblems = await getListSearch(access_token, { patient: patient, code: 'problems' })
            const hosPitalProblems = await getListSearch(access_token, { patient: patient, code: 'hospital-problems' })
            const longitudinalCarePlan = await getCarePlanSearch(access_token, { patient: patient, category: '38717003' })
            const InpatientCarePlan = await getCarePlanSearch(access_token, { patient: patient, category: '736353004' })
            const OutpatientCarePlan = await getCarePlanSearch(access_token, { patient: patient, category: '736271009' })
            const encounterList = await fetchPatientEncounter(access_token, { patient: patient });
            let latestEncounter = []
            if (encounterList.total > 0) {
                const encounter = {
                    "reference": `Encounter/${encounterList?.entry[0]?.resource?.id}`
                }
                latestEncounter.push(encounter)
            }
            const currentTreatmentPlans = {
                longitudinalCarePlan,
                InpatientCarePlan,
                OutpatientCarePlan
            }
            const loginUserDetails = {
                email: decodeURIComponent(user).toLowerCase(),
                firstName: practitionerDetails?.name[0]?.given[0],
                lastName: practitionerDetails?.name[0]?.given[1] | '',
                password: '12345',
                location: `${organizationDetails?.name},  ${organizationDetails?.address?.line.join(', ')}, ${organizationDetails?.address?.city}, ${organizationDetails?.address?.state}, ${organizationDetails?.address?.country}, ${organizationDetails?.address?.postalCode}`,
                doctor: `Dr. ${practitionerDetails?.name[0]?.given.join(' ')}`,
                role: 1,
            }
            const loginToken = await generateLoginToken(loginUserDetails);

            let medicalHistory
            if (medicalHis?.total === 0) {
                medicalHistory = [];
            } else {
                medicalHistory = medicalHis?.entry?.map(item => item.resource.code)
            }
            return { accessToken: access_token, patient, patientDetails, practitionerDetails, idToken: decodedIDToken, user: decodeURIComponent(user), organizationDetails, refresh_token, loginToken, nutritionOrder, medicalHistory, allergyList, labResults: getLabResults, currentProblems, hosPitalProblems, currentTreatmentPlans, latestEncounter };
        } catch (error) {
            console.log('tokenResponse error...', error)
            return error;
        }
    }
}