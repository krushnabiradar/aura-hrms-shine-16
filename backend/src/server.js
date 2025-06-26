
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Use alter: true to automatically update existing tables with new columns
    // This is safer than force: true as it doesn't drop existing data
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
