import { useState, useEffect } from 'react';
import axios from 'axios';
import Board from './components/Board.jsx';
import './app.css';export default function App(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({email:'', password:'', name:''});
  const [isLogin, setIsLogin] = useState(true);  const fetchTasks = async () => {
    if(!token) return;
    const res = await axios.get('/api/tasks', {headers:{Authorization:`Bearer ${token}`}});
    setTasks(res.data);
  };  useEffect(()=>{ fetchTasks(); },[token]);  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin? '/api/auth/login' : '/api/auth/register';
    const {data} = await axios.post(url, form);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    location.reload();
  };  if(!user) return (
    <div className="auth">
      <h1>Sistema de Tarefas</h1>
      <form onSubmit={handleAuth}>
        {!isLogin && <input placeholder="Nome" onChange={e=>setForm({...form,name:e.target.value})}/>}
        <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Senha" onChange={e=>setForm({...form,password:e.target.value})}/>
        <button>{isLogin? 'Entrar' : 'Criar'}</button>
      </form>
      <button onClick={()=>setIsLogin(!isLogin)}>{isLogin? 'Criar conta' : 'Já tenho conta'}</button>
    </div>
  );
  return <div className="app"><Board tasks={tasks} token={token} /></div>;
}