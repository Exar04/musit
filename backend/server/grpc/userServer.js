import path from "path";
import { fileURLToPath } from "url";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

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
function registerUser(call, callback) {
  const { username, email } = call.request;
  console.log("Received gRPC registerUser request:", username, email);

  // 👉 normally save user into DB here or do side effects
  callback(null, { message: `User ${username} registered successfully` });
}

// Function to start server
export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, { RegisterUser: registerUser });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      // server.start();
      console.log("gRPC server running on port 50051");
    }
  );
}