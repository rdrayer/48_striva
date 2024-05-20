import { useState, useEffect, useContext } from "react";
import { UserContext } from "./App";
import { Link } from 'react-router-dom';
import './Home.css';
import StrivaApi from "./api";

function Home() {
    const { currentUser } = useContext(UserContext);
    const [topUsers, setTopUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopActivities = async () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);
            try {
                const formattedStartDate = startDate.toISOString().slice(0, 10);
                const formattedEndDate = endDate.toISOString().slice(0, 10);
                const activitiesData = await StrivaApi.getTopUsersByWeek(formattedStartDate, formattedEndDate);
                setTopUsers(activitiesData);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data', err);
                setIsLoading(false);
            }
        };
        fetchTopActivities();
    }, []);
    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-container">
            {currentUser ? (
                <div className="welcome-section">
                    <h2 className="welcome-message">Welcome Back {currentUser.firstName}</h2>
                    <h3 className="top-users-title">Top Users This Week:</h3>
                    <ul className="top-users-list">
                        {topUsers.map(user => (
                            <li key={user.username} className="top-user-item">
                                {user.username}: {user.totalDistance} miles over {user.numberOfActivities} activities
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h1>Striva</h1>
                    <h3>Track your activities.</h3>
                    <p>
                        <Link className="btn" to="/login">Login</Link>
                        <Link className="btn" to="/signup">Signup</Link>
                    </p>
                </div>
            )}
        </div>
        
    );
}

export default Home;