"use strict";

/** Users Routes **/

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
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

//todo
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


module.exports = router;
