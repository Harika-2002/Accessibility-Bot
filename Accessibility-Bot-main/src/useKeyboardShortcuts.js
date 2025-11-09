import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useKeyboardShortcuts = (toggleNightMode) => {
  const navigate = useNavigate();

  useEffect(() => {
    // helper: don't trigger shortcuts while typing/editing
    const isEditingField = (el) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      return el.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
    };

    const handleKeyPress = (event) => {
      const { ctrlKey, altKey, key } = event;

      // --- ISSUE #26: Alt + Left Arrow => go back (global)
      if (!isEditingField(event.target) && altKey && (key === 'ArrowLeft' || event.code === 'ArrowLeft')) {
        event.preventDefault();
        try {
          navigate(-1);        // use SPA history when available
        } catch {
          window.history.back(); // fallback
        }
        return;
      }

      // External website shortcuts
      if (ctrlKey && key === 'g') {
        window.open('https://www.google.com', '_blank'); // Opens Google
      } else if (ctrlKey && key === 't') {
        window.open('https://www.twitter.com', '_blank'); // Opens Twitter
      } else if (ctrlKey && key === 'b') {
        window.open('https://www.youtube.com', '_blank'); // Opens Youtube
      } else if (ctrlKey && key === 'j') {
        window.open('https://www.atlassian.com/software/jira', '_blank'); // Opens Jira
      } else if (ctrlKey && key === 'z') {
        window.open('https://www.threads.net/', '_blank'); // Opens Threads
      } else if (ctrlKey && key === 'a') {
        window.open('https://www.atlassian.com/', '_blank'); // Opens Atlassian
      } else if (altKey && key === 'g') {
        window.open('https://github.com/', '_blank'); // Opens Github
      } else if (ctrlKey && key === 'v') {
        window.open('https://vercel.com/', '_blank'); // Opens Vercel
      } else if (ctrlKey && key === 'i') {
        window.open('https://www.instagram.com', '_blank'); // Opens Instagram
      } else if (ctrlKey && key === 'y') {
        window.open('https://www.twitter.com', '_blank'); // Opens Twitter (Ctrl + Y as alternate shortcut)
      } else if (ctrlKey && key === 'l') {
        window.open('https://www.linkedin.com', '_blank'); // Opens LinkedIn
      } else if (ctrlKey && key === 'f') {
        window.open('https://www.facebook.com', '_blank'); // Opens Facebook

      // Internal navigation shortcuts
      } else if (altKey && key === 'n') {
        navigate('/text-to-speech'); // Navigate to Text to Speech page
      } else if (altKey && key === 's') {
        navigate('/speech-to-text'); // Navigate to Speech to Text page
      } else if (altKey && key === 'h') {
        navigate('/help'); // Navigate to Help page
      } else if (altKey && key === 'd') {
        navigate('/dashboard'); // Navigate to Dashboard
      } else if (altKey && key === 'p') {
        navigate('/view-account'); // Navigate to Profile
      } else if (altKey && key === 'c') {
        navigate('/change-password'); // Navigate to Change Password Page
      } else if (altKey && key === 'o') {
        navigate('/delete-account'); // Navigate to Delete Account Page
      } else if (altKey && key === 'z') {
        navigate('/login'); // Logout
      } else if (altKey && key === 'f') {
        navigate('/image-to-text'); // Navigate to Image to Text page

      // Toggle Night Mode
      } else if (ctrlKey && key === 'm') {
        toggleNightMode(); // Toggle Night Mode
      } else if (altKey && key === 'l') {
        window.open('https://accessibility-bot-multilang.vercel.app/', '_blank'); // Multi-Language page
      } else if (altKey && key === 'm') {
        window.open('https://accessibility-bot-text-summarize.vercel.app/', '_blank'); // Summarize the Text page
      } else if (ctrlKey && key === 'p') {
        window.open('https://accessibility-bot-text-paraphrase.vercel.app/', '_blank'); // Paraphrasing page
      } else if (ctrlKey && key === 'd') {
        window.open('https://accessibility-bot-interactive-dictionary.vercel.app/', '_blank'); // Dictionary page
      } else if (altKey && key === 'k') {
        navigate('/keyboardshortcuts'); // Navigate to Keyboard Shortcuts Page
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, toggleNightMode]);
};

export default useKeyboardShortcuts;
