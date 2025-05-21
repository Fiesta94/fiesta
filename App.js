require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const subjectsRoutes = require('./routes/subjectsRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const assignmentsRoutes = require('./routes/assignmentsRoutes');
const submissionsRoutes = require('./routes/submissionsRoutes');
const gradesRoutes = require('./routes/gradesRoutes');
const coursesRoutes = require('./routes/coursesRoutes');


const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Static file serving for uploads (if you use file uploads)
app.use('/uploads', express.static('uploads'));

// Database connection and sync
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

sequelize.sync({ force: false })
  .then(() => console.log('Database & tables synced successfully.'))
  .catch((err) => console.error('Error syncing database:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/timetable', timetableRoutes);
app.use('/assignments', assignmentsRoutes);
app.use('/submissions', submissionsRoutes);
app.use('/grades', gradesRoutes);
app.use('/courses', coursesRoutes);
// Add more routes here as you create them

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;