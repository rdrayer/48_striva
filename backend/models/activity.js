"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

class Activity {
    /** Create a activity (from data), update db, return new activity data.
     *
     * data should be { id, activityType, distance, activityDateTime, activityDuration, title, description, user_id }
     *
     * Returns { id, activity, distance, activityDateTime, activityDuration, title, description, user_id }
     *
     * Throws BadRequestError if activity already in database.
     * */

    static async create({ activityType, distance, activityDateTime, activityDuration, title, description, username }) {
        const duplicateCheck = await db.query(
            `SELECT id
            FROM activities
            WHERE title = $1 AND user_id = $2`,
            [title, username]);

        if (duplicateCheck.rows[0])
        throw new BadRequestError(`Duplicate activity: ${title}`);

        const result = await db.query(
            `INSERT INTO activities
            (activity_type, distance, activity_datetime, activity_duration, title, description, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, activity_type AS "activityType", distance, activity_datetime AS "activityDateTime", activity_duration AS "activityDuration", title, description, user_id AS "username"`,
            [
            activityType,
            distance,
            activityDateTime,
            activityDuration,
            title,
            description,
            username
            ],
        );
        const activity = result.rows[0];

        return activity;
    }

     /** Find all activities 
     *
     * 
     * Returns [{ id, activityType, distance, activityDateTime, activityDuration, title, description, user_id }, ...]
     * */

    static async findAll(username) {
        const query = `SELECT id,
                            activity_type AS "activityType",
                            distance,
                            activity_datetime AS "activityDateTime",
                            activity_duration AS "activityDuration",
                            title,
                            description,
                            user_id AS "username"
                    FROM activities
                    WHERE user_id = $1
                    ORDER BY activity_datetime DESC`;

        const activitiesRes = await db.query(query, [username]);
        return activitiesRes.rows;
    }

    static async findTopUsersByWeek(startDate, endDate) {
        const query = `
            SELECT user_id AS "username",
                   SUM(distance) AS "totalDistance",
                   COUNT(*) AS "numberOfActivities"
            FROM activities
            WHERE activity_datetime >= $1 AND activity_datetime <= $2
            GROUP BY user_id
            ORDER BY "totalDistance" DESC
        `;
    
        const result = await db.query(query, [startDate, endDate]);
        return result.rows;
    }
    

    /** Given a activity handle, return data about activity.
     *
     * Returns { id, activityType, distance, activityDateTime, activityDuration, title, description, user_id }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const activityRes = await db.query(
            `SELECT id,
                    activity_type AS "activityType",
                    distance,
                    activity_datetime AS "activityDateTime",
                    activity_duration AS "activityDuration",
                    title,
                    description,
                    user_id AS "username"
            FROM activities
            WHERE id = $1`,
            [id]);

        const activity = activityRes.rows[0];

        if (!activity) throw new NotFoundError(`No activity: ${id}`);

        return activity;
    }

    /** Update activity data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {title, description}
     * 
     *      -activity (enum) bike, swim, soccer, run, etc
            -distance
            -date
            -time
            -title
            -description
     *
     * Returns {id, activity, distance, activityDateTime, activityDuration, title, description, user_id }
     *
     * Throws NotFoundError if not found.
     **/
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data,{});
        //const idVarIdx = "$" + (values.length + 1);
        const idVarIdx = values.length + 1;
    
        const querySql = `UPDATE activities 
                          SET ${setCols} 
                          WHERE id = $${idVarIdx} 
                          RETURNING id,
                                    activity_type AS "activityType",
                                    distance,
                                    activity_datetime AS "activityDateTime",
                                    activity_duration AS "activityDuration",
                                    title,
                                    description,
                                    user_id AS "username"`;
        const result = await db.query(querySql, [...values, id]);
        const activity = result.rows[0];
    
        if (!activity) throw new NotFoundError(`No activity: ${id}`);
    
        return activity;
    }

    /** Delete given activity from database; returns undefined.
     *
     * Throws NotFoundError if activity not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE
            FROM activities
            WHERE id = $1
            RETURNING id`,
            [id]);
        const activity = result.rows[0];

        if (!activity) throw new NotFoundError(`No activity: ${id}`);
    }
}

module.exports = Activity;