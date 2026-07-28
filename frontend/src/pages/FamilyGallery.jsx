import React from 'react';
import { Calendar, User, Heart } from 'lucide-react';

const FamilyGallery = ({ members }) => {
    // Default sample data
    const defaultMembers = [
        { id: 1, name: 'Amitabh Bachchan', relation: 'Close Friend', lastSeen: 'Today', emoji: '🎭' },
        { id: 2, name: 'Aamir Khan', relation: 'Family', lastSeen: 'Yesterday', emoji: '🎬' },
        { id: 3, name: 'Deepika Padukone', relation: 'Friend', lastSeen: '3 days ago', emoji: '✨' },
        { id: 4, name: 'Shah Rukh Khan', relation: 'Favorite Actor', lastSeen: '1 week ago', emoji: '⭐' },
        { id: 5, name: 'Priyanka Chopra', relation: 'Friend', lastSeen: '2 weeks ago', emoji: '🌟' },
        { id: 6, name: 'Hrithik Roshan', relation: 'Friend', lastSeen: '1 month ago', emoji: '💫' },
    ];

    const data = members || defaultMembers;

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h2>👨‍👩‍👧‍👦 My Family & Friends</h2>
                <p>People who care about you</p>
            </div>
            <div className="gallery-grid">
                {data.map((member) => (
                    <div key={member.id} className="family-card">
                        <div className="card-emoji">{member.emoji}</div>
                        <div className="card-info">
                            <h3>{member.name}</h3>
                            <p>{member.relation}</p>
                            <span className="last-seen">
                                <Calendar size={14} /> {member.lastSeen}
                            </span>
                        </div>
                        <button className="card-btn">
                            <Heart size={16} /> Remember
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                .gallery-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    height: 100%;
                    overflow-y: auto;
                }
                .gallery-header {
                    margin-bottom: 30px;
                }
                .gallery-header h2 {
                    font-size: 2rem;
                    margin-bottom: 5px;
                    color: white;
                }
                .gallery-header p {
                    color: #94a3b8;
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 20px;
                }
                .family-card {
                    background: #1e293b;
                    border-radius: 16px;
                    padding: 24px;
                    text-align: center;
                    transition: transform 0.3s, box-shadow 0.3s;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .family-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    border-color: rgba(124, 58, 237, 0.3);
                }
                .card-emoji {
                    font-size: 3.5rem;
                    margin-bottom: 10px;
                }
                .card-info h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: white;
                }
                .card-info p {
                    color: #94a3b8;
                    margin: 5px 0;
                    font-size: 0.9rem;
                }
                .last-seen {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #64748b;
                    font-size: 0.8rem;
                    justify-content: center;
                    margin-top: 5px;
                }
                .card-btn {
                    margin-top: 15px;
                    padding: 8px 20px;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                }
                .card-btn:hover {
                    transform: scale(1.05);
                }
                .gallery-container::-webkit-scrollbar {
                    width: 4px;
                }
                .gallery-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .gallery-container::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
};

export default FamilyGallery;