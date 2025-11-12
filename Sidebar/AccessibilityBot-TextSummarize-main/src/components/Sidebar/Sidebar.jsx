import React, { useContext } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets'; // Assuming assets has the bot image or logo
import { Context } from '../../context/Context';
import logo from '../Sidebar/bot.jpeg'

const Sidebar = () => {
    const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

    // Function to handle prompts loading
    const loadPrompt = async (prompt) => {
        await onSent(prompt);
        setRecentPrompt(prompt);
    };

    return (
        <div className="sidebar">
            {/* Bot Image/Logo at the Top */}
            <div className="sidebar-logo">
                <img src={logo} alt="Bot Logo" className="bot-logo" />
            </div>

            {/* Sidebar Menu Items }
            <div className="sidebar-item" onClick={() => loadPrompt('Text to Speech')}>
                <p>Text to Speech</p>
            </div>
            <div className="sidebar-item" onClick={() => loadPrompt('Speech to Text')}>
                <p>Speech to Text</p>
            </div>
            <div className="sidebar-item" onClick={() => loadPrompt('Image to Text')}>
                <p>Image to Text</p>
            </div>
            <div className="sidebar-item" onClick={() => loadPrompt('Text Summarization')}>
                <p>Text Summarization</p>
            </div>
            <div className="sidebar-item" onClick={() => loadPrompt('Multi Language')}>
                <p>Multi Language</p>
            </div>
            <div className="sidebar-item" onClick={() => loadPrompt('Paraphrasing')}>
                <p>Paraphrasing</p>
            </div>
            <div className="sidebar-item" onClick={() => loadPrompt('Interactive Dictionary')}>
                <p>Interactive Dictionary</p>
            </div>*/}
        </div>
    );
};

export default Sidebar;
