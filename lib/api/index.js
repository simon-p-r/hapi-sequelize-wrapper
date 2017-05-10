'use strict';

const DataStore = require( './handlers.js');


module.exports = [

    {
        method: 'GET',
        path: '/ds/{database}/{table}',
        config: {
            handler: DataStore.getRecords
        }
    },
    {
        method: 'GET',
        path: '/ds/{database}/{table}/count',
        config: {
            handler: DataStore.getCount
        }
    },
    // {
    //     method: 'GET',
    //     path: '/ds/{database}/{table}/keys',
    //     config: {
    //         handler: DataStore.getKeys
    //     }
    // },
    {
        method: 'GET',
        path: '/ds/{database}/{table}/{id}',
        config: {
            handler: DataStore.getRecordByID
        }
    },
    {
        method: 'DELETE',
        path: '/ds/{database}/{table}',
        config: {
            handler: DataStore.deleteAllRecords
        }
    },
    {
        method: 'DELETE',
        path: '/ds/{database}/{table}/{id}',
        config: {
            handler: DataStore.deleteRecordbyID
        }
    },
    // {
    //     method: 'DELETE',
    //     path: '/ds/{database}/{table}',
    //     config: {
    //         handler: DataStore.deleteByQuery
    //     }
    // },

    {
        method: 'POST',
        path: '/ds/{database}/{table}',
        config: {
            handler: DataStore.insertOne
        }
    },
    // {
    //     method: 'PUT',
    //     path: '/ds/{database}/{table}/{id}',
    //     config: {
    //         handler: DataStore.replaceRecordByID
    //     }
    // },
    // {
    //     method: 'PATCH',
    //     path: '/ds/{database}/{table}/{id}',
    //     config: {
    //         handler: DataStore.updateRecordByID
    //     }
    // },
    {
        method: 'POST',
        path: '/ds/{database}/{table}/batch',
        config: {
            handler: DataStore.insertMany
        }
    }


];
