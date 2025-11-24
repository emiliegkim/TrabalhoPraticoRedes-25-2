const express = require("express");
const patientRoutes = require("./routes/patientRoutes");
const repo = require("./repository/patientRepository");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

if (typeof repo.init === "function") {
  repo.init();
}

app.use("/", patientRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`PatientsOnFIRE rodando em http://localhost:${PORT}`);
});
