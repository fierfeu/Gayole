'use strict'

const fs = require('fs');

const { JSDOM } = require ('jsdom');

const chai = require('chai');
var expect = chai.expect;

describe('[JSDOM API] : fromFile canary test',()=>{
    it ('return good DOM',()=>{
        fs.writeFileSync("testFile.html",
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hello</title>
            </head><body><p>Hi</p>\n</body></html>`,
        'utf8');

        return JSDOM.fromFile("testFile.html").then(dom => {
            expect(dom.serialize()).to.equal(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hello</title>
            </head><body><p>Hi</p>\n</body></html>`);
          });
    });
});