import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';

export default function CameraView({ onCapture, isProcessing, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    // Start camera when component mounts
    useEffect(() => {
        console.log('📸 CameraView mounted - starting camera...');
        startCamera();
        
        // Cleanup when component unmounts
        return () => {
            console.log('📸 CameraView unmounting - stopping camera...');
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            console.log('🔄 Requesting camera access...');
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });
            
            console.log('✅ Camera stream obtained!');
            setStream(mediaStream);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    console.log('✅ Video metadata loaded');
                    setIsCameraReady(true);
                    videoRef.current.play();
                };
                setError(null);
            }
        } catch (err) {
            console.error('❌ Camera error:', err);
            let errorMsg = 'Camera access denied. ';
            if (err.name === 'NotAllowedError') {
                errorMsg += 'Please allow camera access in your browser.';
            } else if (err.name === 'NotFoundError') {
                errorMsg += 'No camera found on your device.';
            } else if (err.name === 'NotReadableError') {
                errorMsg += 'Camera is in use by another application.';
            } else {
                errorMsg += err.message;
            }
            setError(errorMsg);
        }
    };

    const stopCamera = () => {
        console.log('🛑 Stopping camera...');
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
                console.log('✅ Track stopped:', track.kind);
            });
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraReady(false);
        console.log('✅ Camera stopped completely');
    };

    const handleClose = () => {
        console.log('❌ Close button clicked - stopping camera');
        stopCamera();
        if (onClose) {
            onClose();
        }
    };

    const capture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        if (!isCameraReady) {
            console.warn('Camera not ready yet');
            return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            if (blob) {
                onCapture(blob);
            } else {
                console.error("Failed to create blob from canvas");
            }
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="camera-container">
            {error ? (
                <div className="error-box">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📸</div>
                    <h3>Camera Access Denied</h3>
                    <p>{error}</p>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '10px' }}>
                        💡 Click the camera icon in the address bar and select "Allow"
                    </p>
                    <button 
                        onClick={() => { setError(null); startCamera(); }}
                        style={{ 
                            marginTop: '15px', 
                            padding: '10px 25px', 
                            background: '#7c3aed', 
                            border: 'none', 
                            borderRadius: '8px', 
                            color: 'white', 
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        🔄 Try Again
                    </button>
                </div>
            ) : (
                <>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="video-feed" 
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    
                    {!isCameraReady && (
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <p>Loading camera...</p>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleClose}
                        className="close-btn"
                        title="Close Camera"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="controls">
                        <button 
                            onClick={capture} 
                            disabled={isProcessing || !isCameraReady} 
                            className="capture-btn"
                        >
                            {isProcessing ? <RefreshCw className="spin" /> : <Camera size={32} />}
                        </button>
                    </div>
                </>
            )}
            <style>{`
                .camera-container {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #000;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
                .video-feed {
                    width: 100%;
                    display: block;
                    aspect-ratio: 4/3;
                    object-fit: cover;
                    background: #1a1a2e;
                }
                .close-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: rgba(239, 68, 68, 0.85);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    transition: all 0.2s;
                }
                .close-btn:hover {
                    background: rgba(239, 68, 68, 1);
                    transform: scale(1.1);
                }
                .controls {
                    position: absolute;
                    bottom: 30px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                }
                .capture-btn {
                    background: white;
                    border: 4px solid rgba(255,255,255,0.3);
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s;
                    color: #1e293b;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                }
                .capture-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                }
                .capture-btn:active:not(:disabled) {
                    transform: scale(0.95);
                }
                .capture-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
                .error-box {
                    padding: 40px 20px;
                    color: #f87171;
                    text-align: center;
                    background: #1e293b;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .error-box h3 {
                    margin: 10px 0;
                }
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    z-index: 5;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.1);
                    border-top-color: #7c3aed;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
}