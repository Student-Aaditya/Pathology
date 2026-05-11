require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    method: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
    credentials: true,
  }),
);

const authRoute = require("./route/authRoute");
const patientRoute = require("./route/patientRoute");
const billRoute = require("./route/billRoute");
const operationRoute = require("./route/operationRoute");
const financeRoute = require("./route/financeRoute");
const pathologistAuthRoute=require("./route/Pathologist-route/pathologistRoute");

app.use("/api/auth", authRoute);
app.use("/api/patient", patientRoute);
app.use("/api/bill", billRoute);
app.use("/api/operation", operationRoute);
app.use("/api/finance", financeRoute);
app.use("/api/pathologist/auth",pathologistAuthRoute);

app.get("/", (req, res) => {
  res.send("Hello World Pathology Lab");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
