import zone from '../../../src/Client/mjs/zone.mjs';
import unit from '../../../src/Client/mjs/unit.mjs';

import chai from 'chai';
const expect = chai.expect;

import jsdom from 'jsdom';
const {JSDOM} = jsdom;

describe('[Module zone] it is possible to instanciate a zone',()=>{
    let document;
    before (()=>{
        let HTML = "<body><div id='test'><map><area id='testArea'></area></map></div></body>";
        document = new JSDOM(HTML).window.document;
    });
    
    it('throw error when trying to instanciate without an HTMLElement and a name',()=>{
        expect(()=>{new zone()}).to.throw();
        expect(()=>{new zone('something but an HTMLElement')}).to.throw();
        const div = document.getElementById('test');
        expect(()=>{new zone(div)}).to.throw();
        expect(()=>{new zone('something but an HTMLElement','zone name')}).to.throw();
        expect(()=>{new zone(div,'zone name')}).to.not.throw();
        const area = document.getElementById('testArea');
        let areaZone;
        expect(()=>{areaZone = new zone(area,'zone name')}).to.not.throw();
        expect(areaZone).to.be.instanceOf(zone);
        expect(areaZone.name).to.equal('zone name');
    });

    it('is possible to add game data to a zone with a value object',()=>{
        const div = document.getElementById('test');
        const values = {'terrain':'oasis','aeroport': true};
        expect(()=>{new zone(div,'zone name','bad values')}).to.throw('ERROR additional values must be stored in an object');
        expect(()=>{new zone(div,'zone name',values)}).to.not.throw();
        const area = document.getElementById('testArea');
        let areaZone;
        expect(()=>{areaZone = new zone(area,'zone name',values)}).to.not.throw();
        expect(areaZone.terrain).to.equal('oasis');
        expect(areaZone.aeroport).to.true;
    });
});

describe ('[Module zone] allow to add links/roads between 2 zones',()=>{
    let document,div,area;
    before (()=>{
        let HTML = "<body><div id='test'><map><area id='testArea'></area></map></div></body>";
        document = new JSDOM(HTML).window.document;
        div = document.getElementById('test');
        area = document.getElementById('testArea');
    });

    it('is possible to create movable links between to zone instance',()=>{
        const divZone = new zone(div,'zone div');
        const areaZone = new zone(area,'zone area');
        const otherZone = new zone(div,'zone div');
        const cost =2;
        divZone.linkTo(areaZone,cost);
        expect(divZone.connections[areaZone.name]).to.equal(cost);
        expect(divZone.moveAllowedTo(otherZone)).to.be.equal('not linked');
        expect(divZone.moveAllowedTo(areaZone)).to.equal(cost);
    });

    it('verify that good data are provided to create links',()=>{
        const areaZone = new zone(area,'zone area');
        expect(() => {areaZone.linkTo()}).to.throw();
        expect(() => {areaZone.linkTo('bad data')}).to.throw();
        expect(() => {areaZone.linkTo(areaZone)}).to.throw('ERROR no reflexive link allowed');
        const divZone = new zone(div,'zone div');
        expect( () => {areaZone.linkTo(divZone)}).to.not.throw();
        expect(areaZone.connections[divZone.name]).to.equal(0);
    })
});

describe ('[Module zone] allow to attach unit instance to a zone and to read all units attached to',()=>{
    let document,div,area;
    before (()=>{
        let HTML = "<body><div id='test'><map><area id='testArea'></area></map></div></body>";
        document = new JSDOM(HTML).window.document;
        div = document.getElementById('test');
        area = document.getElementById('testArea');
    });
    
    it('is possible to attach a unit to a zone',()=>{
        const divZone = new zone(div,'zone DIV');
        let goodImages = {};
        goodImages['recto']='/recto123.png';
        const myUnit = new unit(goodImages,'myUnit','unit for test only');
        expect (()=>{divZone.attach('bad Unit')}).to.throw('ERROR you try to attach something wich is not a unit');
        expect (()=>{divZone.attach(myUnit)}).to.not.throw();
        expect(divZone.units[myUnit.name].images['recto']).to.equal('/recto123.png');
    })

    it('is possible to verify if a unit is in a zone',()=>{
        const divZone = new zone(div,'zone DIV');
        let goodImages = {};
        goodImages['recto']='/recto123.png';
        const myUnit = new unit(goodImages,'myUnit','unit for test only');
        divZone.attach(myUnit);
        expect(()=>{divZone.isInZone()}).to.throw('ERROR isInZone fct : you must provide at least a unit to test');
        expect(()=>{divZone.isInZone('unit Name')}).to.throw('ERROR isInZone fct can only test valide unit instance');
        expect(divZone.isInZone(myUnit)).to.be.true;
        const badUnit = new unit( goodImages,'badUnit','this unit is not in the zone');
        expect(divZone.isInZone(badUnit)).to.be .false;
    })

    it('is possible to physicaly Move an attached unit to a linked zone',()=>{
        const divZone = new zone(div,'zone DIV');
        const areaZone = new zone(area,'zone AREA');
        let goodImages = {};
        goodImages['recto']='/recto123.png';
        const myUnit = new unit(goodImages,'myUnit','unit for test only');
        let result;
        divZone.attach(myUnit);
        expect(()=>{divZone.moveTo()}).to.throw('ERROR you must specify at least a destination zone');
        expect(()=>{divZone.moveTo(myUnit)}).to.throw('ERROR you must specify at least a valid destination zone');
        expect(()=>{divZone.moveTo(areaZone)}).to.not.throw();
        expect(()=>{divZone.moveTo(myUnit,areaZone)}).to.throw('ERROR the good parameter order is areaZone and MyUnit');
        expect(()=>{result = divZone.moveTo(areaZone,myUnit)}).to.not.throw();
        expect(result).to.be.false;
        divZone.linkTo(areaZone,3);
        expect(()=>{result = divZone.moveTo(areaZone,myUnit)}).to.not.throw();
        expect(result).to.be.true;
        expect(divZone.units[myUnit.name]).to.be.undefined;
        expect(areaZone.units[myUnit.name].images['recto']).to.equal('/recto123.png');
    });
});