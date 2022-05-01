const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/login", require("./routes/auth.routes"));

async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.2mhid.mongodb.net/todo?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: true,
      }
    );

    app.listen(PORT);
  } catch (error) {
    console.log(error);
  }
}
start();
