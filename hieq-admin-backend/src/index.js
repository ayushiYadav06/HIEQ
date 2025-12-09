require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const userRoutes = require('./routes/user.routes');
const ticketRoutes = require('./routes/ticket.routes');
const adminTicketRoutes = require('./routes/admin.ticket.routes');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120
});
app.use(limiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin/tickets', adminTicketRoutes);


// health
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
