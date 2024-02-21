const express = require("express");
const notes = require("./routes/notes");
require('dotenv').config()
const { connect, default: mongoose } = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_DB_ATLAS_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

(async()=>{
    try {
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.info("Connected to NotesDB");
      } catch (error) {
        console.error("Something went wrong", error);
      }
})()


const app = express();
app.use(express.json());
const port = process.env.PORT || 9000;

app.use("/api/notes", notes);
app.listen(port, () => console.log(`Listening on Port ${port}`));


//port
//connection to db
