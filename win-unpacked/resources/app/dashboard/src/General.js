import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react'; // Import AG-Grid React component
import ChatView from './ChatView'; // Import the Chat component
import CloseChatView from './CloseChatView'; // Import the CloseChat component
import 'ag-grid-community/styles/ag-grid.css'; // AG-Grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG-Grid Alpine theme
import './General.css';

const General = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Retrieve user information from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const fullName = user?.fullName;
    const role = localStorage.getItem("role"); // role can be 'admin' or 'user'

    // Fetch all tickets on component mount
    useEffect(() => {
        fetchTickets();
    }, []);

    // Fetch tickets from the server
    const fetchTickets = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/helpdesk-tickets`);
            const allTickets = response.data;

            // Filter tickets based on the user's role
            const filteredTickets = role === 'admin'
                ? allTickets
                : allTickets.filter(ticket => ticket.createdBy.fullName === fullName);

            setTickets(filteredTickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    // Handle row selection in AG-Grid
    const handleRowSelection = (event) => {
        const selectedTicket = event.data;  // Get data directly from event
        setSelectedTicket(selectedTicket);
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

    // AG-Grid column definitions
    const columns = [
        { 
            headerName: 'Created By', 
            field: 'createdBy.fullName', // Always display fullName
            flex: 1,
            valueFormatter: (params) => params.value || "Unknown" // Fallback if no creator info is available
        },
        { headerName: 'Subject', field: 'subject', flex: 1 },
        { headerName: 'Description', field: 'description', flex: 1 },
        { headerName: 'Status', field: 'status', flex: 1 },
        { 
            headerName: 'Created Date', 
            field: 'createdAt', 
            flex: 1,
            valueFormatter: (params) => formatDate(params.value) // Use valueFormatter to format date
        },
    ];

    return (
        <div className="general-container">
            {selectedTicket ? (
                selectedTicket.status === 'Closed' ? (
                    <div>
                        <CloseChatView selectedTicket={selectedTicket} />
                    </div>
                ) : (
                    <ChatView selectedTicket={selectedTicket} />
                )
            ) : (
                <div>
                    <h2>All Helpdesk Tickets</h2>
                    <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                        <AgGridReact
                            rowData={tickets}
                            columnDefs={columns}
                            domLayout="autoHeight"
                            pagination={true}
                            rowSelection="single"
                            onRowClicked={handleRowSelection} // Handle row selection
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default General;
