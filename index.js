require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { Sequelize } = require('sequelize');
const progressRoutes = require('./routes/progressRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authenticate = require('./middlewares/authMiddleware');
const { User, Course, Progress } = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: '*' }
});
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

sequelize.sync({ force: false })
  .then(() => console.log('Database & tables synced successfully.'))
  .catch((err) => console.error('Error syncing database:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/progress', progressRoutes);
app.use('/courses', courseRoutes);
app.use('/courses', authenticate, courseRoutes);
app.use('/progress', authenticate, progressRoutes);
app.use('/auth', authRoutes);
const roleMiddleware = require('./middlewares/roleMiddleware');

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/admin', authenticate, roleMiddleware('admin'), (req, res) => {
  res.send('Welcome, Admin!');
});

// --- SOCKET.IO CHAT ---
let chatMessages = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ tutorId, studentId }) => {
    const room = `room_${tutorId}_${studentId}`;
    socket.join(room);
    // Send chat history
    const history = chatMessages.filter(
      m => String(m.tutorId) === String(tutorId) && String(m.studentId) === String(studentId)
    );
    socket.emit('chatHistory', history);
  });

  socket.on('chatMessage', (msg) => {
    chatMessages.push(msg);
    const room = `room_${msg.tutorId}_${msg.studentId}`;
    io.to(room).emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server with Socket.IO
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});