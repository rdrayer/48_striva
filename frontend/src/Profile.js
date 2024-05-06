import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./App";
import JoblyApi from "./api";

function Profile() {
    const { currentUser } = useContext(UserContext);
    let userData = {
        firstName: '',
        lastName: '',
        email: ''
    }
    const [formData, setFormData] = useState(userData);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username,
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email
        }
        let username = formData.username;
        try {
            await JoblyApi.editProfile(username, profileData);
            setIsUpdated(true);
        } catch (error) {
          console.error('error handling submit', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input
                    disabled
                    placeholder={formData.username}
                />
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <label>Email</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <button type="submit">Save Changes</button>
                {isUpdated && <div>Updated Successfully</div>}
            </div>
        </form>
    )
}

export default Profile;