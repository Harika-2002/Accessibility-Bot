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
import useKeyboardShortcuts from './useKeyboardShortcuts'; // Import the keyboard shortcuts hook
import './style.css';  
import botImage from './assets/bot.jpeg';
import KeyboardShortcuts from './KeyboardShortcuts';

function App() {
    const [isNightMode, setIsNightMode] = useState(false);
    const navigate = useNavigate();  // Navigate to handle redirects
    const location = useLocation();

    // Only redirect to signup if not logged in and on a protected route (like /dashboard)
useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const publicRoutes = ['/signup', '/login'];
    
    if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
        navigate('/signup');
    }
}, [navigate, location.pathname]);
    

    const toggleNightMode = () => {
        setIsNightMode(prevMode => !prevMode);
    };

     // Apply keyboard shortcuts and pass toggleNightMode function
     useKeyboardShortcuts(toggleNightMode);

    return (
        <div className={`app-container ${isNightMode ? 'night-mode' : 'bright-mode'}`}>
            {/* Conditionally show the logo only if NOT on the /dashboard route */}
            {location.pathname !== '/dashboard' && (
                <img src={botImage} alt="Bot Logo" className="global-logo" />
            )}
            
            {/* Conditionally render the toggle button only if NOT on the /dashboard route */}
            {location.pathname !== '/dashboard' && (
                <button onClick={toggleNightMode} className="mode-switch">
                    {isNightMode ? 'Switch to Bright Mode' : 'Switch to Night Mode'}
                </button>
            )}

            <Routes>
                {/* Redirect from root to signup */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<SignUpForm isNightMode={isNightMode} />} />
                <Route path="/login" element={<LoginForm isNightMode={isNightMode} />} />
                
                {/* Dashboard with Sidebar (Home view) */}
                <Route path="/dashboard" element={<Dashboard showSidebar={true} isNightMode={isNightMode} />} />
                
                {/* Help Page */}
                <Route path="/help" element={<Help />} />
                
                {/* Speech To Text Page */}
                <Route path="/speech-to-text" element={<SpeechToText />} />  
                
                {/* Text to Speech Page */}
                <Route path="/text-to-speech" element={<TextToSpeech />} />  

                {/* Image to Text Page */}
                <Route path="/image-to-text" element={<ImageToText />} />
                
                {/* Summarize the Text */}
                <Route path="/SummarizetheText" element={<SummarizetheText />} />

                {/* Paraphrase the Text */}
                <Route path="/paraphrase" element={<ParaphraseOrSimpleText />} />

                {/* Keyboard Shortcuts */}
                <Route path="/keyboardshortcuts" element={<KeyboardShortcuts />} />
                
                {/* Account Pages */}
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
