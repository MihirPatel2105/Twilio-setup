require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const voiceRoutes = require("./routes/voice");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", voiceRoutes);

// DB Connect
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/callDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
