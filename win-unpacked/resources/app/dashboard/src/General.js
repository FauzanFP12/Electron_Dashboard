import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatView from './ChatView'; // Import the Chat component
import CloseChatView from './CloseChatView'; // Import the Chat component
import './General.css';

const General = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Fetch all tickets on component mount
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

    // Handle selecting a ticket and passing it to the chat
    const handleSelectTicket = (ticket) => {
        setSelectedTicket(ticket);  // Set the selected ticket
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true // Enable 12-hour format (AM/PM)
        };
        return date.toLocaleString('en-US', options); // Formats date and time to a readable format
    };

    return (
        <div className="general-container">
            {selectedTicket ? (
                selectedTicket.status === 'Closed' ? (
                    // Render something when the ticket is closed
                    <div>
                        <CloseChatView selectedTicket={selectedTicket} />
                    </div>
                ) : (
                    // Render regular chat if ticket is open
                    <ChatView selectedTicket={selectedTicket} />
                )
            ) : (
                <div>
                    <h2>All Helpdesk Tickets</h2>
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created Date</th> {/* New Created Date column */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No tickets found</td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr key={ticket._id}>
                                        <td>{ticket.subject}</td>
                                        <td>{ticket.description}</td>
                                        <td>{ticket.status}</td>
                                        <td>{formatDate(ticket.createdAt)}</td> {/* Display formatted date and time */}
                                        <td>
                                            <button onClick={() => handleSelectTicket(ticket)}>
                                                View Chat
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default General;
