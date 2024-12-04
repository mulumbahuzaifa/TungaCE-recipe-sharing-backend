# Recipe Management System

This is a Recipe Management System built with Node.js, Express, and Sequelize. It allows users to create, update, delete, and rate recipes. The system also supports user authentication and authorization, and it includes features for uploading recipe images.

## Features

- User Registration and Authentication
- Recipe CRUD Operations
- Image Upload for Recipes
- Recipe Rating System
- Admin Approval for Recipes
- Social Sharing Links for Recipes

## Project Structure

- `app.js`: The main application file that sets up the Express server, connects to the database, and defines routes.
- `models/`: Directory containing the Sequelize models for the application.
- `controllers/`: Directory containing the controller functions for handling requests and responses.
- `routes/`: Directory containing the route definitions for the application.
- `middleware/`: Directory containing middleware functions for the application.
- `uploads/`: Directory for storing uploaded images.
- `README.md`: This file, containing information about the project.


## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mulumbahuzaifa/TungaCE-recipe-sharing-backend.git
   cd recipe-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory and add the following:

   ```plaintext
   PORT=5000
   DB_HOST=localhost
   DB_USER=
   DB_PASSWORD=
   DB_NAME=recipe_db
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=
   EMAIL_PASS=
   ```

4. Set up the database:

   Ensure your PostgreSQL server is running and create a database named `recipe_db`.

5. Run the application:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`.

## API Documentation

The API is documented using Swagger. You can access the documentation at `http://localhost:5000/api-docs`.

## Usage

- **Register a User**: Send a POST request to `/api/auth/register` with `name`, `email`, and `password`.
- **Login**: Send a POST request to `/api/auth/login` with `email` and `password` to receive a JWT token.
- **Create a Recipe**: Send a POST request to `/api/recipes` with `title`, `ingredients`, `steps`, `category`, and `picture` (as a file).
- **Rate a Recipe**: Send a POST request to `/api/recipes/:id/rate` with a `rating` between 1 and 5.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [info@luwatechnologies.com](mailto:info@luwatechnologies.com).

