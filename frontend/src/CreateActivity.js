import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./App";
import StrivaApi from './api';

function CreateActivity() {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  let initialFormData = {
    activityType: '',
    distance: '',
    activityDuration: '',
    title: '',
    description: '',
    username: currentUser.username
  }

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ['distance', 'activityDuration'];
    if (numberFields.includes(name)) {
      setFormData(data => ({ ...data, [name]: value ? Number(value) : '' }));
    }
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form', formData);
    try {
      await StrivaApi.createActivity(currentUser.username, formData);
      sessionStorage.setItem('welcomeMessage', `Welcome!`);
      navigate(`/activities/${currentUser}`);
    } catch (error) {
      console.error('Failed to create activity', error);
    } 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="activityType">Activity Type</label>
        <select
          name="activityType"
          id="activityType"
          value={formData.activityType}
          onChange={handleChange}
          required
        >
          <option value="">--Please choose an activity type--</option>
          <option value="cycle">Cycle</option>
          <option value="swim">Swim</option>
          <option value="run">Run</option>
          <option value="hike">Hike</option>
          <option value="soccer">Soccer</option>
          <option value="row">Row</option>
          <option value="boxing">Boxing</option>
          <option value="walking">Walking</option>
          <option value="weightTraining">Weight Training</option>
          <option value="yoga">Yoga</option>
        </select>
      </div>
      <div>
        <label htmlFor="distance">Distance</label>
        <input
          type="number"
          name="distance"
          id="distance"
          value={formData.distance}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
        />
      </div>
      <div>
        <label htmlFor="activityDurations">Duration</label>
        <input
          type="number"
          name="activityDuration"
          id="activityDuration"
          value={formData.activityDuration}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <label>Username</label>
        <input
            disabled
            placeholder={formData.username}
        />
      <button type="submit">Create Activity</button>
    </form>
  );
}

export default CreateActivity;
