// require('dotenv').config({path : './env'});
import dotenv from "dotenv";
dotenv.config({path:'./env'});


import express from "express";
const app = express();



import connectDB from "./db/index.js";
connectDB();


// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("errror", (error) => {
//       console.log("ERRR: ", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Error", error);
//     throw error;
//   }
// })();
