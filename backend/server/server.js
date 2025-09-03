import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { startGrpcServer } from './grpc/userServer.js';
import { createServer } from "http"
import { initilizeSocket } from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT || 8085;

connectDB();

const httpServer = createServer(app)
initilizeSocket(httpServer);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

startGrpcServer();