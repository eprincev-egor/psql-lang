"use strict";

const config = {
    recursive: true,
    exit: true,
    spec: [
        "lib/**/*.spec.ts"
    ],
    require: [
      "source-map-support/register",
      "ts-node/register"
    ]
};

module.exports = config;