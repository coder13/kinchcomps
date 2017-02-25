module.exports.getComps = () => fetch('http://m.cubecomps.com/competitions.json').then(data => data.json());
module.exports.getPastComps = () => fetch('http://m.cubecomps.com/competitions/past.json').then(data => data.json());
module.exports.getEvents = (compId) => fetch(`http://m.cubecomps.com/competitions/${compId}/events.json`).then(data => data.json());
module.exports.getResults = (compId, event, round) => fetch(`http://m.cubecomps.com/competitions/${compId}/events/${event}/rounds/${round}/results.json`).then(data => data.json());
module.exports.getCompetitors = (compId) => fetch(`http://m.cubecomps.com/competitions/${compId}/competitors.json`).then(data => data.json());
