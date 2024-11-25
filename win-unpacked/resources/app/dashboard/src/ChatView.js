import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import './Chat.css';

const Chat = ({ selectedTicket }) => {
    const [chatMessages, setChatMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (selectedTicket) {
            fetchChatMessages(selectedTicket._id);
        }
    }, [selectedTicket]);

    const fetchChatMessages = async (ticketId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/helpdesk-tickets/${ticketId}/chat`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setChatMessages(response.data);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    const sendChatMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/helpdesk-tickets/${selectedTicket._id}/chat`,
                {
                    sender: "User",
                    message: newMessage,
                }
            );

            if (response.status === 200) {
                fetchChatMessages(selectedTicket._id);
                setNewMessage('');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Adjust format as needed
    };

    return (
        <div className="chat-container">
            <div className="chat-area">
                <h3>Ticket Chat</h3>
                <div className="chat-messages">
                    {chatMessages.length > 0 ? (
                        chatMessages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === 'User' ? 'from-user' : 'from-support'}`}>
                                <strong>{msg.sender}:</strong> {msg.message}
                                <div className="message-meta">
                                    <span className="timestamp">{formatDate(msg.createdAt)}</span>
                                    {msg.fileUrl && <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">View Attachment</a>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No chat messages yet.</p>
                    )}
                </div>

                <p></p>
            </div>

            <div className="ticket-details">
                <h3>Details</h3>
                <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                <p><strong>Status:</strong> {selectedTicket.status}</p>
                <p><strong>Description:</strong> {selectedTicket.description}</p>
                <p><strong>Created At:</strong> {formatDate(selectedTicket.createdAt)}</p>
            </div>
        </div>
    );
};

export default Chat;
