import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB connected!! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;

// In Node.js, process.exit() is a method that terminates the current Node.js process. It allows you to forcefully exit the application. When called, it immediately stops the event loop and exits the program with the specified exit code or the default exit code of 0. It should be used with caution, as it abruptly ends the execution of the program and doesn't allow for cleanup or graceful termination.
