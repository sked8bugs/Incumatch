// index.ts

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth'; // ✅ Import your auth routes

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ✅ Mount the route using a prefix
app.use('/api', authRoutes);

app.get('/', (_req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
