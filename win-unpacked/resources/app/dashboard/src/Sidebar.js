import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [isHelpDeskOpen, setHelpDeskOpen] = useState(false);

    const toggleHelpDeskDropdown = () => {
        setHelpDeskOpen(!isHelpDeskOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            {isOpen && (
                <nav>
                    <ul><br></br><br></br>
                        <li>
                            <a href="/">Dashboard</a>
                        </li>
                        <li>
                            <a href="/map-insiden">Map Insiden</a>
                        </li>
                        <li>
                            <a href="/insiden-table">Insiden Table</a>
                        </li>
                       
                        <li>
                            <a onClick={toggleHelpDeskDropdown} href="#!">Help Desk</a>
                            {isHelpDeskOpen && (
                                <ul className="dropdown">
                                    <li><a href="/help-desk/view">General</a></li>
                                    <li><a href="/help-desk/create">Create Chat </a></li>
                                    <li><a href="/help-desk/general">Open Chat</a></li>
                                    <li><a href="/help-desk/close">Close Chat</a></li>       
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default Sidebar;
