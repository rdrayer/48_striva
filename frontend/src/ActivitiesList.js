import React, { useState, useEffect, useContext } from "react";
import StrivaApi from "./api";
import ActivityCard from "./ActivityCard";
import { UserContext } from "./App";
import { useNavigate } from 'react-router-dom';

function ActivitiesList() {
    const [activities, setActivities] = useState([]);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    async function fetchActivities() {
        if (currentUser && currentUser.username) {
            try {
                const fetchedActivities = await StrivaApi.getActivities(currentUser.username);
                setActivities(fetchedActivities || []);
                //console.debug("Activities fetched:", fetchedActivities);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
                setActivities([]);
            }
        }
    }
    // to fetch the list of activities from the backend when the component mounts
    useEffect(function getActivitiesOnMount() {
        fetchActivities();
    }, []);

    const handleNewActivity = () => {
        navigate(`/activities/${currentUser.username}/new`);
    };

    return (
        <div className="activities-container">
            <p>
                {currentUser ? (
                    <button onClick={handleNewActivity} className="btn">Create Activity</button>
                ) : (
                    <span></span>
                )}
            </p>
            {activities.length > 0 ? (
                    <div className="activities-list">
                        {activities.map(a => (
                            <ActivityCard 
                                key={a.id}
                                id={a.id}
                                title={a.title}
                                username={currentUser.username}
                                description={a.description}
                                activityType={a.activityType}
                                distance={a.distance}
                                duration={a.activityDuration}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Sorry, we didn't find any activities</p>
            )}
        </div>
    );
}

export default ActivitiesList;