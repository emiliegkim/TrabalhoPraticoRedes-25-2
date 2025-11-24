// server/controllers/patientController.js
const patientService = require("../services/patientService");

// Função auxiliar para erros vindos da service
function handleError(err, res) {
  if (err && err.status && err.body) {
    // Erro criado pelo httpError da Homrich
    return res.status(err.status).json(err.body);
  }

  console.error("Erro inesperado:", err);
  return res.status(500).json({ error: "Internal Server Error" });
}

// POST /Patient
exports.createPatient = (req, res) => {
  try {
    const result = patientService.createPatient(req.body);
    const location = `/Patient/${result.id}`;
    res.status(201).location(location).json(result.patient);
  } catch (err) {
    handleError(err, res);
  }
};

// GET /Patient/:id
exports.getPatientById = (req, res) => {
  try {
    const patient = patientService.getPatientById(req.params.id);
    res.status(200).json(patient);
  } catch (err) {
    handleError(err, res);
  }
};

// PUT /Patient/:id
exports.updatePatient = (req, res) => {
  try {
    const updated = patientService.updatePatient(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    handleError(err, res);
  }
};

// DELETE /Patient/:id
exports.deletePatient = (req, res) => {
  try {
    patientService.deletePatient(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
};

// GET /PatientIDs
exports.listPatientIds = (req, res) => {
  try {
    const ids = patientService.listPatientIds();

    if (!ids || ids.length === 0) {
      return res.status(204).send();
    }

    res.status(200).json(ids);
  } catch (err) {
    handleError(err, res);
  }
};
