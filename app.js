const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
const talentRoutes = require("./routes/talents");
const eventRoutes = require("./routes/events");

const api = process.env.API_URL;

app.use(`${api}/talents`, talentRoutes);
app.use(`${api}/events`, eventRoutes);

//Database
mongoose.set('useFindAndModify', false)
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "talent",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });


  const PORT = process.env.PORT || 3000

//Server
app.listen(PORT, () => {
  console.log("server is running http://localhost:3000");
});
