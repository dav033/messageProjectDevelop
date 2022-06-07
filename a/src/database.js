const mongoose = require("mongoose");

// const url = process.env.MONGODB_URL
//   ? process.env.MONGODB_URL
//   : "mongodb://localhost/27017/hola";
const url =
  "mongodb+srv://david1:clavesegura03@cluster0.fh0si84.mongodb.net/?retryWrites=true&w=majority";
//const url = "mongodb://localhost/adios";

mongoose.connect(url, {
  useNewUrlParser: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DB is connected");
});
