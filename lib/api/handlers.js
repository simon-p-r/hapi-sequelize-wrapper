'use strict';

const Boom = require('boom');


module.exports = {

    getDbNames: function (request, reply) {

        const dbs = request.dataStore.getDbNames();
        return reply(dbs);

    },

    getTables: function (request, reply) {

        const tableNames = request.dataStore.getTableNames(request.params.database);
        return reply(tableNames);

    },

    getTableSchema: function (request, reply) {

        const tableSchema = request.dataStore.getTableSchema(request.params.database, request.params.table);
        // if (tableSchema === null) {
        //     return reply(Boom.notFound(`Error finding schema from database name "${request.params.database}" and table name "${request.params.table}"`));
        // }
        return reply(tableSchema);
    },


    getRecords: function (request, reply) {

        const Table = request.app.table;
        const tableName = request.params.table;

        Table.find({}, (err, recs) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badGateway(`Error reading records from table name ${tableName}`));
            }
            // $lab:coverage:on$

            return reply(recs);

        });
    },

    getCount: function (request, reply) {

        const Table = request.app.table;
        const tableName = request.params.table;


        Table.count({}, (err, count) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badGateway(`Error reading records from table name ${tableName}`));
            }
            // $lab:coverage:on$

            return reply({ count });

        });


    },


    getKeys: function (request, reply) {



    },

    getRecordByID: function (request, reply) {

        const Table = request.app.table;
        const dbName = request.params.database;
        const tableName = request.params.table;

        Table.findById(request.params.id, {}, (err, rec) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badGateway(`Error reading records from table name ${tableName}`));
            }
            // $lab:coverage:on$

            if (!rec) {
                return reply(Boom.notFound(`Error finding id "${request.params.id}" from database name ${dbName} and table name ${tableName}`));
            }

            return reply({ rec });

        });

    },

    insertOne: function (request, reply) {

        const Table = request.app.table;
        const dbName = request.params.database;
        const tableName = request.params.table;

        Table.insertOne(request.payload, {}, (err, inserted) => {

            if (err) {

                // $lab:coverage:off$
                if (err.name === 'SequelizeValidationError') {
                    return reply(Boom.badData(`Error inserting record into database name "${dbName}" table name "${tableName}" due to invalid payload`));
                }

                if (err.name === 'SequelizeUniqueConstraintError') {
                    return reply(Boom.conflict(`Error inserting record into database name "${dbName}" table name "${tableName}" due to duplicate key`));
                }

                return reply(Boom.badGateway(`Error inserting record into database name: ${dbName} table name: ${tableName} due to internal error`));
                // $lab:coverage:on$
            }

            return reply(inserted);

        });

    },

    insertMany: function (request, reply) {

        const Table = request.app.table;
        const dbName = request.params.database;
        const tableName = request.params.table;

        Table.insertMany(request.payload, {}, (err, inserted) => {

            if (err) {

                // $lab:coverage:off$
                if (err.name === 'SequelizeValidationError') {
                    return reply(Boom.badData(`Error inserting record into database name "${dbName}" table name "${tableName}" due to invalid payload`));
                }

                if (err.name === 'SequelizeUniqueConstraintError') {
                    return reply(Boom.conflict(`Error inserting record into database name "${dbName}" table name "${tableName}" due to duplicate key`));
                }

                return reply(Boom.badGateway(`Error inserting record into database name: ${dbName} table name: ${tableName} due to internal error`));
                // $lab:coverage:on$
            }

            return reply(inserted);
        });
    },

    deleteRecordbyID: function (request, reply) {

        const Table = request.app.table;
        const dbName = request.params.database;
        const tableName = request.params.table;

        Table.deleteById(request.params.id, {}, (err, deleted) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badGateway(`Error deleting record id ${request.params.id} into database name "${dbName}" table name "${tableName}"`));
            }
            // $lab:coverage:on$

            if (deleted === 0) {
                return reply(Boom.notFound(`Error deleting id "${request.params.id}" from database name ${dbName} and table name ${tableName}`));
            }

            return reply({ deleted });
        });

    },

    deleteAllRecords: function (request, reply) {

        const Table = request.app.table;
        const dbName = request.params.database;
        const tableName = request.params.table;

        Table.deleteMany({}, (err) => {

            // $lab:coverage:off$
            if (err) {
                return reply(Boom.badGateway(`Error deleting record id ${request.params.id} into database name "${dbName}" table name "${tableName}"`));
            }
            // $lab:coverage:on$

            return reply({ status: 'ok' });
        });

    }

};

