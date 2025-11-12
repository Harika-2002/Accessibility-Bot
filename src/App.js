import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';  
import Help from './Help';  
import ViewAccountInfo from './ViewAccountInfo'; 
import ChangePassword from './ChangePassword'; 
import DeleteAccount from './DeleteAccount'; 
import TextToSpeech from './TextToSpeech';  
import SpeechToText from './SpeechToText';  
import ImageToText from './ImageToText';
import SummarizetheText from './SummarizetheText';
import ParaphraseOrSimpleText from './ParaphraseOrSimpleText';
import useKeyboardShortcuts from './useKeyboardShortcuts';
import './style.css';  
import botImage from './assets/bot.jpeg';
import KeyboardShortcuts from './KeyboardShortcuts';

function App() {
    const [isNightMode, setIsNightMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const publicRoutes = ['/signup', '/login'];
        
        if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
            navigate('/signup');
        }
    }, [navigate, location.pathname]);
    
    const toggleNightMode = () => setIsNightMode(prev => !prev);
    useKeyboardShortcuts(toggleNightMode);

    // Inline styles for color-blind-friendly button
    const baseButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        outline: '3px solid transparent',
    };

    const brightModeStyle = {
        ...baseButtonStyle,
        backgroundColor: isHovered ? '#00347a' : '#0047ab', // vivid blue
        color: '#ffffff',
    };

    const nightModeStyle = {
        ...baseButtonStyle,
        backgroundColor: isHovered ? '#e6c200' : '#ffd400', // strong yellow
        color: '#000000',
    };

    const focusOutline = {
        outline: '3px solid #ff6600',
    };

    return (
        <div className={`app-container ${isNightMode ? 'night-mode' : 'bright-mode'}`}>
            {location.pathname !== '/dashboard' && (
                <header className="topbar">
                    <div className="topbar-left">
                        <img src={botImage} alt="Bot Logo" className="global-logo" />
                    </div>
                    <div className="topbar-right">
                        <button
                            onClick={toggleNightMode}
                            aria-label={isNightMode ? 'Switch to light mode' : 'Switch to night mode'}
                            style={{
                                ...(isNightMode ? nightModeStyle : brightModeStyle),
                                ...(isHovered ? {} : {}),
                                ...(focusOutline),
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isNightMode ? (
                                <>
                                    ☀️ <span>Switch to Light Mode</span>
                                </>
                            ) : (
                                <>
                                    🌙 <span>Switch to Night Mode</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>
            )}

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<SignUpForm isNightMode={isNightMode} />} />
                <Route path="/login" element={<LoginForm isNightMode={isNightMode} />} />
                <Route path="/dashboard" element={<Dashboard showSidebar={true} isNightMode={isNightMode} />} />
                <Route path="/help" element={<Help />} />
                <Route path="/speech-to-text" element={<SpeechToText />} />  
                <Route path="/text-to-speech" element={<TextToSpeech />} />  
                <Route path="/image-to-text" element={<ImageToText />} />
                <Route path="/SummarizetheText" element={<SummarizetheText />} />
                <Route path="/paraphrase" element={<ParaphraseOrSimpleText />} />
                <Route path="/keyboardshortcuts" element={<KeyboardShortcuts />} />
                <Route path="/view-account" element={<ViewAccountInfo isNightMode={isNightMode} />} />
                <Route path="/change-password" element={<ChangePassword isNightMode={isNightMode} />} />
                <Route path="/delete-account" element={<DeleteAccount isNightMode={isNightMode} />} />
            </Routes>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}