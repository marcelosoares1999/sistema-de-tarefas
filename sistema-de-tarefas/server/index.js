import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{ req.io = io; next(); });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

await initDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`API rodando na porta ${PORT}`));