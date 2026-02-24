const User = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../../../config/env');  

// Register a new user
exports.register = async ( req, res) => {
    try {
        const { name, email, password } = req.body;
        const profileImage = req.file ? req.file.path : undefined;
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profileImage
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profileImage: newUser.profileImage
            },
            token
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        res.cookie('token', token, { httpOnly: true });
        res.json({ 
            message: 'Login successful', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            },
            token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
}

// Logout user
exports.logout = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
}