import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { startGrpcServer } from './grpc/userServer.js';

dotenv.config();
const PORT = process.env.PORT || 8085;

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

startGrpcServer();