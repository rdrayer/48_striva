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

/** GET all activities todo map through activities
 */
router.get("/:username", async function (req, res, next) {
    try {
        const username = req.params.username;
        const activities = await Activity.findAll(username);
        return res.json({ activities });
    } catch (err) {
        return next(err);
    }
});

/** POST / { activity } => { activity }
 * 
 */
router.post("/:username/new", async function (req, res, next) {
    try {
        req.body.activityDateTime = req.body.activityDateTime || new Date().toISOString();
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
router.get("/:id", async function (req, res, next) {
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