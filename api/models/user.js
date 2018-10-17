'use strict'

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var AWS = require("aws-sdk");
var uuid = require('uuid');

exports.create = function (db, user, callback) {
    AWS.config.update({
        accessKeyId: process.env.KEYID,
        secretAccessKey: process.env.SECRETKEYID
    });
    AWS.config.region = "us-west-2"; //us-west-2 is Oregon
    var ddb = new AWS.DynamoDB();
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "users",
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email": user.name
        }
    };

    docClient.query(params, function (err, data) {
        console.log(data.Items.length);
        if (data.Items.length > 0) callback(false);
    });

    var params = {
        TableName: 'users',
        Item: {
            "email": { "S": user.name },
            "password": { "S": user.password },
            "firstName": { "S": user.firstName },
            "lastName": { "S": user.lastName }
        }
    };

    ddb.putItem(params, function (err, data) {
        if (err) {
            callback("Error", err);
        } else {
            callback("Success", params);
        }
    });

};

exports.login = function (db, user, callback) {
    AWS.config.update({
        accessKeyId: process.env.KEYID,
        secretAccessKey: process.env.SECRETKEYID
    });
    AWS.config.region = "us-west-2"; //us-west-2 is Oregon
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "users",
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email": user.name
        }
    };

    docClient.query(params, function (err, data) {
        if (data.Items.length == 0) callback({ status: "NOT_FOUND" });
        else {
            data.Items.forEach(function (item) {
                let dbUser = data.Items[0];
                var passwordIsValid = bcrypt.compareSync(user.password, dbUser.password);
                if (!passwordIsValid) callback({ status: "WRONG" });
                else callback({
                    status: "OK",
                    value: jwt.sign({ id: user.name }, config.key, {
                        expiresIn: 86400
                    })
                });
            });
        }
    });
}