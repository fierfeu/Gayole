import Didacticiel from '../../../src/Client/mjs/Didacticiel.mjs';
import chai from 'chai';
const expect = chai.expect;

describe ('[DIDACTIC] base tests',() => {
    it('is possible to instanciate a didacticiel with just a file',()=>{
        expect(()=>{new Didacticiel()}).to.throw();
        expect(()=>{new Didacticiel('/path/to/file')}).to.not.throw();
    });
});