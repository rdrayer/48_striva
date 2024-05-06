"use strict";

/** User Routes **/

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Activity = require("../models/activity");
const { createToken }  = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

// router.get("/", async function (req, res, next) {
//     try {
//         const users = await User.findAll();
//         return res.json({ users });
//     } catch (err) {
//         return next(err);
//     }
// });

// // Example of how you might call this function in an Express route
// router.get("/:username/activities", ensureCorrectUser, async function (req, res, next) {
//     try {
//         const username = req.params.username;  // Ensure this matches the logged-in user to avoid privacy leaks
//         const activities = await Activity.findAll(username);
//         res.json(activities);
//     } catch (err) {
//         return next(err);
//     }
// });


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, activities }
 *   where activity is { id, activityType, distance, activityDatetime, activityDuration, title, description, username }
 *
 * Authorization required: user-as-:username
 **/
router.get("/:username", async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[username] { user } => { user }
 * Data can include: { firstName, lastName, password, email }
 * Returns: { username, firstName, lastName, email }
 * Auth required: same-user-as-:username
 **/
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        console.log(req.body, 'req.body');
        const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    console.log('patch', user);
    return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  });




module.exports = router;
