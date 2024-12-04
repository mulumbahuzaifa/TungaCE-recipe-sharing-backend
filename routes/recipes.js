const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const recipeController = require('../controllers/recipeController');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API for managing recipes
 */

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               steps:
 *                 type: string
 *               category:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       500:
 *         description: Error creating recipe
 */
router.post('/', authenticate, authorizeRole(["Contributor", "Admin"]), upload.single('picture'), recipeController.createRecipe);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Retrieve all recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter recipes by title (case-insensitive)
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter recipes by ingredients (case-insensitive)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter recipes by category
 *     responses:
 *       200:
 *         description: List of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   ingredients:
 *                     type: string
 *                   steps:
 *                     type: string
 *                   category:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   createdBy:
 *                     type: integer
 *       500:
 *         description: Error fetching recipes
 */
router.get("/", authenticate, authorizeRole(["Viewer", "Contributor", "Admin"]), recipeController.getAllRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a specific recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipe:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     ingredients:
 *                       type: string
 *                     steps:
 *                       type: string
 *                     category:
 *                       type: string
 *                     picture:
 *                       type: string
 *                     createdBy:
 *                       type: integer
 *                     User:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error fetching recipe
 */
router.get('/:id', authenticate, authorizeRole(["Viewer", "Contributor", "Admin"]), recipeController.getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update an existing recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               steps:
 *                 type: string
 *               category:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *               isApproved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       403:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, authorizeRole(["Admin", "Contributor"]), upload.single('picture'), recipeController.updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       403:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, authorizeRole(["Contributor", "Admin"]), recipeController.deleteRecipe);

/**
 * @swagger
 * /api/recipes/{id}/rate:
 *   post:
 *     summary: Rate a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Recipe rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 averageRating:
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Error rating recipe
 */
router.post("/:id/rate", authenticate, authorizeRole(["Viewer"]), recipeController.rateRecipe);

/**
 * @swagger
 * /api/recipes/share/{id}:
 *   get:
 *     summary: Generate social sharing links for a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Social sharing links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shareLinks:
 *                   type: object
 *                   properties:
 *                     facebook:
 *                       type: string
 *                     twitter:
 *                       type: string
 *                     whatsapp:
 *                       type: string
 *                     instagram:
 *                       type: string
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error generating share links
 */
router.get('/share/:id', authenticate, authorizeRole(['Viewer', 'Contributor', 'Admin']), recipeController.shareRecipe);

module.exports = router;