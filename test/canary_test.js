"use strict"

const expect = require('chai').expect;

describe("canary test to verify that test framework is available", () => {
    it("should pass true = true test", () => {
        expect (true).to.eq(true);
    })
})
