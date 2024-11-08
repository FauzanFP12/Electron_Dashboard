import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // useLocation here
import Dashboard from './Dashboard';
import FormInsiden from './FormInsiden';
import InsidenTable from './InsidenTable';
import Sidebar from './Sidebar';
import Header from './Header';
import Login from './Login';
import Register from './Register'
import './App.css';
import axios from 'axios';
import MapIndonesia from './MapIndonesia';

const App = () => {
    const [insidenList, setInsidenList] = useState([]); // State for incident list
    const [chartData, setChartData] = useState([]); // State for chart data
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar closed by default
    const [loading, setLoading] = useState(false); // State to control loading indicator
    const location = useLocation(); // useLocation hook here

    // Fetch incidents from API when the app loads
    const getInsidens = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/insidens`);
            setInsidenList(response.data); // Update incident list
            calculateChartData(response.data); // Update chart data
        } catch (error) {
            console.error('Error fetching incidents:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Calculate the chart data based on incidents
    const calculateChartData = (incidents) => {
        const currentTime = new Date();
        const updatedChartData = incidents.map((insiden) => {
            const elapsedMilliseconds = currentTime - new Date(insiden.tanggalStart);
            const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
            return { ...insiden, elapsedHours }; // Add elapsed time to each incident
        });
        setChartData(updatedChartData); // Update chart data
    };

    // Handler to toggle the sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState); // Toggle sidebar open/close state
    };

    // Fetch the incidents from the API on mount
    useEffect(() => {
        getInsidens(); // Fetch data on app load
    }, []);

    return (
        <div className="app-container">
            {/* Only show Sidebar if not on /login route */}
            {location.pathname !== '/login' && (
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            )}

            <div className="main-content">
                {/* Always show Header */}
                <Header toggleSidebar={toggleSidebar} />
                
                {/* Show loading indicator when fetching data */}
                {loading ? (
                    <div className="loading-indicator">Loading...</div>
                ) : (
                    <Routes>
                        <Route 
                            path="/" 
                            element={<Dashboard insidenList={insidenList} chartData={chartData} />} 
                            
                        />
                        <Route 
                            path="/form-insiden" 
                            element={<FormInsiden getInsidens={getInsidens} />} 
                        />
                        <Route 
                            path="/insiden-table" 
                            element={<InsidenTable setChartData={setChartData} getInsidens={getInsidens} />} 
                        />
                        <Route 
                            path="/map-insiden" 
                            element={<MapIndonesia />} 
                        />
                        <Route 
                            path="/dashboard" 
                            element={<Login />} 
                            
                        />
                      
                    </Routes>
                )}
            </div>
        </div>
    );
};

export default App;
