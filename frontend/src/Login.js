import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ login }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/'); // redirect to home page
        } catch (error) {
            // todo
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='username'>Username</label>
                <input 
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Log In</button>
        </form>
    );
}

export default Login;