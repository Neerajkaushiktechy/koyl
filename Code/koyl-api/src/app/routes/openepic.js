import { Router } from "express";
import OpenEpicController from "../controllers/OpenEpicController";
const qs = require('qs');
import axios from 'axios';
import Auth from "../middleware/auth";

export default () => {
  const openEpicRouter = Router();

  openEpicRouter.get("/get-epic-access-token", async (req, res) => {
    try {
      const data = await OpenEpicController.getEpicAccessToken(req, res);
      res.status(200).json({epicAccessToken: data, success:true, message:'Token Retrived Successfully', status:200});
    } catch (err) {
      console.log(err);
    }
  })

  openEpicRouter.get("/patient/:patientId", async (req, res) => {
    try {
      const data = await OpenEpicController.getPatientById(req, res);
      res.status(200).json({...data, success:true, message:'Data Retrived Successfully', status:200});
      // res.status(200).json(data);
    } catch (err) {
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
      console.log(err);
    }
  });

  openEpicRouter.get("/search-patient", async(req, res) => {
    try {
      const data = await OpenEpicController.searchPatientByParams(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.post("/save-patient",  Auth.isAutheticated, async(req, res) => {
    try {
      const data = await OpenEpicController.savePatientRecord(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({err:err.message, success:false, message:'Invalid Epic Access Token', status:400});
    }
  });
  openEpicRouter.post("/create-patient", Auth.isAutheticated,  async(req, res) => {

    try {
      const data = await OpenEpicController.createPatientUserAccount(req, res);
      console.log(data,"Create Account..")
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({err:err.message, success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/get-patient-record-from-db/:patientId", async(req, res) => {
    try {
      const data = await OpenEpicController.getPatientRecordFromDB(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({err:err.message, success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/get-patient-medical-history/:patientId", async(req, res) => {
    try {
      const data = await OpenEpicController.fetchPatientMedicalHistoryFromEpic(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({err:err.message, success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.put("/save-patient-medical-history/:userId", async(req, res) => {
    try {
      const data = await OpenEpicController.savePatientMedicalHistory(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({err:err.message, success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/search-medication-request-search-orders", async(req, res) => {
    try {
      const data = await OpenEpicController.searchPatientMedicationRequestFromEpic(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.put("/medication-request-save-orders/:userId", async (req, res) => {
    try {
      const data = await OpenEpicController.savePatientMedicationRequestFromEpic(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err){
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/search-allergy-intolerance", async(req, res) => {
    try {
      const data = await OpenEpicController.searchAllergyIntoleranceFromEpic(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  

  openEpicRouter.get("/search-nutrition-order-from-epic", async(req, res) => {
    try {
      const data = await OpenEpicController.searchNutritionOrderFromEpic(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/search-diagnostic-report-from-epic", async(req, res) => {
    try {
      const data = await OpenEpicController.searchDiagnosticReportFromEpic(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/fetch-latest-encounter", async(req, res) => {
    try {
      const data = await OpenEpicController.fetchLatestEncounter(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.post("/doc-ref-create-clinical-notes", async(req, res) => {
    try {
      const data = await OpenEpicController.docRefCreateClinicalNotes(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  openEpicRouter.get("/fetch-latest-clinical-note", async(req, res) => {
    try {
      const data = await OpenEpicController.fetchLatestClinicalDocument(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err) {
      console.log(err);
      res.status(400).json({success:false, message:'Invalid Epic Access Token', status:400});
    }
  });

  const clientId = process.env.OPEN_EPIC_CLIENT_ID;
  const redirectUri = `${process.env.BASE_URL}/open-epic-launch/`;
  openEpicRouter.get('/launch', (req, res) => {
    const iss = req.query.iss;
    const launch = req.query.launch;
    const state = 'sasasasasasasasa';
    const scope = 'user/Condition.read user/Patient.read fhirUser launch launch/encounter launch/patient openid';
    
    const authorizeUrl = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&aud=${iss}&launch=${launch}`;
    res.redirect(authorizeUrl);
  });

  openEpicRouter.get('/callback', async(req, res)=>{
    try {
      const data = await  OpenEpicController.accessTokenCallBack(req, res);
      res.status(200).json({...data, success:true, status:200});
    } catch(err){
      console.log(err);
      res.status(400).json({success:false, message:err, status:400});
    }
  });

  openEpicRouter.get('/patient', async (req, res) => {
    const accessToken = req.query.access_token;
    const patientId = req.query.patient_id;
    const iss = req.query.iss;

    try {
      const patientResponse = await axios.get(`${iss}/Patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/fhir+json',
        },
      });
      console.log('patientResponse...', patientResponse);
      res.json(patientResponse.data);
    } catch (error) {
      res.status(500).send('Error fetching patient data');
    }
  });

  return openEpicRouter;
};
