"use strict";

/** Activities Routes **/

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Activity = require("../models/activity");
const { createToken } = require("../helpers/tokens");
const activityNewSchema = require("../schemas/activityNew.json");
const activityUpdateSchema = require("../schemas/activityUpdate.json");

const router = express.Router();

// get all activities todo map through activities
router.get("/", async function (req, res, next) {
    try {
        const activities = await Activity.get(req.params.activities);
        return res.json({ activities });
    } catch (err) {
        return next(err);
    }
});

// todo post activity
router.post("/", ensureCorrectUser, async function (req, res, next) {
    try {
        
    } catch (err) {
        return next(err);
    }
});

// todo get activity
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        const activity = await Activity.get(req.params.activity);
        return res.json({ activity });
    } catch (err) {
        return next(err);
    }
});

// todo patch activity
router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, activityUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
    const activity = await Activity.update(req.params.activity, req.body);
    console.log('patch', activity);

    return res.json({ activity });

    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        //todo
    }
    catch (err) {
        //todo
    }
});

module.exports = router;