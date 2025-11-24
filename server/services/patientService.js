// server/services/patientService.js

const repo = require("../repository/patientRepository");
const { httpError } = require("../utils/httpErrors");
const {
  validateForCreate,
  validateForUpdate,
  normalizePatient
} = require("../models/patientValidator");

// Garante que o ID é um número inteiro positivo
function parseId(idFromUrl) {
  const id = Number(idFromUrl);
  if (!Number.isInteger(id) || id <= 0) {
    throw httpError(400, "ID must be a positive integer");
  }
  return id;
}

// POST /Patient
function createPatient(rawPatient) {
  if (!rawPatient || typeof rawPatient !== "object") {
    throw httpError(400, "Request body must be a JSON object");
  }

  const normalized = normalizePatient(rawPatient);

  const validation = validateForCreate(normalized);
  if (!validation.ok) {
    throw httpError(
      validation.status || 400,
      validation.message || "Invalid Patient for creation",
      validation.details
    );
  }

  const patientWithoutId = validation.patient || normalized;

  // Homrich gera ID e salva
  const { id, patientWithId } = repo.create(patientWithoutId);

  return { id, patient: patientWithId };
}

// GET /Patient/:id
function getPatientById(idFromUrl) {
  const id = parseId(idFromUrl);

  const patient = repo.read(id);
  if (!patient) {
    throw httpError(404, `Patient with ID ${id} not found`);
  }

  return patient;
}

// PUT /Patient/:id
function updatePatient(idFromUrl, rawPatient) {
  const id = parseId(idFromUrl);

  if (!rawPatient || typeof rawPatient !== "object") {
    throw httpError(400, "Request body must be a JSON object");
  }

  const existing = repo.read(id);
  if (!existing) {
    throw httpError(404, `Patient with ID ${id} not found`);
  }

  const normalized = normalizePatient(rawPatient);

  const validation = validateForUpdate(normalized, id);
  if (!validation.ok) {
    throw httpError(
      validation.status || 400,
      validation.message || "Invalid Patient for update",
      validation.details
    );
  }

  const patientToSave = validation.patient || normalized;

  repo.update(id, patientToSave);

  return repo.read(id);
}

// DELETE /Patient/:id
function deletePatient(idFromUrl) {
  const id = parseId(idFromUrl);

  const existing = repo.read(id);
  if (!existing) {
    throw httpError(404, `Patient with ID ${id} not found`);
  }

  repo.remove(id);
}

// GET /PatientIDs
function listPatientIds() {
  const ids = repo.listIds() || [];
  return ids;
}

module.exports = {
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  listPatientIds
};
