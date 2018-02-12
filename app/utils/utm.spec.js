'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');

const utm = require('./utm')

describe('utm Tests', () => {

    it.only('should get the zone correctly', () => {
        const zone = utm.getZone(10)
        console.log('zone', zone)
    })

});