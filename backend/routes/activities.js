"use strict";

/** Activities Routes **/

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError, NotFoundError } = require("../expressError");
const Activity = require("../models/activity");

const activityNewSchema = require("../schemas/activityNew.json");
const activityUpdateSchema = require("../schemas/activityUpdate.json");

const router = express.Router();

// get all activities todo map through activities
router.get("/", ensureCorrectUser, async function (req, res, next) {
    try {
        // might need to change this
        const userId = req.user.id;
        const activities = await Activity.findAll(userId);
        return res.json({ activities });
    } catch (err) {
        return next(err);
    }
});

/** POST / { activity } => { activity }
 * 
 */
router.post("/", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, activityNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const activity = await Activity.create(req.body);
        return res.status(201).json({ activity });
    } catch (err) {
        return next(err);
    }
});

/** GET / [id] => { activity }
 * 
 */
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        const activity = await Activity.get(req.params.id);
        if (activity) {
            return res.json({ activity });
        } else {
            throw new NotFoundError();
        }
    } catch (err) {
        return next(err);
    }
});

/** PATCH / [activity] { activity } => { activity }
 *  title and description for now
 */
router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, activityUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
    const activity = await Activity.update(req.params.id, req.body);
    console.log('patch', activity);

    return res.json({ activity });

    } catch (err) {
        return next(err);
    }
});

/** DELETE / [activity] => { deleted: activity }
 * 
 */
router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
        await Activity.remove(req.params.id);
        return res.json({ deleted: req.params.username });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;