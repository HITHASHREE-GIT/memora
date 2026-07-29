import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ProfessionalUI from './components/ProfessionalUI';
import MemoryScore from './components/MemoryScore';
import CameraView from './components/CameraView';
import ChatInterface from './components/ChatInterface';
import FamilyGallery from './pages/FamilyGallery';
import PhotoUpload from './components/PhotoUpload';
import AvatarCanvas from './components/AvatarCanvas';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
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
  const [showEnrollOption, setShowEnrollOption] = useState(false);
  const [lastCapturedBlob, setLastCapturedBlob] = useState(null);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [lastEmotionEmoji, setLastEmotionEmoji] = useState('😐');
  const [familyMembers, setFamilyMembers] = useState([]); // ✅ EMPTY - No sample data!

  // ===== AUTO-LOGIN ON PAGE LOAD =====
  useEffect(() => {
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

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
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

  // ===== HANDLE LOGIN =====
  const handleLogin = (userData) => {
    console.log('🔐 User logged in/registered:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('memora_user', JSON.stringify(userData));
    
    const welcomeMsg = `Welcome, ${userData.name}!`;
    setMessage(welcomeMsg);
    setTimeout(() => speakText(welcomeMsg), 500);
  };

  // ===== HANDLE LOGOUT =====
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setMessages([]);
    setView('home');
    setLastEmotion(null);
    setLastEmotionEmoji('😐');
    window.speechSynthesis.cancel();
    localStorage.removeItem('memora_user');
    console.log('🔓 User logged out');
  };

  // Handle view changes
  const handleViewChange = (newView) => {
    setView(newView);
    setShowEnrollOption(false);
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

  // ===== FACE RECOGNITION =====
  const handleCapture = async (blob) => {
    setIsProcessing(true);
    setMessage('🔄 Processing face with AI...');
    setLastCapturedBlob(blob);
    setShowEnrollOption(false);

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
        
        if (person.emotion) {
          setLastEmotion(person.emotion);
          setLastEmotionEmoji(person.emotion_emoji || '😐');
        }
        
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
        speakText(announcement);
        setIsProcessing(false);
        setShowCamera(false);
        
      } else {
        if (response.data.emotion) {
          setLastEmotion(response.data.emotion);
          setLastEmotionEmoji(response.data.emotion_emoji || '😐');
        }
        
        setMessage('❌ Face not recognized. Would you like to remember this person?');
        setShowEnrollOption(true);
        setIsProcessing(false);
        speakText('I don\'t know who this is. Would you like to remember them?');
      }
      
    } catch (error) {
      console.error('❌ Recognition error:', error);
      setMessage('❌ Error processing face. Would you like to remember this person?');
      setShowEnrollOption(true);
      setIsProcessing(false);
    }
  };

  // ===== ENROLL FROM SCAN =====
  const handleEnrollFromScan = async () => {
    if (!lastCapturedBlob) {
      setMessage('❌ No photo to enroll. Please take a photo first.');
      return;
    }

    const name = prompt("Who is this person? Enter their name:");
    if (!name) {
      setShowEnrollOption(false);
      return;
    }
    
    const relation = prompt("How are they related to you? (Friend, Family, Doctor, etc.):") || "Friend";
    const notes = prompt("Any notes about them? (Optional):") || `Met ${name} today. They are my ${relation}.`;
    
    setIsProcessing(true);
    setMessage(`🔄 Remembering ${name}...`);
    setShowEnrollOption(false);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('relation', relation);
    formData.append('notes', notes);
    formData.append('file', lastCapturedBlob);
    
    try {
      const response = await axios.post(`${API_BASE}/remember/person`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.status === 'stored') {
        const announcement = `I've remembered ${name}! They are your ${relation}.`;
        setMessage(`✅ Remembered ${name}!`);
        
        const newMember = {
          id: Date.now(),
          name: name,
          relation: relation,
          lastSeen: 'Just now',
          emoji: '👤',
          photo: URL.createObjectURL(lastCapturedBlob)
        };
        setFamilyMembers(prev => [...prev, newMember]);
        
        speakText(announcement);
        setIsProcessing(false);
        setShowCamera(false);
        setLastCapturedBlob(null);
      } else {
        setMessage('❌ Failed to remember. Please try again.');
        setIsProcessing(false);
        setShowEnrollOption(true);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setMessage('❌ Failed to remember. Please try again.');
      setIsProcessing(false);
      setShowEnrollOption(true);
    }
  };

  // ===== CHAT =====
  const handleSendMessage = async (text) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setMessage('🤔 Thinking...');
    
    try {
      const response = await axios.post(`${API_BASE}/chat/query`, { text });
      console.log('✅ Chat response:', response.data);
      
      const botText = response.data.text || "I'm not sure how to respond to that.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
      setMessage(botText);
      speakText(botText);
      
    } catch (error) {
      console.error('❌ Chat error:', error);
      
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
    setShowEnrollOption(false);
    setLastCapturedBlob(null);
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
        {/* HOME SCREEN - ORIGINAL DARK THEME */}
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

            {/* ===== EMOTION DISPLAY ===== */}
            {lastEmotion ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '30px',
                marginTop: '15px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <span style={{ fontSize: '2rem' }}>{lastEmotionEmoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Current Mood
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                    {lastEmotion.charAt(0).toUpperCase() + lastEmotion.slice(1)}
                  </div>
                </div>
                <button 
                  onClick={() => handleViewChange('scan')}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.7rem'
                  }}
                >
                  Update
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleViewChange('scan')}
                style={{
                  marginTop: '15px',
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                📸 Scan to Detect Mood
              </button>
            )}
            
            <div style={{ 
              display: 'flex', 
              gap: '25px', 
              justifyContent: 'center', 
              marginTop: '30px', 
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
              
              <button 
                onClick={() => setView('photoupload')}
                style={{ 
                  padding: '22px 55px', 
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f472b6, #ec4899)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: 'white', 
                  cursor: 'pointer',
                  minWidth: '200px',
                  minHeight: '80px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 12px 40px rgba(244, 114, 182, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 30px rgba(244, 114, 182, 0.4)';
                }}
              >
                📸 Photo Upload
              </button>
            </div>

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

            <div style={{ marginTop: '30px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              <MemoryScore />
            </div>
          </div>
        )}
        
        {/* FAMILY GALLERY - Now Empty until you add people */}
        {view === 'family' && <FamilyGallery members={familyMembers} />}
        
        {/* SCAN FACE */}
        {view === 'scan' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CameraView 
              onCapture={handleCapture} 
              isProcessing={isProcessing}
              onClose={handleCloseCamera}
            />
            
            {showEnrollOption && (
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: '#1e293b',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                maxWidth: '400px',
                width: '100%'
              }}>
                <p style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: '10px' }}>
                  🤔 I don't know who this is!
                </p>
                <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                  Would you like to remember this person?
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={handleEnrollFromScan}
                    style={{
                      padding: '10px 25px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    ✅ Yes, Remember Them
                  </button>
                  <button 
                    onClick={() => {
                      setShowEnrollOption(false);
                      setLastCapturedBlob(null);
                      setMessage('Okay, maybe next time.');
                      speakText('Okay, maybe next time.');
                    }}
                    style={{
                      padding: '10px 25px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    ❌ No, Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* CHAT */}
        {view === 'chat' && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            onScanFace={() => handleViewChange('scan')}
          />
        )}
        
        {/* SETTINGS / ANALYTICS */}
        {view === 'settings' && <AnalyticsDashboard />}
        
        {/* CAREGIVER DASHBOARD */}
        {view === 'caregiver' && <CaregiverDashboard />}
        
        {/* PHOTO UPLOAD */}
        {view === 'photoupload' && <PhotoUpload familyMembers={familyMembers} />}
      </div>
    </ProfessionalUI>
  );
}

export default App;