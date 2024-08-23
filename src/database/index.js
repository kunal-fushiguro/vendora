import { MONGODB_URL } from "@/utils/env";
import mongoose from "mongoose";

const connection = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Database connected already : )");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URL || "", {
      dbName: "vendora",
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected : )");
  } catch (error) {
    console.log("Database connection error : (");
    console.error(error);
    process.exit(1);
  }
};

export { dbConnect };
