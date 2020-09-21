import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
import Didacticiel from '../../../src/Client/mjs/Didacticiel.mjs'
const expect = chai.expect;

describe ('[QOG DIDACTIC] didacticiel phase work well',()=>{
    //

    it('exist Didacticiel in QOG interface',()=>{
        expect(QOG.prototype.didacticiel).to.exist;
    });

    it('test that scenario use a didacticiel',()=>{
        
        expect(()=>{QOG.prototype.didacticiel()}).to.throw();

        let gameManager ={};
        expect(()=>{QOG.prototype.didacticiel.call(gameManager)}).to.throw();

        gameManager.currentScenario={'didacticiel':{'used':true,'file':'pathToFile'}};
        expect(()=>{QOG.prototype.didacticiel.call(gameManager)}).to.not.throw();
        expect(gameManager.didacticiel).to.exist;
        //expect(gameManager.didacticiel instanceof Didacticiel).to.true;
    });

    it('Verify that if scenario don\'t use didacticiel then no instance of didacticiel is declared',()=>{
        let gameManager ={};
        gameManager.currentScenario={'didacticiel':{'used':false}};
        expect(()=>{QOG.prototype.didacticiel.call(gameManager)}).to.not.throw();
        expect(gameManager.didacticiel).to.not.exist;
    })
});