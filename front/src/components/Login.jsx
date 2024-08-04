import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Login.css'; // 导入CSS样式文件

const Login = () => {
  const navigate = useNavigate(); // 使用 useNavigate 钩子
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:7001/api/login', formData);
      if (res.data.status === 200) {
        navigate(`/ProjectPage?username=${formData.username}`);
      } else {
        alert('用户名或密码错误');
      }
    } catch (error) {
      alert('请求失败: ' + error.message);
    }
  };

  // 添加注册处理函数
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:7001/api/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status === 200) {
        alert('注册成功');
        // 注册成功后的逻辑
      } else if (res.data.status === 502) {
        alert('用户名已存在');
      } else {
        alert('注册失败');
      }
    } catch (error) {
      alert('注册请求失败: ' + error.message);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* 用户名和密码输入框 */}
        <div className="form-control">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">登录</button>
        <button 
          type="button" 
          className="register-button"
          onClick={handleRegister}
        >
          注册
        </button>
      </form>
    </div>
  );
};

export default Login;