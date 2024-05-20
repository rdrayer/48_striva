import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class StrivaApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${StrivaApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    //console.log(res.user);
    return res.user;
  }

  static async signup(userData) {
    try {
      let res = await this.request("auth/register", userData, "post");
      return res.token;
    } catch (error) {
      console.error("error during signup", error);
      throw error;
    }
  }

  static async login(userData) {
    try {
      let res = await this.request("auth/token", userData, "post");
      return res.token;
    } catch (error) {
      console.error("error during login", error);
      throw error;
    }
  }

  static async editProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  static async getActivities(username) {
    try {
      let res = await this.request(`activities/${username}`);
      return res.activities;
    } catch (error) {
      console.error("Error getting activities:", error);
    }
  }

  static async createActivity(username, userData) {
    try {
      let res = await this.request(`activities/${username}/new`, userData, "post");
      return res.activity;
    } catch (error) {
      console.error("error creating activity ", error);
      throw error;
    }
  }

  static async getActivity(username, id) {
    try {
      let res = await this.request(`activities/${username}/${id}`);
      console.log(res);
      return res.activity;
    } catch (error) {
      console.error("Error getting activity:", error);
      throw error;
    }
  }

  static async getTopUsersByWeek(startDate, endDate) {
    try {
      let res = await this.request("activities", {startDate, endDate}, "get");
      console.log(res);
      return res.activities;
    } catch (error) {
      console.error("Error getting top users activities:", error);
      throw error;
    }
  }

  static async deleteActivity(activityId) {
    try {
      let res = await this.request(`activities/${activityId}`, {}, "delete");
      return res.deleted;
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw error;
    }
  }

}

export default StrivaApi;

// // for now, put token ("testuser" / "password" on class)
// StrivaApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

