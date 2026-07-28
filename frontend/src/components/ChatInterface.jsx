import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Camera } from 'lucide-react';

export default function ChatInterface({ messages, onSendMessage, onScanFace }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chat-container">
            {/* Messages Area */}
            <div className="messages-area">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>💬</div>
                        <h3>No messages yet</h3>
                        <p style={{ color: '#94a3b8' }}>Start a conversation with Memora</p>
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
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button 
                    onClick={handleSend}
                    className="send-btn"
                    disabled={!input.trim()}
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
                }
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
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                /* Scrollbar styling */
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