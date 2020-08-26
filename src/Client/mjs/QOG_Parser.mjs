import scenario from './scenario.mjs';

const parserDef =[["name"],["LRDG","Axis"],["roundNb","returnZone"]];
const OPPONENT_NAME = 1;
const VICOND =2;
export const parserOpponentDef = ["units","detachments","patrols","localisations"];

export function Parser (data,manager) {
    if(!data) throw ('ERROR no scenario data to parse : no scenario initiated');
    if(!(typeof(data)==='object')) throw ('ERROR badly formated scenario data to parse: no scenario initiated');
    
    if(!data.hasOwnProperty('description')) throw ('ERROR badly formated object : keys are missing: no scenario description Object');
    if(!data.hasOwnProperty('conditions')) throw ('ERROR badly formated object : keys are missing: no vitory conditions defined');
    let currentScenario={};
    currentScenario.opponent=[];
    currentScenario.opponent[0]=2;
    currentScenario.opponent[1] = parserDef[OPPONENT_NAME][0];
    currentScenario.opponent[2] = parserDef[OPPONENT_NAME][1];
    if(!data.hasOwnProperty(currentScenario.opponent[1])) throw ('ERROR badly formated object : keys are missing: no opponent name for side: '+currentScenario.opponent[1]);
    if(!data.hasOwnProperty(currentScenario.opponent[2])) throw ('ERROR badly formated object : keys are missing: no opponent name for side: '+currentScenario.opponent[2]);
    
    if(!data.description.hasOwnProperty('name')) throw ('ERROR badly formated object : keys are missing: no scenario name in description');
    currentScenario.description = data.description;
    for (let i=0;i<parserDef[VICOND].length;i++) {
        if(!data.conditions.hasOwnProperty(parserDef[VICOND][i])) throw ('ERROR badly formated object : keys are missing: no '+ parserDef[VICOND][i]+' in victory conditions');
    }
    currentScenario.conditions = data.conditions;

    for (let i=1;i<=currentScenario.opponent[0];i++) {
        currentScenario.opponent[i]=[parserDef[OPPONENT_NAME][i-1],data[parserDef[OPPONENT_NAME][i-1]]];
        for (let j=0; j< parserOpponentDef.length;j++) {
            if(!currentScenario.opponent[i][1].hasOwnProperty(parserOpponentDef[j])) 
                throw ('ERROR badly formated object : keys are missing: no '+parserOpponentDef[j]+' definition for opponent: '+currentScenario.opponent[i][0]);
        }
    };
    if(manager) {
        manager.currentScenario = new scenario();
        manager.currentScenario.addScenarioData(currentScenario);
    } else {
        return currentScenario;
    }
}