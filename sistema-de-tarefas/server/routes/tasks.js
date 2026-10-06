import { Router } from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';
const router = Router();
router.use(auth);

router.get('/', async (req,res)=>{
  const r = await pool.query('SELECT * FROM tasks WHERE user_id=$1 ORDER BY position ASC', [req.user.id]);
  res.json(r.rows);
});

router.post('/', async (req,res)=>{
  const {title, description, status, due_date} = req.body;
  const r = await pool.query('INSERT INTO tasks(title,description,status,due_date,user_id,position) VALUES($1,$2,$3,$4,$5,0) RETURNING *', [title, description, status||'todo', due_date||null, req.user.id]);
  req.io.emit('tasks:update');
  res.json(r.rows[0]);
});

router.put('/:id', async (req,res)=>{
  const {title, description, status, position, due_date} = req.body;
  const r = await pool.query('UPDATE tasks SET title=$1, description=$2, status=$3, position=$4, due_date=$5 WHERE id=$6 AND user_id=$7 RETURNING *', [title, description, status, position, due_date, req.params.id, req.user.id]);
  req.io.emit('tasks:update');
  res.json(r.rows[0]);
});

router.delete('/:id', async (req,res)=>{
  await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  req.io.emit('tasks:update');
  res.json({ok:true});
});
export default router;