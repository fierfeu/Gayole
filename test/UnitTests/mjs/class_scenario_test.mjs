import scenario from '../../../src/Client/mjs/scenario.mjs';

import chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon';

const ScenariiListe =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];

describe ('[Scenario CLass] is instanciable',()=>{
    it('is possible to create a scenario instance with a scenarii Liste', ()=>{
        expect(() =>{new scenario()}).to.throw('No liste of scenarii provided');

        expect(() =>{new scenario('somethingwrong')}).to.throw('BAD liste of scenarii provided');
        expect(() =>{new scenario(ScenariiListe)}).to.not.throw();
        let scenar = new scenario(ScenariiListe);
        expect(scenar instanceof scenario).to.be.true;
    })
});

describe('[scenario Class] allow to select a scenario and load content',()=>{
    it('is possible to select a scenario from the liste',()=>{
        
        let scenar = new scenario(ScenariiListe);
        sinon.spy(scenar,'showSelectInterface');
        sinon.spy(scenar,'loadData')
        expect(()=>{scenar.select()}).to.not.throw();
        expect(scenar.showSelectInterface.calledOnce).to.be.true;
        expect(scenar.loadData.calledOnceWith(ScenariiListe[0][2])).to.be.true;
        expect(scenar.data).to.exist;
        expect(eval(scenar.data)).to.exist; //means a valid JSON structure ;-)
        scenar.showSelectInterface.restore();
        scenar.loadData.restore();
    })
});