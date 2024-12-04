const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
        });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};
/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

/**
 * Update user role
 */
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['Admin', 'Contributor', 'Viewer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

/**
 * Delete user by ID
 */
exports.deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

/**
 * Get recipes created by a user
 */
exports.getUserRecipes = async (req, res) => {
    const { id } = req.params;

    try {
        const recipes = await Recipe.findAll({ where: { createdBy: id } });
        res.json({ recipes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user recipes', error });
    }
};

/**
 * Get recipes created by the authenticated user
 */
exports.getMyRecipes = async (req, res) => {
    try {
        console.log('User ID:', req.user.id);
        const recipes = await Recipe.findAll({ where: { createdBy: req.user.id } });
        if (!recipes) {
            return res.status(404).json({ message: 'No recipes found' });
        }
        res.json({ recipes });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching your recipes', error });
    }
};