import mongoose from "mongoose";

// Define the return type of the connection function
type DbConnection = {
  connection: mongoose.Connection;
};

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    const conn: DbConnection = await mongoose.connect(process.env.MONGODB_URI, {
      // Note: useNewUrlParser and useUnifiedTopology are no longer needed in newer versions
      // of Mongoose as they are now default options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      `Error: ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`
    );
    process.exit(1);
  }
};

export default connectDB;