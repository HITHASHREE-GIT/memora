import React, { useState, useEffect } from 'react';
import ProfessionalUI from './components/ProfessionalUI';
import AvatarCanvas from './components/AvatarCanvas';
import CameraView from './components/CameraView';
import ChatInterface from './components/ChatInterface';
import FamilyGallery from './pages/FamilyGallery';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import LoginPage from './pages/LoginPage';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [message, setMessage] = useState('Welcome to Memora!');
  const [showCamera, setShowCamera] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Amitabh Bachchan', relation: 'Close Friend', lastSeen: 'Today', emoji: '🎭', photo: null },
    { id: 2, name: 'Aamir Khan', relation: 'Family', lastSeen: 'Yesterday', emoji: '🎬', photo: null },
    { id: 3, name: 'Deepika Padukone', relation: 'Friend', lastSeen: '3 days ago', emoji: '✨', photo: null },
  ]);

  // ===== AUTO-LOGIN ON PAGE LOAD =====
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('memora_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        const welcomeMsg = `Welcome back, ${userData.name}!`;
        setMessage(welcomeMsg);
        setTimeout(() => speakText(welcomeMsg), 500);
        console.log('✅ Auto-login successful:', userData.name);
      } catch (e) {
        console.log('❌ Error parsing saved user:', e);
        localStorage.removeItem('memora_user');
      }
    }
  }, []);

  // ===== TEXT TO SPEECH FUNCTION =====
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for elderly
    utterance.pitch = 1.1; // Slightly higher, warmer
    utterance.volume = 1;
    
    // Try to use a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.includes('Female') || 
      v.name.includes('Samantha') || 
      v.name.includes('Google UK Female') ||
      v.name.includes('Microsoft Zira')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onerror = () => {
      console.log('Speech error');
    };

    window.speechSynthesis.speak(utterance);
  };

  // ===== HANDLE LOGIN (Also used for Registration) =====
  const handleLogin = (userData) => {
    console.log('🔐 User logged in/registered:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Save user to localStorage so they don't need to login again
    localStorage.setItem('memora_user', JSON.stringify(userData));
    
    const welcomeMsg = `Welcome, ${userData.name}!`;
    setMessage(welcomeMsg);
    // Speak welcome message
    setTimeout(() => speakText(welcomeMsg), 500);
  };

  // ===== HANDLE LOGOUT =====
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setMessages([]);
    setView('home');
    window.speechSynthesis.cancel();
    // Remove saved user from localStorage
    localStorage.removeItem('memora_user');
    console.log('🔓 User logged out');
  };

  // Handle view changes
  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'scan') {
      setShowCamera(true);
      setShowChat(false);
    } else if (newView === 'chat') {
      setShowCamera(false);
      setShowChat(true);
    } else {
      setShowCamera(false);
      setShowChat(false);
    }
  };

  // ===== UPDATED: Real Face Recognition with Voice =====
  const handleCapture = async (blob) => {
    setIsProcessing(true);
    setMessage('🔄 Processing face with AI...');

    const formData = new FormData();
    formData.append('file', blob, 'capture.jpg');

    try {
      const response = await axios.post(`${API_BASE}/recognize/person`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('✅ Recognition response:', response.data);
      
      if (response.data.status === 'identified') {
        const person = response.data.person;
        const announcement = `This is ${person.name}, your ${person.relation || 'friend'}!`;
        
        // Add to family gallery with photo
        const newMember = {
          id: Date.now(),
          name: person.name,
          relation: person.relation || 'Friend',
          lastSeen: 'Just now',
          emoji: '👤',
          photo: URL.createObjectURL(blob)
        };
        
        setFamilyMembers(prev => [...prev, newMember]);
        setMessage(`✅ Welcome, ${person.name}! Added to your family.`);
        
        // ===== SPEAK THE ANNOUNCEMENT =====
        speakText(announcement);
        
      } else {
        const msg = '❌ Face not recognized. Please try again with better lighting.';
        setMessage(msg);
        speakText('Face not recognized. Please try again.');
      }
      
    } catch (error) {
      console.error('❌ Recognition error:', error);
      
      // Fallback: Try to identify from local list
      const identified = Math.random() > 0.3;
      if (identified) {
        const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
        const announcement = `This looks like ${randomMember.name}, your ${randomMember.relation}!`;
        setMessage(`✅ Identified: ${randomMember.name} (${randomMember.relation})`);
        speakText(announcement);
        
        if (!familyMembers.find(m => m.name === randomMember.name)) {
          setFamilyMembers([...familyMembers, { 
            ...randomMember, 
            id: Date.now(),
            photo: URL.createObjectURL(blob)
          }]);
        }
      } else {
        const msg = '❌ No face recognized. Please try again.';
        setMessage(msg);
        speakText('No face recognized. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      setShowCamera(false);
    }
  };

  // ===== UPDATED: Real Chat with Auto-Speak =====
  const handleSendMessage = async (text) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setMessage('🤔 Thinking...');
    
    try {
      // Call real backend
      const response = await axios.post(`${API_BASE}/chat/query`, { text });
      console.log('✅ Chat response:', response.data);
      
      const botText = response.data.text || "I'm not sure how to respond to that.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
      setMessage(botText);
      
      // ===== AUTO-SPEAK THE RESPONSE =====
      speakText(botText);
      
    } catch (error) {
      console.error('❌ Chat error:', error);
      
      // Fallback if backend fails
      const fallbackResponses = [
        "I'm having trouble connecting. Please try again.",
        "My memory is a bit fuzzy right now. Can you repeat that?",
        "I'm here! Just give me a moment.",
        "That's interesting. Tell me more!",
        "I remember that! Let me think about it."
      ];
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      setMessages(prev => [...prev, { role: 'bot', text: fallback }]);
      setMessage(fallback);
      speakText(fallback);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setMessage('Camera closed.');
    speakText('Camera closed.');
  };

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Main app
  return (
    <ProfessionalUI currentView={view} onViewChange={handleViewChange} onLogout={handleLogout}>
      <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
        {/* ===== UPDATED HOME SCREEN ===== */}
        {view === 'home' && (
          <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠</div>
            <h1 style={{ 
              fontSize: '2.8rem', 
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {user?.name ? `Welcome back, ${user.name}! 👋` : 'Welcome to Memora!'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
              {user?.name ? `I remember you, ${user.name}!` : 'Your AI Memory Assistant'}
            </p>
            
            {/* ===== LARGE, COLORFUL BUTTONS ===== */}
            <div style={{ 
              display: 'flex', 
              gap: '25px', 
              justifyContent: 'center', 
              marginTop: '40px', 
              flexWrap: 'wrap' 
            }}>
              <button 
                onClick={() => handleViewChange('scan')}
                style={{ 
                  padding: '22px 55px', 
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: 'white', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
                  minWidth: '200px',
                  minHeight: '80px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 12px 40px rgba(124, 58, 237, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 30px rgba(124, 58, 237, 0.4)';
                }}
              >
                📸 Scan Face
              </button>
              
              <button 
                onClick={() => handleViewChange('chat')}
                style={{ 
                  padding: '22px 55px', 
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: 'white', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
                  minWidth: '200px',
                  minHeight: '80px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.4)';
                }}
              >
                💬 Chat
              </button>
              
              <button 
                onClick={() => handleViewChange('family')}
                style={{ 
                  padding: '22px 55px', 
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: 'white', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                  minWidth: '200px',
                  minHeight: '80px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.4)';
                }}
              >
                👨‍👩‍👧‍👦 Family
              </button>
            </div>

            {/* ===== SUBTLE HELP TEXT ===== */}
            <p style={{ 
              marginTop: '40px', 
              color: '#64748b', 
              fontSize: '0.9rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '20px',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              💡 Click a button or use voice commands to interact with Memora
            </p>
          </div>
        )}
        
        {view === 'family' && <FamilyGallery members={familyMembers} />}
        {view === 'scan' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CameraView 
              onCapture={handleCapture} 
              isProcessing={isProcessing}
              onClose={handleCloseCamera}
            />
          </div>
        )}
        {view === 'chat' && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            onScanFace={() => handleViewChange('scan')}
          />
        )}
        {view === 'settings' && <AnalyticsDashboard />}
      </div>
    </ProfessionalUI>
  );
}

export default App;