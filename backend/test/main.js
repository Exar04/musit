import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, "../auth/protos/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition);

function registerUser(call, callback) {
  const { username, email } = call.request;
  console.log("New User Registered via gRPC:", username, email);

  // 👉 Normally you would save to DB here
  callback(null, { message: `User ${username} registered successfully` });
}

function main() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, { RegisterUser: registerUser });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("gRPC UserService running on port 50051");
    }
  );
}

main();