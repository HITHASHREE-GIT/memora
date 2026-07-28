import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Camera, Volume2 } from 'lucide-react';

export default function ChatInterface({ messages, onSendMessage, onScanFace }) {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check if voice is supported
    useEffect(() => {
        const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        const hasSpeechSynthesis = 'speechSynthesis' in window;
        if (!hasSpeechRecognition || !hasSpeechSynthesis) {
            setIsVoiceSupported(false);
        }
    }, []);

    // ===== TEXT TO SPEECH (Memora Speaks) =====
    const speakText = (text) => {
        if (!('speechSynthesis' in window)) {
            console.log('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for elderly
        utterance.pitch = 1.1; // Slightly higher, warmer
        utterance.volume = 1;
        
        // Try to use a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK Female'));
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.onend = () => {
            setIsSpeaking(false);
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    // ===== SPEECH TO TEXT (Patient Speaks) =====
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setInput('🎤 Listening...');
        };

        recognition.onend = () => {
            setIsListening(false);
            if (input === '🎤 Listening...') {
                setInput('');
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                setInput('Please allow microphone access.');
            } else {
                setInput('Could not hear you. Please try again.');
            }
            setTimeout(() => setInput(''), 2000);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            
            // If final result, auto-send
            if (event.results[0].isFinal) {
                setIsListening(false);
                setTimeout(() => {
                    if (transcript.trim()) {
                        onSendMessage(transcript);
                        setInput('');
                    }
                }, 300);
            }
        };

        recognition.start();
    };

    const handleSend = () => {
        if (!input.trim()) return;
        // If user types and has a message, send it
        if (input !== '🎤 Listening...') {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chat-container">
            {/* Voice Status Indicator */}
            {isListening && (
                <div className="voice-indicator">
                    <span className="pulse-ring"></span>
                    <span className="voice-text">🎤 Listening... Speak now</span>
                </div>
            )}
            {isSpeaking && (
                <div className="voice-indicator speaking">
                    <span className="pulse-ring green"></span>
                    <span className="voice-text">🔊 Memora is speaking...</span>
                </div>
            )}

            {/* Messages Area */}
            <div className="messages-area">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>💬</div>
                        <h3>Start a conversation with Memora</h3>
                        <p style={{ color: '#94a3b8' }}>
                            {isVoiceSupported ? '🎤 Click the mic and speak, or type your message' : 'Type your message below'}
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div 
                            key={idx} 
                            className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
                        >
                            <div className="message-avatar">
                                {msg.role === 'user' ? '👤' : '🧠'}
                            </div>
                            <div className="message-content">
                                <p>{msg.text}</p>
                                {msg.role === 'bot' && (
                                    <button 
                                        onClick={() => speakText(msg.text)}
                                        className="speak-btn"
                                        title="Listen to this message"
                                    >
                                        🔊 Listen
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
                <button 
                    onClick={onScanFace}
                    className="action-btn"
                    title="Scan Face"
                >
                    <Camera size={20} />
                </button>
                
                {isVoiceSupported && (
                    <button 
                        onClick={startListening}
                        className={`action-btn mic-btn ${isListening ? 'listening' : ''}`}
                        title={isListening ? 'Stop listening' : 'Click and speak to Memora'}
                    >
                        {isListening ? <MicOff size={20} color="#ef4444" /> : <Mic size={20} />}
                    </button>
                )}
                
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? '🎤 Listening...' : (isVoiceSupported ? 'Speak or type your message...' : 'Type your message...')}
                    className="chat-input"
                    disabled={isListening}
                />
                <button 
                    onClick={handleSend}
                    className="send-btn"
                    disabled={!input.trim() || isListening}
                >
                    <Send size={20} />
                </button>
            </div>

            <style>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                    background: #0f172a;
                    position: relative;
                }
                
                /* Voice Indicator */
                .voice-indicator {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.85);
                    padding: 30px 40px;
                    border-radius: 20px;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    animation: fadeIn 0.3s ease-out;
                }
                .pulse-ring {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(124, 58, 237, 0.3);
                    border: 3px solid #7c3aed;
                    animation: pulse-ring 1.5s ease-out infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .pulse-ring.green {
                    border-color: #4ade80;
                    background: rgba(74, 222, 128, 0.2);
                }
                .voice-text {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                .voice-indicator.speaking .voice-text {
                    color: #4ade80;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }

                /* Messages */
                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .empty-state {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                }
                .message {
                    display: flex;
                    gap: 12px;
                    max-width: 80%;
                    animation: slideIn 0.3s ease-out;
                }
                .message.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }
                .message-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #1e293b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                .message.user .message-avatar {
                    background: #7c3aed;
                }
                .message-content {
                    background: #1e293b;
                    padding: 12px 16px;
                    border-radius: 12px;
                    border-top-left-radius: 4px;
                    position: relative;
                }
                .message.user .message-content {
                    background: #7c3aed;
                    border-top-left-radius: 12px;
                    border-top-right-radius: 4px;
                }
                .message-content p {
                    margin: 0;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .speak-btn {
                    margin-top: 6px;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: #94a3b8;
                    padding: 4px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.75rem;
                    transition: background 0.2s;
                }
                .speak-btn:hover {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Input */
                .input-area {
                    display: flex;
                    gap: 10px;
                    padding: 16px 20px;
                    background: #1e293b;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    align-items: center;
                }
                .action-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: background 0.2s, color 0.2s;
                }
                .action-btn:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .mic-btn.listening {
                    background: rgba(239, 68, 68, 0.2);
                    border-radius: 50%;
                    animation: pulse 1s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .chat-input {
                    flex: 1;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 10px 16px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .chat-input:focus {
                    border-color: #7c3aed;
                }
                .chat-input::placeholder {
                    color: #64748b;
                }
                .chat-input:disabled {
                    opacity: 0.6;
                }
                .send-btn {
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none;
                    border-radius: 12px;
                    padding: 10px 16px;
                    color: white;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                }
                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .messages-area::-webkit-scrollbar {
                    width: 4px;
                }
                .messages-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .messages-area::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
}