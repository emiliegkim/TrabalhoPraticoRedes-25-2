const express = require("express");
const path = require("path");
const patientRoutes = require("./routes/patientRoutes");
const repo = require("./repository/patientRepository");

const app = express();
const PORT = 3000;

app.use(express.json());

repo.init();
app.use("/", patientRoutes);


app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});

module.exports = app;
