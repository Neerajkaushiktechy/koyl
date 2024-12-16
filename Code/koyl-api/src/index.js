import http from "http";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cron from "node-cron"
import reminderController from "./app/controllers/reminderController";

// dotenv for env variables on cross platform (linux, windows, etc)
import rootPath from "../rootpath";

// Access the Auth endpoints
import api from "./app";

let envPath = process.env.NODE_ENV === "test" ? "features.env" : ".env";
envPath = path.resolve(rootPath, `./${envPath}`);
dotenv.config({ silent: true, path: envPath });

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000","https://koyl.techbitsolution.com"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(cookieParser());
const server = http.createServer(app);
server.keepAliveTimeout = 30 * 1000;
server.headersTimeout = 35 * 1000;
// Ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363

app.use(helmet());

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.get("/favicon.ico", (req, res) => res.status(204));
app.use("/api", api());
// cron.schedule("*/60 * * * * *", async function  () {
//   await reminderController.userReminder()
// });
/**
 * Listen on provided port, on all netconst express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
const qs = require('qs');

import rootPath from '../rootpath';

let envPath = process.env.NODE_ENV === 'test' ? 'features.env' : '.env';
envPath = path.resolve(rootPath, `./${envPath}`);
dotenv.config({ silent: true, path: envPath });

const app = express();
const { ORIGIN, SESSION_VALID_DAYS, FRONTEND_URL } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (ORIGIN.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: 'GET,PUT,POST,DELETE',
        };
        // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false };
        // disable CORS for this request
    }
    callback(null, corsOptions);
    // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));
const clientId = '116f727d-c27d-4cd9-abcd-34c966c60ca1';
const clientSecret = '+c1eLQ7s9RAtTOG0Rd7+zEgzdkEa2twuJsiQ6F40sMQcEqrJFBs8rOE4ndI1XzWAz32eNtr58kFWCgCH519c1w==';
const redirectUri = 'http://localhost:3000/';

app.get('/launch', (req, res) => {
    const iss = req.query.iss;
    const launch = req.query.launch;
    const state = 'sasasasasasasasa';
    const scope = 'user/Condition.read user/Patient.read fhirUser launch launch/encounter launch/patient openid';

    const authorizeUrl = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&aud=${iss}&launch=${launch}`;

    res.redirect(authorizeUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const iss = req.query.iss;

    const tokenUrl = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token`;
    const tokenData = qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
    });

    try {
        const tokenResponse = await axios.post(tokenUrl, tokenData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token, patient } = tokenResponse.data;

        res.json({ accessToken: access_token, patient });
    } catch (error) {
        res.status(500).send('Error during token exchange');
    }
});

app.get('/patient', async (req, res) => {
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

        res.json(patientResponse.data);
    } catch (error) {
        res.status(500).send('Error fetching patient data');
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});work interfaces.
 */
server.listen(process.env.PORT || 5000);

mongoose
  .connect(
    "mongodb+srv://dharmusingh0997:VeXFTMzUZ3bHKl9w@cluster0.7qgfbi8.mongodb.net/Koyl",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    server.on("listening", () => {
      console.log("Server is running at port 5000");
    });
  })
  .catch(() => {
    console.log("Connected to MongoDB");
  });

  

module.exports = app;
