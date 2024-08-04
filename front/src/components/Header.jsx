import React, { useEffect, useState } from 'react';
import '../style/Header.css'; // 导入CSS样式文件
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    
    const queryParams = new URLSearchParams(location.search);
    const usernameFromQuery = queryParams.get('username');
    if (usernameFromQuery) {
      setUsername(usernameFromQuery);
    }
  }, [location.search]);

  return (
    <div className="header-container">
      <nav className="header-nav">
        <ul>
          <li><a href="#home" onClick={(e) => {
            e.preventDefault();
            navigate(`/ProjectPage?username=${username}`);
          }}>项目总览</a></li>
          <li><a href="#services" onClick={(e) => {
            e.preventDefault();
            navigate(`/`);
          }}>退出登录</a></li>
        </ul>
      </nav>
    </div>
  );
};

// 内联样式
const styles = {
  nav: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  ul: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    width: '60%',
  },
  li: {
    padding: '5px 20px',
  },
  a: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    textTransform: 'uppercase',
  },
};

export default Header;