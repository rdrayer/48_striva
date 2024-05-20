import React from "react";
import { Link } from 'react-router-dom';
import './Activity.css';
import { formatDuration } from './utils';

function ActivityCard({ title, id, username, description, activityType, distance, duration }) {
    return (
        <div className="activity-card">
            <Link to={`/activities/${username}/${id}`}>
                <h2>{title}</h2>
            </Link>
                <p>{description}</p>
                <p>Type: {activityType}</p>
                <p>Distance: {distance} miles</p>
                <p>formatDuration{duration}</p>
        </div>
    )
}

export default ActivityCard;