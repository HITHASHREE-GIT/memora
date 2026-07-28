import React, { useState } from 'react';
import { UserPlus, PackagePlus, Save, X } from 'lucide-react';

export default function EnrollmentForm({ type, onCancel, onSave }) {
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('Friend');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onSave({ name, relation, notes, type });
        setIsSubmitting(false);
    };

    return (
        <div className="enrollment-form">
            <div className="form-header">
                <div className="form-title">
                    {type === 'person' ? (
                        <UserPlus size={24} color="#a78bfa" />
                    ) : (
                        <PackagePlus size={24} color="#f59e0b" />
                    )}
                    <h2>Enroll {type === 'person' ? 'Person' : 'Object'}</h2>
                </div>
                <button onClick={onCancel} className="close-btn">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
                <div className="form-group">
                    <label>Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={type === 'person' ? "e.g., John Doe" : "e.g., Wallet"}
                        required
                    />
                </div>

                {type === 'person' && (
                    <div className="form-group">
                        <label>Relation</label>
                        <select value={relation} onChange={(e) => setRelation(e.target.value)}>
                            <option>Friend</option>
                            <option>Family</option>
                            <option>Doctor</option>
                            <option>Caregiver</option>
                            <option>Colleague</option>
                            <option>Other</option>
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Notes / Memory</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={type === 'person' 
                            ? "e.g., Lives in New York, loves coffee..." 
                            : "e.g., Usually kept on the kitchen counter..."}
                        rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-save">
                        {isSubmitting ? 'Saving...' : (
                            <>
                                <Save size={18} /> Save
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style>{`
                .enrollment-form {
                    background: #1e293b;
                    border-radius: 16px;
                    padding: 24px;
                    max-width: 400px;
                    margin: 20px auto;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                }
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .form-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .form-title h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .close-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.2s, color 0.2s;
                }
                .close-btn:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .form-body {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .form-group label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #94a3b8;
                }
                .form-group input,
                .form-group select,
                .form-group textarea {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    padding: 10px 14px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    border-color: #7c3aed;
                }
                .form-group textarea {
                    resize: vertical;
                    font-family: inherit;
                }
                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .btn-cancel {
                    flex: 1;
                    padding: 10px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: #94a3b8;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                .btn-cancel:hover {
                    background: rgba(255,255,255,0.1);
                }
                .btn-save {
                    flex: 2;
                    padding: 10px;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform 0.2s, opacity 0.2s;
                }
                .btn-save:hover:not(:disabled) {
                    transform: scale(1.02);
                }
                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}