import React, { useState } from 'react';
import SideNav from './components/SideNav';
import AvatarCanvas from './components/AvatarCanvas';
import CameraView from './components/CameraView';
import ChatInterface from './components/ChatInterface';

function App() {
  const [view, setView] = useState('patient');
  const [message, setMessage] = useState('Welcome to Memora!');
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleScanFace = () => {
    setShowChat(false);
    setShowCamera(true);
    setMessage('📸 Camera opened! Click capture to scan face.');
  };

  const handleCapture = (blob) => {
    setIsProcessing(true);
    setMessage('🔄 Processing face...');
    
    setTimeout(() => {
      setMessage('✅ Face captured! Processing complete.');
      setIsProcessing(false);
      setShowCamera(false);
    }, 2000);
  };

  const handleChat = () => {
    setShowCamera(false);
    setShowChat(true);
    setMessage('💬 Chat mode activated!');
  };

  // ✅ REPLACE THIS ENTIRE FUNCTION with the new one
  const handleSendMessage = async (text) => {
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text }]);
    setMessage('🤔 Thinking...');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Call your backend API
      const response = await fetch('https://memora-api-6wym.onrender.com/api/v1/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
          text: text  // ✅ Using 'text' field name (matches backend)
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to UI
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: data.response || data.text || 'I processed your message.' 
      }]);
      setMessage('💬 Response received!');
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: '⚠️ Sorry, I\'m having trouble connecting. Please try again later.' 
      }]);
      setMessage('❌ Error connecting to server');
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setMessage('Chat closed. What would you like to do?');
  };

  return (
    <div style={{ height: '100vh', background: '#0f172a', color: 'white', paddingTop: '70px' }}>
      <SideNav onViewChange={setView} currentView={view} />
      <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
        <div style={{ width: '50%', borderRight: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {showCamera ? (
            <div style={{ padding: '20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CameraView onCapture={handleCapture} isProcessing={isProcessing} />
            </div>
          ) : showChat ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 20px', background: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>💬 Chat with Memora</span>
                <button 
                  onClick={handleCloseChat}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                onScanFace={handleScanFace}
              />
            </div>
          ) : (
            <AvatarCanvas 
              isSpeaking={false} 
              isProcessing={isProcessing} 
              message={message} 
            />
          )}
        </div>
        <div style={{ 
          width: '50%', 
          padding: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🧠</div>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Memora</h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '40px' }}>
            Your AI Memory Assistant
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={handleScanFace}
              style={{ 
                padding: '14px 35px', 
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'white', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
              }}
            >
              📸 Scan Face
            </button>
            <button 
              onClick={handleChat}
              style={{ 
                padding: '14px 35px', 
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'white', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
              }}
            >
              💬 Chat
            </button>
          </div>
          <p style={{ 
            marginTop: '30px', 
            color: '#64748b', 
            fontSize: '0.9rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '20px'
          }}>
            {showCamera ? '📸 Camera is active' : showChat ? '💬 Chat is active' : 'Click a button to interact with Memora'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;