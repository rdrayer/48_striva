"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Activity {

    // todo patch
    static async update(activity, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
              firstName: "first_name",
              lastName: "last_name",
              isAdmin: "is_admin",
            });
        const usernameVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE activities 
                          SET ${setCols} 
                          WHERE username = ${usernameVarIdx} 
                          RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email,
                                    is_admin AS "isAdmin"`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
    
        delete user.password;
        return user;
      }

    //   -type (enum) bike, swim, soccer, run, etc
    //   -distance
    //   -date
    //   -time
    //   -title
    //   -description
    

}

module.exports = Activity;