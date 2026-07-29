import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Save } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

const CaregiverDashboard = () => {
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('Friend');
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !file) {
            setMessage('Please fill in name and upload a photo');
            return;
        }

        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('relation', relation);
        formData.append('notes', notes);
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE}/remember/person`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'stored') {
                setSuccess(true);
                setMessage(`✅ Successfully enrolled ${name}!`);
                setName('');
                setRelation('Friend');
                setNotes('');
                setFile(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setMessage('❌ Failed to enroll. Please try again.');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            setMessage('❌ Error enrolling person. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="caregiver-container">
            <div className="caregiver-header">
                <h1>👨‍👩‍👧‍👦 Caregiver Dashboard</h1>
                <p>Enroll family members, friends, and caregivers</p>
            </div>

            <div className="enrollment-card">
                <h2>📝 Enroll New Person</h2>
                
                {message && (
                    <div className={`message ${success ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="enroll-form">
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Relation</label>
                        <select value={relation} onChange={(e) => setRelation(e.target.value)}>
                            <option>Family</option>
                            <option>Friend</option>
                            <option>Caregiver</option>
                            <option>Doctor</option>
                            <option>Acquaintance</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Notes / Memory</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g., Lives in Mumbai, loves coffee..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Photo *</label>
                        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                            {preview ? (
                                <img src={preview} alt="Preview" className="preview-image" />
                            ) : (
                                <div className="upload-placeholder">
                                    <Camera size={48} />
                                    <p>Click to upload a face photo</p>
                                    <span>Clear, front-facing photo works best</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="enroll-btn">
                        {loading ? 'Enrolling...' : <><Save size={20} /> Enroll Person</>}
                    </button>
                </form>
            </div>

            <style>{`
                .caregiver-container {
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .caregiver-header {
                    margin-bottom: 30px;
                }
                .caregiver-header h1 {
                    font-size: 2rem;
                    margin: 0;
                }
                .caregiver-header p {
                    color: #94a3b8;
                    margin: 5px 0 0;
                }
                .enrollment-card {
                    background: #1e293b;
                    padding: 30px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .enrollment-card h2 {
                    margin: 0 0 20px;
                }
                .message {
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .message.success {
                    background: rgba(34, 197, 94, 0.2);
                    color: #4ade80;
                }
                .message.error {
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }
                .enroll-form {
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
                    font-size: 0.9rem;
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
                }
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    border-color: #7c3aed;
                }
                .upload-area {
                    border: 2px dashed #475569;
                    border-radius: 12px;
                    padding: 30px;
                    text-align: center;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .upload-area:hover {
                    border-color: #7c3aed;
                    background: rgba(124, 58, 237, 0.05);
                }
                .preview-image {
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 8px;
                }
                .upload-placeholder p {
                    margin: 10px 0 5px;
                }
                .upload-placeholder span {
                    color: #64748b;
                    font-size: 0.85rem;
                }
                .enroll-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                }
                .enroll-btn:hover:not(:disabled) {
                    transform: scale(1.02);
                }
                .enroll-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default CaregiverDashboard;