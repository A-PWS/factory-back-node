const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

require('./dbConnection/db.js')

//import route
const authRoute = require("./routes/auth");
const nShiftRoute = require("./routes/nShift");
const fetchRoute = require("./routes/fetchRoutes");
const dashboardRoute = require("./routes/dashboard");


app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: "*",
  })
);


app.get("/", (req, res) => {
    res.send("api running");
});


//Router Middlewares
app.use("/", authRoute);
app.use("/", nShiftRoute);
app.use("/", fetchRoute);
app.use("/", dashboardRoute);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`server running on port ${port}`));

module.exports = server;