const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { Op, Sequelize } = require('sequelize');

/**
 * Create a new recipe
 */
exports.createRecipe = async (req, res) => {
    const { title, ingredients, steps, category } = req.body;
    const picture = req.file ? req.file.filename : null;
    try {
        const recipe = await Recipe.create({ title, ingredients, steps, category, picture, createdBy: req.user.id });
        res.status(201).json({ message: 'Recipe created successfully', recipe });
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error });
    }
};

/**
 * Retrieve all recipes
 */
exports.getAllRecipes = async (req, res) => {
    const { name, ingredients, category } = req.query;

    const filters = {};
    if (name) filters.title = { [Op.iLike]: `%${name}%` }; // Case-insensitive search
    if (ingredients) filters.ingredients = { [Op.iLike]: `%${ingredients}%` };
    if (category) filters.category = category;

    try {
        const recipes = await Recipe.findAll({ where: filters, include: { model: User, attributes: ['id', 'name', 'email'] } });
        res.json({ recipes });
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};

/**
 * Get a specific recipe by ID
 */
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;

    try {
        // const recipe = await Recipe.findByPk(id, { include: User });
        const recipe = await Recipe.findByPk(id, {
            include: { model: User, attributes: ['id', 'name', 'email'] }, // Include user details
          });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ recipe });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error });
    }
};

/**
 * Update an existing recipe
 */
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, steps, category, isApproved } = req.body;
    const picture = req.file ? req.file.filename : null;

    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.createdBy !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You are not authorized to edit this recipe' });
        }
        console.log(title, picture, ingredients, steps, category, isApproved)
        await recipe.update({ title, ingredients, steps, category, picture, isApproved });
        res.json({ message: 'Recipe updated successfully', recipe });
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error });
    }
};

/**
 * Delete a recipe
 */
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.createdBy !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
        }

        await recipe.destroy();
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error });
    }
};

/**
 * Rate a recipe
 */
exports.rateRecipe = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    console.log(rating)
    try {
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        await Rating.create({ userId: req.user.id, recipeId: id, rating });
        // Calculate the average rating
        const avgRatingResult = await Rating.findAll({
            where: { recipeId: id },
            attributes: [[Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"]],
        });
        
        // Extract the average rating from the result
        const averageRating = avgRatingResult[0].get('averageRating');

        // Update the recipe's rating
        await Recipe.update({ rating: averageRating }, { where: { id } });
        
        // Respond with success message and average rating
        res.json({ message: "Recipe rated successfully", averageRating });
    } catch (error) {
        console.error("Error rating recipe:", error);
        res.status(500).json({ message: "Error rating recipe", error });
    }
};

/**
 * Generate social sharing links for a recipe
 */
exports.shareRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const recipeUrl = `http://localhost:5000/api/recipes/${id}`; // Replace with your app's domain
        const shareLinks = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(recipeUrl)}&text=${encodeURIComponent(recipe.title)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(recipeUrl)}`,
        };

        res.json({ message: 'Share links generated successfully', shareLinks });
    } catch (error) {
        console.error('Error generating share links:', error);
        res.status(500).json({ message: 'Error generating share links', error });
    }
};