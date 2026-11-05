import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/client_compliance_portal';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`👉 Make sure MongoDB is running locally or set MONGODB_URI in .env`);
    console.warn(`👉 The Express server and Swagger UI will continue running without crashing.`);
  }
};
