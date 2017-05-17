'use strict';

const Boom = require('boom');
const DataStoreMgr = require('sequelize-wrapper');

const DataStoreApis = require('./api');
const Pkg = require('../package.json');

exports.register = function (plugin, options, next) {

    let dataStore = null;
    try {
        dataStore = new DataStoreMgr(options);
    }
    catch (e) {
        return next(e);
    }

    plugin.route(DataStoreApis);
    plugin.decorate('server', 'dataStore', dataStore);
    plugin.decorate('request', 'dataStore', dataStore);
    plugin.ext('onPreStart', (server, cb) => {

        dataStore.connect((err) => {

            if (err) {
                return cb(err);
            }

            server.app.dataStore = dataStore;
            return cb(null);

        });
    });

    plugin.ext('onPreStop', (server, cb) => {

        dataStore.close((err) => {

            // $lab:coverage:off$
            if (err) {
                return cb(err);
            }
            // $lab:coverage:on$

            return cb();

        });
    });

    plugin.ext('onPreHandler', (request, reply) => {

        if (request.params.database) {
            const dbs = request.dataStore.dbs;
            const databaseName = Object.keys(dbs).map((e) => {

                return e;
            }).indexOf(request.params.database);

            if (databaseName === -1 ) {
                return reply(Boom.badRequest(`Invalid database name ${request.params.database}`));
            }

            const dbName = request.params.database;
            const tables = request.dataStore.dbs[dbName].tables;

            if (request.params.table) {
                const tableName = Object.keys(tables).map((e) => {

                    return e;
                }).indexOf(request.params.table);

                if (tableName === -1 ) {
                    return reply(Boom.badRequest(`Invalid table name ${request.params.table}`));
                }

                const tName = request.params.table;
                request.app.table = tables[tName];
                return reply.continue();
            }

            return reply.continue();


        }
        return reply.continue();

    });

    return next();

};


exports.register.attributes = {
    name: Pkg.name,
    version: Pkg.version
};
