import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('WARNING: MONGO_URI not found in environment variables');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Warning: Running server without MongoDB connection. Database features will not work.');
    // Don't exit process - allow server to run without DB for basic testing
  }
};

export default connectDB; 