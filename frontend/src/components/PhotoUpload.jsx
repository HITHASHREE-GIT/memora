import React, { useState } from 'react';
import { Upload, Image, X, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const PhotoUpload = ({ onUploadComplete, familyMembers }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [showUpload, setShowUpload] = useState(true);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setShowUpload(false);
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE}/recognize/person`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = response.data;
            
            if (data.status === 'identified') {
                setResult({
                    status: 'identified',
                    person: data.person,
                    emotion: data.emotion || 'neutral',
                    emotion_emoji: data.emotion_emoji || '😐'
                });
                if (onUploadComplete) onUploadComplete(data.person);
            } else {
                setResult({
                    status: 'unknown',
                    emotion: data.emotion || 'neutral',
                    emotion_emoji: data.emotion_emoji || '😐'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setResult({ status: 'error', message: 'Failed to process photo' });
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setShowUpload(true);
        if (file) URL.revokeObjectURL(preview);
    };

    return (
        <div className="photo-upload-container">
            <div className="photo-upload-header">
                <Image size={24} color="#a78bfa" />
                <h3>📸 Photo Memory Upload</h3>
                <p>Upload old photos and let AI recognize people</p>
            </div>

            {showUpload ? (
                <div className="upload-area" onClick={() => document.getElementById('photo-input').click()}>
                    <Upload size={48} color="#64748b" />
                    <p>Click to upload a photo</p>
                    <span>Supported: JPG, PNG, JPEG</span>
                    <input
                        id="photo-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div className="preview-area">
                    {preview && (
                        <div className="preview-image-wrapper">
                            <img src={preview} alt="Preview" className="preview-image" />
                            <button onClick={handleReset} className="remove-btn">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    
                    <div className="upload-actions">
                        <button 
                            onClick={handleUpload} 
                            disabled={uploading}
                            className="upload-btn"
                        >
                            {uploading ? '🔍 Analyzing...' : '🔍 Analyze Photo'}
                        </button>
                        <button onClick={handleReset} className="reset-btn">
                            Cancel
                        </button>
                    </div>

                    {result && (
                        <div className={`result-box ${result.status}`}>
                            {result.status === 'identified' ? (
                                <>
                                    <Check size={20} color="#4ade80" />
                                    <div>
                                        <strong>{result.person.name}</strong>
                                        <span>{result.person.relation || 'Friend'}</span>
                                        <span className="emotion-badge">
                                            {result.emotion_emoji} {result.emotion}
                                        </span>
                                    </div>
                                </>
                            ) : result.status === 'unknown' ? (
                                <>
                                    <span style={{ fontSize: '2rem' }}>🤔</span>
                                    <div>
                                        <p>No one recognized in this photo</p>
                                        <span className="emotion-badge">
                                            {result.emotion_emoji} {result.emotion}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p style={{ color: '#ef4444' }}>❌ {result.message || 'Error processing photo'}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .photo-upload-container {
                    background: #1e293b;
                    padding: 24px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    max-width: 450px;
                    margin: 0 auto;
                }
                .photo-upload-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .photo-upload-header h3 {
                    margin: 8px 0 4px;
                }
                .photo-upload-header p {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin: 0;
                }
                .upload-area {
                    border: 2px dashed #475569;
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .upload-area:hover {
                    border-color: #7c3aed;
                    background: rgba(124, 58, 237, 0.05);
                }
                .upload-area p {
                    margin: 10px 0 5px;
                    color: #94a3b8;
                }
                .upload-area span {
                    color: #64748b;
                    font-size: 0.8rem;
                }
                .preview-area {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .preview-image-wrapper {
                    position: relative;
                    display: inline-block;
                    margin: 0 auto;
                }
                .preview-image {
                    max-width: 100%;
                    max-height: 250px;
                    border-radius: 8px;
                    object-fit: contain;
                    background: #0f172a;
                }
                .remove-btn {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: #ef4444;
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: white;
                }
                .upload-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }
                .upload-btn {
                    padding: 10px 30px;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .upload-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                }
                .upload-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .reset-btn {
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: #94a3b8;
                    cursor: pointer;
                }
                .result-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.03);
                }
                .result-box.identified {
                    border-left: 3px solid #4ade80;
                }
                .result-box.unknown {
                    border-left: 3px solid #fbbf24;
                }
                .result-box strong {
                    display: block;
                    color: white;
                }
                .result-box span {
                    display: block;
                    font-size: 0.85rem;
                    color: #94a3b8;
                }
                .emotion-badge {
                    display: inline-block;
                    padding: 2px 10px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin-top: 4px;
                }
            `}</style>
        </div>
    );
};

export default PhotoUpload;