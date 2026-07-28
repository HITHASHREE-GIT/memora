import React, { useState } from 'react';
import { Brain, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validate: For Sign Up, name is required
        if (!isLogin && !formData.name.trim()) {
            setError('Please enter your full name');
            return;
        }

        // Validate: Password match for Sign Up
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate: Email and password required
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        console.log('Form submitted:', formData);
        
        // Pass the name to parent - use the entered name or fallback to 'User'
        const userName = formData.name.trim() || 'User';
        onLogin({ 
            name: userName, 
            email: formData.email 
        });
    };

    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        // Clear form when switching
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setError('');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Logo */}
                <div className="login-header">
                    <Brain size={48} color="#a78bfa" />
                    <h1>Memora</h1>
                    <p>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* ===== NAME FIELD - Only for Sign Up ===== */}
                    {!isLogin && (
                        <div className="form-group">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    )}
                    
                    {/* ===== EMAIL FIELD ===== */}
                    <div className="form-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    {/* ===== PASSWORD FIELD ===== */}
                    <div className="form-group">
                        <Lock size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                        <button 
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* ===== CONFIRM PASSWORD - Only for Sign Up ===== */}
                    {!isLogin && (
                        <div className="form-group">
                            <Lock size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                required
                            />
                        </div>
                    )}

                    {/* ===== ERROR MESSAGE ===== */}
                    {error && <div className="error-message">{error}</div>}

                    {/* ===== SUBMIT BUTTON ===== */}
                    <button type="submit" className="login-btn">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* ===== SWITCH BETWEEN LOGIN/SIGNUP ===== */}
                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            type="button"
                            className="switch-btn"
                            onClick={handleSwitchMode}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #0f172a;
                    padding: 20px;
                }
                .login-card {
                    background: #1e293b;
                    padding: 40px;
                    border-radius: 24px;
                    max-width: 420px;
                    width: 100%;
                    border: 1px solid rgba(255,255,255,0.05);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .login-header h1 {
                    font-size: 2rem;
                    margin: 10px 0 5px;
                    background: linear-gradient(135deg, #a78bfa, #60a5fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .login-header p {
                    color: #94a3b8;
                    margin: 0;
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .form-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: border-color 0.3s;
                }
                .form-group:focus-within {
                    border-color: #7c3aed;
                }
                .form-group input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                }
                .form-group input::placeholder {
                    color: #64748b;
                }
                .form-group svg {
                    color: #64748b;
                    flex-shrink: 0;
                }
                .toggle-password {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0;
                }
                .error-message {
                    color: #ef4444;
                    font-size: 0.85rem;
                    text-align: center;
                    padding: 8px;
                    background: rgba(239, 68, 68, 0.1);
                    border-radius: 8px;
                }
                .login-btn {
                    padding: 14px;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .login-btn:hover {
                    transform: scale(1.02);
                    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
                }
                .login-footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #94a3b8;
                }
                .switch-btn {
                    background: transparent;
                    border: none;
                    color: #a78bfa;
                    cursor: pointer;
                    font-weight: 600;
                    margin-left: 5px;
                }
                .switch-btn:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;