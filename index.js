const app = require('./app') // The Express app
// const db = require('./config/database');
const sequelize = require('./config/config');
const config = require('./utils/config')
const logger = require('./utils/logger')

// Sync Database and Start Server
sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  });
});