'use strict';

const Code = require('code');
const Hoek = require('hoek');
const Lab = require('lab');

const Server = require('./server');

// Fixtures
const Config = require('./config');

// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
// const beforeEach = lab.beforeEach;
const expect = Code.expect;


describe('Plugin', () => {


    const dbName = 'test_db';
    const tableName = 'supplier';

    it('should return an error when it fails to connect to database due to invalid port', (done) => {

        const invalid = Hoek.clone(Config);
        invalid.plugin.dbOpts.port = 5000;
        Server.start(invalid, (err, server) => {

            expect(err).to.exist();
            expect(server).to.not.exist();
            done();

        });
    });

    it('should load plugin and start server', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            server.stop(done);

        });
    });

    it('should byPass plugin onPreHandler handler if getting another route', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            server.inject('/', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.status).to.equal('ok');
                server.stop(done);
            });
        });
    });

    it('should fail to insertOne due to invalid database name', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            const req = {
                method: 'POST',
                url: '/ds/database/table',
                payload: null
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('Invalid database name database');
                server.stop(done);
            });
        });
    });

    it('should fail to insertOne due to invalid table name', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            const req = {
                method: 'POST',
                url: `/ds/${dbName}/table`,
                payload: Config.rec
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('Invalid table name table');
                server.stop(done);
            });
        });
    });


    it('should succeed insertOne due to correct payload', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            const req = {
                method: 'POST',
                url: `/ds/${dbName}/${tableName}`,
                payload: Config.record
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.name).to.equal('Fujikisu Corporation');
                server.stop(done);
            });
        });
    });

    it('should fail to insertOne due to duplicate primaryKey', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            const req = {
                method: 'POST',
                url: `/ds/${dbName}/${tableName}`,
                payload: Config.record
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(409);
                expect(res.result.message).to.equal(`Error inserting record into database name "${dbName}" table name "${tableName}" due to duplicate key`);
                server.stop(done);
            });
        });
    });

    it('should succeed insertMany due to correct payload', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();
            const req = {
                method: 'POST',
                url: `/ds/${dbName}/${tableName}/batch`,
                payload: Config.records
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result[0].name).to.equal('Goodfellows inc.');
                server.stop(done);
            });
        });
    });

    it('should fail to find due to invalid database name', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject('/ds/database/table', (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('Invalid database name database');
                server.stop(done);
            });
        });
    });


    it('should fail to find due to invalid database name', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject(`/ds/${dbName}/table`, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('Invalid table name table');
                server.stop(done);
            });
        });
    });


    it('should succeed to find and return an array of recs', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject(`/ds/${dbName}/${tableName}`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                server.stop(done);
            });
        });
    });

    it('should fail findById due to invalid id', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject(`/ds/${dbName}/${tableName}/invalid`, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.equal('Error finding id "invalid" from database name test_db and table name supplier');
                server.stop(done);
            });
        });
    });

    it('should successfully call findById with valid id', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject(`/ds/${dbName}/${tableName}/Goodfellows inc.`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.rec.name).to.equal('Goodfellows inc.');
                server.stop(done);
            });
        });
    });


    it('should successfully call count endpoint', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject(`/ds/${dbName}/${tableName}/count`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.count).to.be.a.number();
                server.stop(done);
            });
        });
    });


    it('should fail deleteById due to invalid id', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            const req = {
                method: 'DELETE',
                url: `/ds/${dbName}/${tableName}/invalid`
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.equal(`Error deleting id "invalid" from database name ${dbName} and table name ${tableName}`);
                server.stop(done);
            });
        });
    });

    it('should successfully call deleteById with valid id', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            const req = {
                method: 'DELETE',
                url: `/ds/${dbName}/${tableName}/Goodfellows inc.`
            };

            server.inject(req, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.deleted).to.equal(1);
                server.stop(done);
            });
        });
    });

    it('should successfully call deleteAllRecords', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            const req = {
                method: 'DELETE',
                url: `/ds/${dbName}/${tableName}`
            };

            server.inject(req, (res) => {

                // TODO fix problem with deleting all not returning
                expect(res.statusCode).to.equal(200);
                expect(res.result.status).to.equal('ok');
                server.stop(done);
            });
        });
    });

    it('should get all database names', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject('/ds/database/names', (res) => {

                // TODO fix problem with deleting all not returning
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array().and.have.length(1);
                server.stop(done);
            });
        });
    });

    it('should get all table names for associated database', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject('/ds/database/test_db/tables', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array().and.have.length(1);
                server.stop(done);
            });
        });
    });

    it('should get a table schema', (done) => {

        Server.start(Config, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.exist();

            server.inject('/ds/database/test_db/supplier', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();
                server.stop(done);
            });
        });
    });


});




