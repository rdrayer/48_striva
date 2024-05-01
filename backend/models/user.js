"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    /** Authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/
    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email"
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
            delete user.password;
            return user;
        }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
            `INSERT INTO users
            (username,
            password,
            first_name,
            last_name,
            email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
        [
            username,
            hashedPassword,
            firstName,
            lastName,
            email
        ],
    );

    const user = result.rows[0];

    return user;
    }

    /** GET 
     * Input: username Output: data about user
     * Returns: { username, first_name, last_name, activities }
     * Throws NotFoundError if not found.
     **/
    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        const userActivitiesRes = await db.query(
            `SELECT a.id
            FROM activities AS a
            WHERE a.user_id = $1`, [username]
        );

        user.activities = userActivitiesRes.rows.map(a => a.id);
        return user;
    }

    /** PATCH 
     * Update user data with `data`.
     * Partial update, meaning not all fields are required.
     * Input can include: { firstName, lastName, email }
     * Returns: { username, firstName, lastName, email }
     * Throws NotFoundError if not found.
     **/
    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name"
            }
        );
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameVarIdx}
                          RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

}
 
module.exports = User;