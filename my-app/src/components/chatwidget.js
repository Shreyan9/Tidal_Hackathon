import React, { useState, useEffect, useRef } from 'react';
import './chatwidget.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your cybersecurity assistant. Ask me anything about scam calls, online security, or cybersecurity best practices.", isUser: false }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessages = [...messages, { text: inputMessage, isUser: true }];
        setMessages(newMessages);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: inputMessage })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setMessages([...newMessages, { text: data.response, isUser: false }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { text: 'Error connecting to the server. Try again later.', isUser: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="chat-widget">
            <button className="chat-button" onClick={toggleChat}>💬</button>

            {isOpen && (
                <div className="chat-container">
                    <div className="chat-header">
                        <h3>Cybersecurity Assistant</h3>
                        <button className="close-chat" onClick={toggleChat}>×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
                                {message.text}
                            </div>
                        ))}
                        {isLoading && <div className="loading">Thinking...</div>}
                        <div ref={messagesEndRef} /> {/* Auto-scroll target */}
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyPress} // Updated to `onKeyDown` for better support
                            placeholder="Type your question here..."
                        />
                        <button className="send-button" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;