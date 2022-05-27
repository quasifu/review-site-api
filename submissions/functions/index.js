const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const FUNCTION_BASEPATH = '/api';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const CustomFunction = require('./customFunction');
const customFunction = new CustomFunction(db);
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
//app.get(`${FUNCTION_BASEPATH}/:action`, customFunction.getItem);
//app.post(`${FUNCTION_BASEPATH}/:action`, customFunction.updateItem);
//force build
app.put(`${FUNCTION_BASEPATH}/:action`, customFunction.createItem);
//app.delete(`${FUNCTION_BASEPATH}/:action`, customFunction.deleteItem);
//app.get(`${FUNCTION_BASEPATH}`, customFunction.getItems);

// Expose Express API as a single Cloud Function:
exports.submissions = functions.https.onRequest(app);
