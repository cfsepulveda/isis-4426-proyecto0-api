"use strict";

var Competitions = require("../models/competitions");

exports.list = function (req, res) {
    Competitions.list(req.getConnection, req.username, function (store) {
        if (store.list) res.json(store.list);
        else res.sendStatus(store.code);
    });
};

exports.create = function (req, res) {
    Competitions.create(req.getConnection, req.body, req.username, function (
        insertedId
    ) {
        if (!isNaN(insertedId)) {
            res.status(201).send({ ...req.body, id: insertedId });
            return;
        }
        if (insertedId && insertedId.message === "Error existing address") {
            res.status(400).send({ message: "Error existing address" });
            return;
        }
        else {
            res.status(400).send({ message: "Error creating the competition" });
            return;
        }
    });
};

exports.find = function (req, res) {
    Competitions.find(req.getConnection, req.params.competitionId, function (
        store
    ) {
        if (store.competition) res.json(store.competition);
        else res.sendStatus(store.code);
    });
};

exports.findByURL = function (req, res) {
    Competitions.findByURL(req.getConnection, req.params.url, function (store) {
        if (store.competition) res.json(store.competition);
        else res.sendStatus(store.code);
    });
};

exports.update = function (req, res) {
    Competitions.update(
        req.getConnection,
        req.body,
        req.params.competitionId,
        function (store) {
            if (store.code == 200)
                res.status(200).send({ id: req.params.competitionId, ...req.body });
            else res.sendStatus(store.code);
        }
    );
};

exports.delete = function (req, res) {
    Competitions.delete(req.getConnection, req.params.competitionId, function (store) {
        res.status(store.code).send({});
    });
};
