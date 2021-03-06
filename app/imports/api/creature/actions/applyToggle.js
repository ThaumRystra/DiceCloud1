import evaluateString from '/imports/api/creature/computation/afterComputation/evaluateString.js';

export default function applyToggle({
  prop,
  creature,
  actionContext,
  log,
}){
  let scope = {
    ...creature.variables,
    ...actionContext,
  };
  if (Number.isFinite(+prop.condition)){
    return !!+prop.condition;
  }
  var {result} = evaluateString({
    string: prop.condition,
    scope,
    fn: 'reduce'
  });
  if (result.constructor.name === 'ErrorNode') {
    log.content.push({
      name: 'Toggle error',
      error: result.toString(),
    });
    return false;
  }
  log.content.push({
    name: prop.name || 'Toggle',
    resultPrefix: prop.condition + ' = ',
    result: result.toString(),
  });
  return !!result.value;
}
