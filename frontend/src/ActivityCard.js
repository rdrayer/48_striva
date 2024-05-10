import React from "react";
import { Link } from 'react-router-dom';

function ActivityCard({ title, id, username }) {
    return (
        <div>
            <Link to={`/activities/${username}/${id}`}>
                <h2>{title}</h2>
            </Link>
        </div>

    )
}

export default ActivityCard;