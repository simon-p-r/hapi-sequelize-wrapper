'use strict';


module.exports = {

    plugin: {
        dbOpts: {
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: process.env.PGPASSWORD,
            dialect: 'postgres',
            logging: false,
            sync: true,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        },
        dbs: {
            test_db: {
                tables: {
                    supplier: {
                        name: {
                            type: 'string',
                            length: 40,
                            primaryKey: true
                        },
                        address_street: {
                            type: 'string',
                            length: 255
                        },
                        address_city: {
                            type: 'string',
                            length: 40
                        },
                        address_postal_code: {
                            type: 'string',
                            length: 20
                        },
                        address_country: {
                            type: 'string',
                            length: 20
                        }
                    }
                }
            }
        }
    },

    records: [{
        name: 'Goodfellows inc.',
        address_street: '9001 Upper Avenue',
        address_city: 'New Jersey',
        address_postal_code: '987-098-456',
        address_country: 'US'
    },
    {
        name: 'Acme International',
        address_street: '1234 Main Street',
        address_city: 'Springfield',
        address_postal_code: '123-456-789',
        address_country: 'US'
    },
    {
        name: 'Putin\'s Vodka',
        address_street: 'Comrade Boulevard',
        address_city: 'Moscow',
        address_postal_code: '119361',
        address_country: 'RU'
    }],

    record: {
        name: 'Fujikisu Corporation',
        address_street: 'Shinjuku Chuo Park',
        address_city: 'Tokoyo',
        address_postal_code: '160-0023',
        address_country: 'JP'
    }

};
