import scenario from '../../../src/Client/mjs/scenario.mjs';

import chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon';
import jsdom from 'jsdom';
const {JSDOM} = jsdom;

const ScenariiListe =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];

sinon.restore();

describe ('[Scenario CLass] is instanciable',()=>{
    
    it('is possible to create a scenario instance with a scenarii Liste', ()=>{
        let loader = ()=>{};
        expect(() =>{new scenario()}).to.throw('No liste of scenarii provided');
        expect(() =>{new scenario('somethingwrong')}).to.throw('BAD liste of scenarii provided');
        expect(() =>{new scenario(ScenariiListe)}).to.not.throw();
        let scenar = new scenario(ScenariiListe);
        expect(scenar instanceof scenario).to.be.true;
        expect (()=>{new scenario(ScenariiListe,'false',loader)}).to.not.throw();
    })
});

describe('[scenario Class] allow to select a scenario and load content',()=>{
    //globalThis.window = globalThis;
    it('is possible to select a scenario from the liste only',()=>{
        globalThis.alert = (data) => {console.log(data)};
        
        globalThis.currentScenario = new scenario(ScenariiListe);
        sinon.spy(currentScenario,'showSelectInterface');
        sinon.spy(currentScenario,'loadData')
        globalThis.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        let requests=[];
        XMLHttpRequest.onCreate = (xhr) => {
            requests.push(xhr);
        }

        expect(()=>{currentScenario.select()}).to.not.throw();
        expect (requests.length).to.equal(1);
        requests[0].respond(200,'','{"value":"toVerify"}');
        expect(currentScenario.showSelectInterface.calledOnce).to.be.true;
        expect(currentScenario.loadData.calledOnceWith(ScenariiListe[0][2])).to.be.true;
        expect(currentScenario.selectInterface).to.undefined;
        expect (currentScenario.loader).to.undefined;
        
        currentScenario.showSelectInterface.restore();
        currentScenario.loadData.restore();
        globalThis.alert = globalThis.currentScenario=undefined;
    });

    it('has a function to parse json comming fromXMLHttp',()=>{
        
        globalThis.currentScenario = new scenario(ScenariiListe);
        let jsonHttp = {"status":200,"responseText":'{"value":"ToVerify"}'};
        let badJsonHttp = {"status":404,"responseText":"ToVerify"};

        expect(()=>{currentScenario.respParse.call(badJsonHttp)}).to.throw('ERROR bad File URL or FILE unavailable');
        expect(()=>{currentScenario.respParse.call(jsonHttp)}).to.not.throw();
        expect(currentScenario.data.value).to.equal("ToVerify");

        globalThis.currentScenario=undefined;
    });

    it('a scenario json file is loaded with XMLHttpRequest',()=>{

        globalThis.currentScenario = new scenario(ScenariiListe);

        var requests = [];
        globalThis.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        XMLHttpRequest.onCreate = (xhr) => {
            requests.push(xhr);
        }
        sinon.spy(currentScenario,'respParse');

        currentScenario.loadData(currentScenario.scenarii[0][2]);
        expect (requests.length).to.equal(1);
        requests[0].respond(200,'','{"value":"toVerify"}');
        expect (currentScenario.respParse.calledOnce).to.be.true;
        expect (currentScenario.data.value).to.equal("toVerify");

        currentScenario.respParse.restore();
        globalThis.XMLHttpRequest= undefined;
        globalThis.currentScenario=undefined;
    });

    it('a scenario is stored using a loader function',()=>{
        let ScenarioLocalLoader = ()=> {};
        globalThis.currentScenario = new scenario(ScenariiListe, false, ScenarioLocalLoader);

        var requests = [];
        globalThis.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        XMLHttpRequest.onCreate = (xhr) => {
            requests.push(xhr);
        }
        sinon.spy(currentScenario,'loader');

        currentScenario.loadData(currentScenario.scenarii[0][2]);
        expect (requests.length).to.equal(1);
        requests[0].respond(200,'','{"value":"toVerify"}');

        expect (currentScenario.loader.calledOnce).to.be.true;

        currentScenario.loader.restore();
        globalThis.XMLHttpRequest= undefined;
        globalThis.currentScenario=undefined;
    });
});