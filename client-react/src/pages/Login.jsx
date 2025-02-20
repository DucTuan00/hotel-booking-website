import React, { useState, useEffect } from 'react';
import LoginForm from '../components/login/LoginForm';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(() => localStorage.getItem('isRegister') === 'true');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        localStorage.setItem('isRegister', isRegister);
    }, [isRegister]);

    const toggleAuthMode = () => {
        setIsRegister(prevState => !prevState);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (type) => async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (type === 'register') {
                await authService.register(formData.name, formData.phone, formData.email, formData.password);
                console.log('Register successfully');
                setIsRegister(false); // Set to false to show login form
            } else if (type === 'login') {
                const userData = await authService.login(formData.email, formData.password);

                if (userData.role === 'admin') {
                    navigate('/dashboard'); // Navigate to dashboard
                } else {
                    navigate('/'); // Navigate to home
                }
            }
        } catch (err) {
            console.error('Lỗi:', err);
            setError(err.error || err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <LoginForm
                onSubmit={handleSubmit}
                onChange={handleChange}
                formData={formData}
                isRegister={isRegister}
                toggleAuthMode={toggleAuthMode}
            />
        </div>
    );
};

export default Login;