import path from "path";
import { fileURLToPath } from "url";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { User } from '../models/userModel.js';

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, '../../protos/user.proto');

// Load proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition);

// gRPC implementation
async function registerUser(call, callback) {
  const { username, email, userid } = call.request;
  console.log("Received gRPC registerUser request:", username, email, userid);

  // 👉 normally save user into DB here or do side effects
  // callback(null, { message: `User ${username} registered successfully` });

  try {
    // Save new user in MongoDB
    const user = await User.create({ username, email, userId: userid });

    callback(null, {
      message: `User ${user.username} registered successfully`,
    });
  } catch (err) {
    console.error("Error saving user in MongoDB:", err.message);
    callback({
      code: grpc.status.INTERNAL,
      message: "Failed to register user",
    });
  }
}

// Function to start server
export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, { RegisterUser: registerUser });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("gRPC server running on port 50051");
    }
  );
}