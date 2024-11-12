import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Chat from './Chat'; // Import the Chat component
import './HelpDesk.css';

const HelpDesk = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chatMessages, setChatMessages] = useState({});
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [viewChat, setViewChat] = useState(false); // Flag to toggle chat view

    const navigate = useNavigate(); // Initialize the navigate function

    // Fetch tickets on component mount
    useEffect(() => {
        fetchTickets();
    }, []);

    // Fetch tickets from the server
    const fetchTickets = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/helpdesk-tickets`);
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    // Handle creating a new ticket
    const handleCreateTicket = async () => {
        if (!subject.trim() || !description.trim()) {
            alert("Please enter both a subject and a description.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/helpdesk-tickets`, {
                subject,
                description,
                status: "New",
            });

            if (response.status === 201) {
                const newTicket = response.data;
                setTickets([...tickets, newTicket]);
                redirectToChat(newTicket); // Open the chat for the new ticket
                setSubject('');
                setDescription('');

                // Navigate to the /help-desk/general page after creating the ticket
                navigate('/help-desk/general');
            } else {
                throw new Error("Failed to create the ticket.");
            }
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };

    // Redirect to Chat view with selected ticket
    const redirectToChat = (ticket) => {
        setSelectedTicket(ticket);
        setViewChat(true);
    };

    return (
        <div className="helpdesk-container">
            {viewChat ? (
                <Chat selectedTicket={selectedTicket} /> // Pass selected ticket to Chat component
            ) : (
                <div className="create-ticket-form">
                    <h3>Create a New Ticket</h3>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your issue..."
                    />
                    <button onClick={handleCreateTicket}>Submit Ticket</button>
                </div>
            )}
        </div>
    );
};

export default HelpDesk;
