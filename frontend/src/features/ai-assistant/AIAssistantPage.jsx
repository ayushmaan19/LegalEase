import React, { useState, useEffect, useRef } from 'react';
import styles from './AIAssistant.module.css';
import MessageBubble from './MessageBubble';
import { FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next'; 

const AIAssistantPage = () => {
  const { t, i18n } = useTranslation(); 
  
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: t('aiAssistant.initialMessage', 'नमस्ते! मैं आपका AI कानूनी सहायक हूँ। मैं आपको आपके अधिकारों, कानूनी प्रक्रियाओं को समझने में मदद कर सकता हूँ और प्रारंभिक मार्गदर्शन प्रदान कर सकता हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

 
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isAiTyping) return; 

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAiTyping(true); 

    // --- Gemini API Call ---
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt = `You are "LegalEase," a helpful and compassionate AI legal assistant. Your goal is to provide preliminary legal information and guidance to users in India. 
    You must not provide definitive legal advice or create a lawyer-client relationship. 
    Always be empathetic and clear. If the query is complex, advise the user to consult with a verified lawyer on the platform.Always give the answers in a structured manner with bullet points or numbered lists where applicable.
    The user is currently speaking ${i18n.language === 'hi' ? 'Hindi' : 'English'}. Please respond in that language.`;
    
    const payload = {
      contents: [{ parts: [{ text: input }] }], 
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error("No content received from AI.");
      }

      const aiResponse = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (err) {
      console.error("AI fetch error:", err);
      const errorResponse = {
        sender: 'ai',
        text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsAiTyping(false); 
    }
  };


  const handleSampleQuestion = (questionKey) => {
    setInput(t(`sidebar.questions.${questionKey}`));
  };
  
  const sampleQuestionKeys = ['q1', 'q2', 'q3', 'q4'];
  const topicKeys = ['family', 'property', 'criminal', 'labor', 'consumer', 'civil', 'taxation', 'other'];

  return (
    <div className={styles.pageWrapper}>
      {/* --- Main Chat Column --- */}
      <div className={styles.chatContainer}>
        <header className={styles.chatHeader}>
          <div>
            <h3>{t('aiAssistant.title')}</h3>
            <p>{t('aiAssistant.subtitle')}</p>
          </div>
          <button className={styles.newChatBtn}>{t('aiAssistant.newChat')}</button>
        </header>

        <div className={styles.messagesWindow}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* --- AI Typing Indicator --- */}
        {isAiTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.dotFlashing}></div>
            <span>LegalEase is typing...</span>
          </div>
        )}

        <form className={styles.inputForm} onSubmit={handleSendMessage}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder={t('aiAssistant.inputPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAiTyping} 
          />
          <button type="submit" className={styles.sendBtn} disabled={isAiTyping}>
            <FiSend />
          </button>
        </form>
      </div>

      {/* --- Right Sidebar --- */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarCard}>
            <h4 className={styles.cardTitle}>{t('sidebar.languageTitle')}</h4>
            <select className={styles.languageSelect} onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
            </select>
        </div>
        <div className={styles.sidebarCard}>
            <h4 className={styles.cardTitle}>{t('sidebar.sampleQuestionsTitle')}</h4>
            <div className={styles.sampleQuestions}>
              {sampleQuestionKeys.map(key => (
                <button key={key} className={styles.sampleQuestionBtn} onClick={() => handleSampleQuestion(key)}>
                  {t(`sidebar.questions.${key}`)}
                </button>
              ))}
            </div>
        </div>
        <div className={styles.sidebarCard}>
            <h4 className={styles.cardTitle}>{t('sidebar.legalTopicsTitle')}</h4>
            <div className={styles.topicGrid}>
              {topicKeys.map(key => (
                <button key={key} className={styles.topicTag}>
                  {t(`sidebar.topics.${key}`)}
                </button>
              ))}
            </div>
        </div>
        <div className={`${styles.sidebarCard} ${styles.notice}`}>
          <h4 className={styles.cardTitle}>{t('sidebar.noticeTitle')}</h4>
          <p>{t('sidebar.noticeText')}</p>
        </div>
      </aside>
    </div>
  );
};

export default AIAssistantPage;