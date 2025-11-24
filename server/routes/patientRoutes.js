// server/routes/patientRoutes.js
const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");

// POST /Patient – cria novo Patient
router.post("/Patient", patientController.createPatient);

// GET /Patient/:id – busca Patient por ID
router.get("/Patient/:id", patientController.getPatientById);

// PUT /Patient/:id – atualiza Patient existente
router.put("/Patient/:id", patientController.updatePatient);

// DELETE /Patient/:id – remove Patient
router.delete("/Patient/:id", patientController.deletePatient);

// GET /PatientIDs – lista IDs existentes
router.get("/PatientIDs", patientController.listPatientIds);

module.exports = router;
