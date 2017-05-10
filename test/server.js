'use strict';

const Hapi = require('hapi');
const Plugin = require('../lib/index');

exports.start = (config, cb) => {

    const server = new Hapi.Server({
        connections: {
            routes: {
                json: {
                    space: 4
                },
                payload: {
                    output: 'data',
                    parse: true
                }
            }
        }
    });

    server.connection({
        port: 3000,
        host: 'localhost'
    });

    const plugin = {
        register: Plugin,
        options: config.plugin
    };

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            return reply({ status: 'ok', time: Date.now() });
        }
    });

    server.register(plugin, (err) => {

        if (err) {
            return cb(err, null);
        }

        server.start((err) => {

            if (err) {
                return cb(err, null);
            }
            return cb(null, server);
        });
    });
};

