import React from 'react';
import { Brain, Users, Settings, Camera, Mic, MessageCircle, Home, LogOut } from 'lucide-react';

const ProfessionalUI = ({ children, currentView, onViewChange, onLogout }) => {
    return (
        <div className="professional-ui">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo-section">
                    <Brain size={32} color="#a78bfa" />
                    <span>Memora</span>
                </div>
                <nav className="nav-menu">
                    <button 
                        className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
                        onClick={() => onViewChange('home')}
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </button>
                    <button 
                        className={`nav-btn ${currentView === 'family' ? 'active' : ''}`}
                        onClick={() => onViewChange('family')}
                    >
                        <Users size={20} />
                        <span>Family</span>
                    </button>
                    <button 
                        className={`nav-btn ${currentView === 'scan' ? 'active' : ''}`}
                        onClick={() => onViewChange('scan')}
                    >
                        <Camera size={20} />
                        <span>Scan</span>
                    </button>
                    <button 
                        className={`nav-btn ${currentView === 'chat' ? 'active' : ''}`}
                        onClick={() => onViewChange('chat')}
                    >
                        <MessageCircle size={20} />
                        <span>Chat</span>
                    </button>
                    <button 
                        className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`}
                        onClick={() => onViewChange('settings')}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    {/* Logout Button */}
                    <button 
                        className="nav-btn logout-btn"
                        onClick={onLogout}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {children}
            </div>

            <style>{`
                .professional-ui {
                    display: flex;
                    height: 100vh;
                    background: #0f172a;
                    color: white;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .sidebar {
                    width: 80px;
                    background: rgba(30, 41, 59, 0.8);
                    backdrop-filter: blur(10px);
                    border-right: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px 0;
                    flex-shrink: 0;
                }
                .logo-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 30px;
                }
                .logo-section span {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #a78bfa;
                    letter-spacing: 1px;
                }
                .nav-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    width: 100%;
                    padding: 0 10px;
                    flex: 1;
                }
                .nav-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 12px 0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.65rem;
                    width: 100%;
                }
                .nav-btn:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .nav-btn.active {
                    background: rgba(124, 58, 237, 0.2);
                    color: #a78bfa;
                }
                .nav-btn.active svg {
                    color: #a78bfa;
                }
                .logout-btn {
                    margin-top: auto;
                    color: #ef4444;
                }
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }
                .main-content {
                    flex: 1;
                    overflow: hidden;
                    padding: 0;
                }
            `}</style>
        </div>
    );
};

export default ProfessionalUI;