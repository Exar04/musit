import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import grpcClient from '../grpc/userService.js';


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,        // Mongo _id
      username: user.username, // extra payload
      email: user.email,       // optional
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            
            grpcClient.RegisterUser({ username, email, userid: user._id.toString() }, (err, response) => {
                if (err) {
                    console.error("gRPC Error:", err.message);
                    // Don’t fail the request if gRPC call fails
                    return res.status(201).json({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        token: generateToken(user),
                        grpcMessage: "gRPC call failed",
                    });
                }

                console.log("gRPC Response:", response);

                res.status(201).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id),
                    // grpcMessage: response.message, // 👈 extra info from gRPC service
                });
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};