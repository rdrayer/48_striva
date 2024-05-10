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
            startDate.setDate(endDate.getDate() - 7);
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
        <div>
            <h1>Striva</h1>
            <h3>Track your activities.</h3>
            {currentUser ? (
                <div>
                    <h2>Welcome Back {currentUser.firstName}</h2>
                    <h3>Top Users This Week:</h3>
                    <ul>
                        {topUsers.map(user => (
                            <li key={user.username}>
                                {user.username}: {user.totalDistance} miles over {user.numberOfActivities} activities
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>
                    <Link className="btn" to="/login">Login</Link>
                    <Link className="btn" to="/signup">Signup</Link>
                </p>
            )}
        </div>
        
    );
}

export default Home;