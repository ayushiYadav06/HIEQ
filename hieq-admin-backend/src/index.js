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
const candidateRoutes = require('./routes/candidate.routes');
const employerRoutes = require('./routes/employer.routes');
const ticketRoutes = require('./routes/ticket.routes');
const adminTicketRoutes = require('./routes/admin.ticket.routes');
const adminListManagementRoutes = require('./routes/admin.listmanagement.routes');
const roleRoutes = require('./routes/role.routes');
const path = require('path');

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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120
});
app.use(limiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes); // For admin users only
app.use('/api/candidates', candidateRoutes); // For candidates
app.use('/api/employers', employerRoutes); // For employers
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin/tickets', adminTicketRoutes);
app.use('/api/admin/listmanagement', adminListManagementRoutes);
app.use('/api/admin/roles', roleRoutes);


// health
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
