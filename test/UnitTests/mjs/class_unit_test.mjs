import unit from '../../../src/Client/mjs/unit.mjs';

import chai from 'chai';
const expect = chai.expect;

describe ('[Module unit] is instaciable with array of images, a name and a description',()=>{
    it('throw error if bad instanciation',()=>{
        expect (()=>{new unit();}).to.throw();
        const images=[];
        expect(()=>{new unit(images);}).to.throw();
        const name = 'unit name';
        expect (()=>{new unit(images, name)}).to.throw();
        const description ='unit description text';
        expect (()=>{new unit(images,name,description)}).to.not.throw();
    });

    it('instanciate good unit with good minimum set of data',()=>{
        const images = 'bad data';
        expect (()=>{new unit(images, 'myUnit','unit for test only')}).to.throw('ERROR : Bad data to instanciate a unit object images is not an array');
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