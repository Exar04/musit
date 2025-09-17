import dotenv from 'dotenv';
import './lib/instrumentation.js'
import app from './app.js';
import connectDB from './config/db.js';
import winston from 'winston';

// dotenv.config();
if (process.env.IS_DOCKER_ENV !== 'true') {dotenv.config(); console.log("loading env variables via .env file")}

const PORT = process.env.PORT || 8080;

connectDB();
const logger = winston.createLogger()

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));