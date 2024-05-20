import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from './App';
import StrivaApi from './api';
import './Activity.css';
import { formatDuration } from './utils';

function ActivityDetail () {
    const [activity, setActivity] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const activityData = await StrivaApi.getActivity(currentUser.username, id);
                setActivity(activityData);
            } catch (err) {
                console.error('Error fetching data', err);
            }
        };
    
        fetchActivity();
    }, [id]);

    if (!activity) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (activityId) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            try {
                await StrivaApi.deleteActivity(activityId);
                alert("Activity deleted successfully");
                navigate("/");
            } catch (error) {
                console.error('Error deleting activity', error);
                alert('Failed to delete the activity');
            }
        }
    }

    return (
        <div className="activity-detail">
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
            <p>Date: {activity.activityDateTime}</p>
            <p>{activity.distance} miles</p>
            <p>Type: {activity.activityType}</p>
            <p>formatDuration{activity.activityDuration}</p>

            <button onClick={() => handleDelete(activity.id)}>Delete</button>
        </div>
    )
}

export default ActivityDetail;