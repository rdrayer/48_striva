import React, { useState, useEffect, useContext } from "react";
import StrivaApi from "./api";
import ActivityCard from "./ActivityCard";
import { UserContext } from "./App";
import { Link } from 'react-router-dom';

function ActivitiesList() {
    const [activities, setActivities] = useState([]);

    const { currentUser } = useContext(UserContext);

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


    return (
        <div>
            <p>
                {currentUser ? (<Link to={`/activities/${currentUser.username}/new`}>New</Link>) : (<span></span>)}
            </p>
            {activities.length > 0 ? (
                    <div>
                        {activities.map(a => (
                            <ActivityCard 
                                key={a.id}
                                id={a.id}
                                title={a.title}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Sorry, no results</p>
            )}
        </div>
    );
}

export default ActivitiesList;