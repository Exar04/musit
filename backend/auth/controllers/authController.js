import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import grpcClient from '../grpc/userService.js';

import { trace, SpanStatusCode } from "@opentelemetry/api"

const tracer = trace.getTracer('auth-lib')

const generateToken = (user) => {
    return tracer.startActiveSpan("generateJwtToken", (span) => {
        span.end()
        return jwt.sign(
            {
                id: user._id,        // Mongo _id
                username: user.username, // extra payload
                email: user.email,       // optional
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )
    })
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const oldregisterUser = async (req, res) => {
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

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const span = tracer.startSpan('registerUser');
    span.setAttribute('app.route', '/auth/register');

    try {
        span.addEvent('Register user process started');

        const { username, email, password } = req.body;
        span.setAttribute('app.user_email', email);
        span.setAttribute('app.user_username', username);

        if (!username || !email || !password) {
            span.addEvent('Missing fields in request body');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Missing fields' });

            return res.status(400).json({ message: 'Please enter all fields' });
        }

        span.addEvent('Checking if user already exists');
        const userExists = await tracer.startActiveSpan('findUserByEmail', async (dbSpan) => {
            dbSpan.setAttribute('db.system', 'mongodb');
            dbSpan.setAttribute('db.operation', 'findOne');
            dbSpan.setAttribute('db.user_email', email);

            const existingUser = await User.findOne({ email });
            dbSpan.setAttribute('app.user_exists', Boolean(existingUser));
            dbSpan.end();

            return existingUser;
        });

        if (userExists) {
            span.addEvent('User already exists in database');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'User already exists' });

            return res.status(400).json({ message: 'User already exists' });
        }

        span.addEvent('Creating new user in database');
        const user = await tracer.startActiveSpan('createUser', async (createSpan) => {
            createSpan.setAttribute('db.system', 'mongodb');
            createSpan.setAttribute('db.operation', 'create');
            createSpan.setAttribute('app.user_email', email);
            createSpan.setAttribute('app.user_username', username);

            const newUser = await User.create({ username, email, password });
            createSpan.end();
            return newUser;
        });

        if (user) {
            span.setAttribute('app.new_user_id', user._id.toString());

            span.addEvent('Registering user in gRPC service');
            tracer.startActiveSpan('grpcRegisterUser', (grpcSpan) => {
                grpcClient.RegisterUser(
                    { username, email, userid: user._id.toString() },
                    (err, response) => {
                        if (err) {
                            grpcSpan.recordException(err);
                            grpcSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
                            console.error('gRPC Error:', err.message);

                            grpcSpan.end();
                            return res.status(201).json({
                                _id: user._id,
                                username: user.username,
                                email: user.email,
                                token: generateToken(user),
                                grpcMessage: "gRPC call failed",
                            });
                        }

                        grpcSpan.addEvent('gRPC user registration successful');
                        grpcSpan.setStatus({ code: SpanStatusCode.UNSET });
                        grpcSpan.end();

                        console.log('gRPC Response:', response);

                        res.status(201).json({
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            token: generateToken(user),
                            // grpcMessage: response.message
                        });
                    }
                );
            });

        } else {
            span.addEvent('Failed to create user');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid user data' });

            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        console.error('Error in registerUser:', error);

        res.status(500).json({ message: 'Server error', error: { message: error.message, stack: error.stack } });

    } finally {
        span.end();
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const span = tracer.startSpan('loginUser');
    span.setAttribute('app.route', '/auth/login');

    try {
        span.addEvent('Login process started');

        const { email, password } = req.body;
        span.setAttribute('app.user_email', email);

        if (!email || !password) {
            span.addEvent('Missing email or password in request body');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Missing fields' });

            return res.status(400).json({ message: 'Please enter all fields' });
        }

        span.addEvent('Looking up user in database');
        const user = await tracer.startActiveSpan('findUserByEmail', async (dbSpan) => {
            const result = await User.findOne({ email });
            dbSpan.setAttribute('db.system', 'mongodb');
            dbSpan.setAttribute('db.operation', 'findOne');
            dbSpan.setAttribute('db.user_email', email);
            dbSpan.end();
            return result;
        });

        span.setAttribute('app.user_found', Boolean(user));

        if (user && (await user.matchPassword(password))) {
            span.addEvent('User authenticated successfully');

            const token = generateToken(user);
            span.addEvent('JWT token generated');

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: token
            });

            span.setStatus({ code: SpanStatusCode.UNSET }); // Success
        } else {
            span.addEvent('Invalid credentials provided');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid credentials' });

            res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (err) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
        span.addEvent('Exception occurred during login');

        res.status(500).json({
            message: 'Server error',
            error: { message: err.message, stack: err.stack }
        });

    } finally {
        span.end();
    }
};
