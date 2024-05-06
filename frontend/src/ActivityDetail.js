import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './App';
import StrivaApi from './api';

function ActivityDetail() {
    const [activity, setActivity] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const activityData = await StrivaApi.getActivity(id);
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


    return (
        <div>
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
        </div>
    )
}

export default ActivityDetail;