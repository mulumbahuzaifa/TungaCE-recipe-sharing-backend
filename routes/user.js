const express = require('express');
const { authenticate, authorizeRole  } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Error fetching users
 */
router.get('/users', authenticate, authorizeRole(['Admin']), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user
 */
router.get('/users/:id', authenticate, authorizeRole(['Admin']), userController.getUserById);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update a user's role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: The new role for the user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [Admin, Contributor, Viewer]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role specified
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user role
 */
router.put('/users/:id/role', authenticate, authorizeRole(['Admin']), userController.updateUserRole);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete('/users/:id', authenticate, authorizeRole(['Admin']), userController.deleteUserById);


/**
 * @swagger
 * /api/users/{id}/recipes:
 *   get:
 *     summary: Retrieve recipes created by a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose recipes to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of recipes created by the user
 *       500:
 *         description: Error fetching user recipes
 */
router.get('/users/:id/recipes', authenticate, authorizeRole(['Admin']), userController.getUserRecipes);

/**
 * @swagger
 * /api/my-recipes:
 *   get:
 *     summary: Retrieve recipes created by the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recipes created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       ingredients:
 *                         type: string
 *                       steps:
 *                         type: string
 *                       category:
 *                         type: string
 *                       createdBy:
 *                         type: integer
 *       500:
 *         description: Error fetching your recipes
 */
router.get("/my-recipes", authenticate, authorizeRole(['Contributor', 'Admin']), userController.getMyRecipes);

module.exports = router;