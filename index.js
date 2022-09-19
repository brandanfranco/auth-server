const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/config");
require("dotenv").config();

// server/aplication from express

const app = express();

//Database configuration

dbConnection();

// public acces

app.use(express.static("public"));

//corsOptions
app.use(cors());

// read and parse of body

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
