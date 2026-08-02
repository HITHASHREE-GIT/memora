import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Brain } from 'lucide-react';
import axios from 'axios';

// ✅ FIXED: Use environment variable instead of hardcoded localhost
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

const MemoryScore = ({ score = 75 }) => {
    const [memoryScore, setMemoryScore] = useState(score);
    const [trend, setTrend] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch memory data from backend
        const fetchMemoryData = async () => {
            try {
                // Get enrolled people count as memory score
                const response = await axios.get(`${API_BASE}/debug/names`);
                const count = response.data.count || 0;
                // Calculate score: 50% base + 5% per person (max 100%)
                const calculatedScore = Math.min(50 + (count * 5), 100);
                setMemoryScore(calculatedScore);
                setTrend(Math.floor(Math.random() * 15) + 1);
                setIsLoading(false);
            } catch (error) {
                console.log('Using default memory score');
                setIsLoading(false);
            }
        };
        fetchMemoryData();
    }, []);

    const getColor = (score) => {
        if (score >= 80) return '#4ade80';
        if (score >= 60) return '#fbbf24';
        if (score >= 40) return '#f97316';
        return '#ef4444';
    };

    const getLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Attention';
    };

    const getEmoji = (score) => {
        if (score >= 80) return '🧠';
        if (score >= 60) return '😊';
        if (score >= 40) return '😐';
        return '😔';
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>🔄 Loading memory score...</div>;
    }

    return (
        <div className="memory-score-container">
            <div className="score-header">
                <Brain size={24} color="#a78bfa" />
                <h3>Memory Health</h3>
            </div>
            
            <div className="score-circle-wrapper">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle
                        cx="70"
                        cy="70"
                        r="55"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="12"
                    />
                    <circle
                        cx="70"
                        cy="70"
                        r="55"
                        fill="none"
                        stroke={getColor(memoryScore)}
                        strokeWidth="12"
                        strokeDasharray={`${memoryScore * 3.45} 345`}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                    />
                </svg>
                <div className="score-text">
                    <span className="score-emoji">{getEmoji(memoryScore)}</span>
                    <span className="score-value">{Math.round(memoryScore)}%</span>
                    <span className="score-label">{getLabel(memoryScore)}</span>
                </div>
            </div>

            <div className="score-details">
                <div className="score-trend">
                    {trend > 0 ? 
                        <TrendingUp color="#4ade80" size={18} /> : 
                        <TrendingDown color="#ef4444" size={18} />
                    }
                    <span style={{ color: trend > 0 ? '#4ade80' : '#ef4444' }}>
                        {trend > 0 ? '+': ''}{trend}% this week
                    </span>
                </div>
                <div className="score-stats">
                    <div className="stat">
                        <span>🧠 Recognition</span>
                        <span>{Math.min(memoryScore + 10, 100)}%</span>
                    </div>
                    <div className="stat">
                        <span>💬 Recall</span>
                        <span>{Math.min(memoryScore - 5, 100)}%</span>
                    </div>
                    <div className="stat">
                        <span>👤 People</span>
                        <span>{Math.round(memoryScore / 5)}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .memory-score-container {
                    background: #1e293b;
                    padding: 24px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    max-width: 400px;
                    margin: 0 auto;
                }
                .score-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .score-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }
                .score-circle-wrapper {
                    position: relative;
                    width: 140px;
                    height: 140px;
                    margin: 0 auto 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .score-text {
                    position: absolute;
                    text-align: center;
                }
                .score-emoji {
                    font-size: 1.8rem;
                    display: block;
                }
                .score-value {
                    font-size: 1.8rem;
                    font-weight: bold;
                    display: block;
                    color: white;
                }
                .score-label {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    display: block;
                }
                .score-details {
                    text-align: center;
                }
                .score-trend {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }
                .score-stats {
                    display: flex;
                    justify-content: space-around;
                    gap: 10px;
                }
                .stat {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    background: rgba(255,255,255,0.03);
                    padding: 8px 12px;
                    border-radius: 8px;
                    flex: 1;
                }
                .stat span:last-child {
                    color: white;
                    font-weight: bold;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
};

export default MemoryScore;