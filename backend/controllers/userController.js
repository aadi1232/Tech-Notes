const User = require('../models/User');
const Note = require('../models/Note');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// Get all users
const getAllusers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) { // Corrected check for no users
        return res.status(404).json({ message: 'No users found' });
    }
    res.json(users);
});

// Create new user
const CreateNewusers = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Hash password and create user object
    const hashedpwd = await bcrypt.hash(password, 10);
    const userObject = { username, password: hashedpwd, roles };

    // Create and store new user
    const user = await User.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// Update user
const Updateusers = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Update user details
    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json({ message: `${updatedUser.username} updated` });
});

// Delete user
const Deleteusers = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Check if user has notes
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    // Find the user by ID
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Store the user details before deletion
    const username = user.username;
    const userId = user._id;

    // Perform deletion
    await user.deleteOne();

    // Send response with the stored username and ID
    const reply = `Username ${username} with ID ${userId} deleted`;
    res.json(reply);
});

module.exports = {
    getAllusers,
    CreateNewusers,
    Updateusers,
    Deleteusers
};
