import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { User } from '../models/userModel.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = verify(token, process.env.JWT_SECRET);

            req.user = decoded
            req.user = await User.findOne({ userId: decoded.id }); // here id is user._id from auth db
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const requireAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ userId: decoded.id }); // here id is user._id from auth db

    // right now we assume only yash is admin
    // but maybe in the future we could add functionality
    // where each user can upload their songs and view analytics for it
    // right now song uploading and analytics can only be done by yash
    if (req.user.username == "yash") {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, requireAdmin };