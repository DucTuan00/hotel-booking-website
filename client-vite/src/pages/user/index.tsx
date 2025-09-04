import React from 'react';
//import './Home.css'; // Import file CSS riêng cho trang Home (tùy chọn)

function Home() {
  return (
    <div
      className="home-container"
      style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
      }}
    >
      Hello
      <button
      onClick={() => {
        window.location.href = '/login';
      }}
      style={{
        padding: '12px 32px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginTop: '24px'
      }}
      >
      Login
      </button>
    </div>
  );
}

export default Home;