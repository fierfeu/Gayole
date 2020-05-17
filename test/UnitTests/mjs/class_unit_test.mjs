import unit from '../../../src/Client/mjs/unit.mjs';
import { unitSet } from '../../../src/Client/mjs/unit.mjs';

import chai from 'chai';
const expect = chai.expect;

describe ('[Module unit] is instaciable with objetc of images, a name and a description',()=>{
    it('throw error if bad instanciation',()=>{
        expect (()=>{new unit();}).to.throw();
        const images= new Object;
        expect(()=>{new unit(images);}).to.throw();
        const name = 'unit name';
        expect (()=>{new unit(images, name)}).to.throw();
        const description ='unit description text';
        expect (()=>{new unit(images,name,description)}).to.not.throw();
    });

    it('instanciate good unit with good minimum set of data',()=>{
        const images = 'bad data';
        expect (()=>{new unit(images, 'myUnit','unit for test only')}).to.throw('Bad data to instanciate a unit must used an object images');
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const goodUnit = new unit(goodImages,'myUnit','unit for test only');
        expect(goodUnit.images['verso']).to.equal('/verso123.png');
        expect(goodUnit.name).to.equal('myUnit');
        expect(goodUnit.description).to.equal('unit for test only');
        let data={'code':'CODE','action':()=>{},'cost':2};
        expect(()=>{goodUnit.addAction(data)}).to.not.throw();
        expect(()=>{goodUnit.getActions()}).to.not.throw();
    });

    it('allow to instanciate with a set of additional values tansformes into objetc properties',()=>{
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const values = {'VA':1,'dpl':3,'veteran':true};
        const goodUnit = new unit(goodImages,'myUnit','unit for test only',values);
        expect(goodUnit.VA).to.equal(1);
        expect(goodUnit.dpl).to.equal(3);
        expect(goodUnit.veteran).to.equal(true);
    });
});

describe('[Module Unit] allow to add action to a instance of unit',()=>{
    it('is possible to add actions to a instance of unit',()=>{
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const goodUnit = new unit(goodImages,'myUnit','unit for test only');
        let data = {};
        expect(()=>{goodUnit.addAction(data);}).to.throw();
        data ={'code':'CODE'}
        expect(()=>{goodUnit.addAction(data);}).to.throw();
        data={'code':'CODE','action':()=>{}};
        goodUnit.addAction(data);
        expect(goodUnit.actions.length).to.equal(1);
        expect(goodUnit.actions[0].code).to.equal('CODE');
        expect(goodUnit.actions[0].action.toString()).to.equal('()=>{}');
        data={'code':'CODE','action':()=>{},'cost':2};
        goodUnit.addAction(data);
        expect(goodUnit.actions.length).to.equal(2);
    });
});

describe('[Module unit] unitSet definition',()=>{
    it('is possible to insatanciate some unitSet wich must be instanceof unit too',()=>{
        let myUnitSet;
        expect (()=>{new unitSet();}).to.throw();
        const images=[];
        expect(()=>{new unitSet(images);}).to.throw();
        const name = 'unit name';
        expect (()=>{new unitSet(images, name)}).to.throw();
        const description ='unit description text';
        expect (()=>{myUnitSet = new unitSet(images,name,description)}).to.not.throw();
        expect(myUnitSet instanceof unit).to.be.true;
        expect(myUnitSet instanceof unitSet).to.be.true;
    });

    it('is possible to attach units to a unitSet',()=>{
        let units=[];
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const goodUnit1 = new unit(goodImages,'myUnit1','unit for test only');
        const goodUnit2 = new unit(goodImages,'myUnit2','unit for test only');
        units.push(goodUnit1);
        units.push(goodUnit2);
        let myUnitSet;
        expect (()=>{myUnitSet = new unitSet(goodImages,'myUnitSet','this could be a patrol',units)}).to.not.throw();
        expect(myUnitSet.units[goodUnit1.name].images['recto']).to.equal('/recto123.png');
    });

    it('is possible to attach some units to an instanciate unitSet',()=>{
        let units=[];
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const goodUnit1 = new unit(goodImages,'myUnit1','unit for test only');
        const goodUnit2 = new unit(goodImages,'myUnit2','unit for test only');
        units.push(goodUnit1);
        units.push(goodUnit2);
        let myUnitSet;
        let result;
        expect (()=>{myUnitSet = new unitSet(goodImages,'myUnitSet','this could be a patrol',units)}).to.not.throw();
        expect(()=>{myUnitSet.attach()}).to.throw();
        expect(()=>{myUnitSet.attach('blabla')}).to.throw('ERROR you must provide a valide array of unit');
        expect(()=>{result = myUnitSet.attach(units)}).to.not.throw();
        expect(result).to.equal(units.length);
        expect(myUnitSet.units[goodUnit1.name].images['recto']).to.equal('/recto123.png');
    });

    it('is possible to detach some units to an instanciate uniSet',()=>{
        let units=[];
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const goodUnit1 = new unit(goodImages,'myUnit1','unit for test only');
        const goodUnit2 = new unit(goodImages,'myUnit2','unit for test only');
        units.push(goodUnit1);
        units.push(goodUnit2);
        let myUnitSet;
        let result;
        expect (()=>{myUnitSet = new unitSet(goodImages,'myUnitSet','this could be a patrol')}).to.not.throw();
        expect(()=>{myUnitSet.detach()}).to.throw();
        expect(()=>{myUnitSet.detach('blabla')}).to.throw('ERROR you must provide a valide array of unit');
        expect(()=>{result = myUnitSet.detach(units)}).to.not.throw();
        expect(result).to.equal(0);
        myUnitSet.attach(units);
        expect(()=>{result = myUnitSet.detach(units)}).to.not.throw();
        expect(result).to.equal(units.length);
        expect(myUnitSet.units[goodUnit1.name]).to.be.undefined;
    });
});