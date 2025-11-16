import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';


const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    darkMode,
    toggleDarkMode
  } = useContext(Context);

  // Small, localizable strings for now. Replace with your i18n system later.
  const locale = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en';
  const lang = locale.split('-')[0];
  const strings = {
    en: {
      placeholder: 'Enter a prompt here',
      bottomInfo:
        "Accessibility bot may display inaccurate info, including about people, so double-check its responses.",
    },
    es: {
      placeholder: 'Introduce una solicitud aquí',
      bottomInfo:
        'El bot de accesibilidad puede mostrar información inexacta, incluyendo sobre personas; verifique las respuestas.',
    },
    ar: {
      placeholder: 'أدخل النص هنا',
      bottomInfo: 'قد يعرض الروبوت معلومات غير دقيقة، تحقق من الإجابات.',
    },
  };

  const t = strings[lang] || strings.en;

  return (
    <div className={`main ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/*<div class="Multi-Lang-Bot">
      <h1>Multi-Language Bot</h1>
      </div>*/}

      <div className="main-container">
        {showResult ? (
          <div className="result">
            <div className="result-title">
              <img src="" alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src="" alt="" />
              {loading ? (
                <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/*<div className="greet">
              <p>
                <span>Whats Up!.</span>
              </p>
              <p>How can I help you today?</p>
            </div>*/}
            <div className="cards"></div>
          </>
        )}

        <div className="main-bottom">
          <div className="search-box" role="search" aria-label={t.placeholder} data-i18n="searchBox">
            {/* Accessible label for SR only users */}
            <label htmlFor="prompt-input" className="sr-only">{t.placeholder}</label>
            <input
              id="prompt-input"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              data-i18n="placeholder"
            />
            <div>
              {/* keep icons but ensure they have alt text for assistive tech */}
              {/* <img src={assets.gallery_icon} width={30} alt="Open gallery" /> */}
              {/* <img src={assets.mic_icon} width={30} alt="Record voice" /> */}
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} width={30} alt="Send prompt" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info" role="note" data-i18n="bottomInfo">
            {t.bottomInfo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
