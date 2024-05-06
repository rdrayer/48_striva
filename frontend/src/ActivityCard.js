import React from "react";
import { Link } from 'react-router-dom';

function ActivityCard({ title, id }) {
    return (
        <div>
            <Link to={`/activities/${id}`}>
                <h2>{title}</h2>
            </Link>
        </div>

    )
}

export default ActivityCard;