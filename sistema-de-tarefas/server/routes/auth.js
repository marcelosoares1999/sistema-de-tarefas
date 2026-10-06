import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
const router = Router();

router.post('/register', async (req,res)=>{
  const {name,email,password} = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const r = await pool.query('INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id,name,email', [name,email,hash]);
    const token = jwt.sign({id:r.rows[0].id}, process.env.JWT_SECRET || "secret123");
    res.json({user:r.rows[0], token});
  } catch(e){ res.status(400).json({error:"Email já existe"}) }
});