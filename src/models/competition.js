const State = require('ampersand-state');
const Collection = require('ampersand-collection');
const {compare} = require('../util');

const EventNames = {
  1: '333',
  2: '222',
  3: '444',
  4: '555',
  5: '666',
  6: '777',
  7: 'clock',
  10: 'minx',
  11: 'pyram',
  12: 'sq1',
  13: '333oh',
  14: '333ft',
  15: '333fm',
  16: '333bf',
  17: '444bf',
  18: '555bf',
  19: '333mbf',
  20: 'skewb',
};

const rank = {
  '333': 'average',
  '222': 'average',
  '444': 'average',
  '555': 'average',
  '666': 'average',
  '777': 'average',
  'clock': 'average',
  'minx': 'average',
  'pyram': 'average',
  'sq1': 'average',
  '333oh': 'average',
  '333ft': 'average',
  '333fm': 'average',
  '333bf': 'best',
  '444bf': 'best',
  '555bf': 'best',
  '333mbf': 'best',
  'skewb': 'average',
};

const convertToSeconds = function (time, event) {
  if (!time || !time.trim()) {
    return undefined;
  };

  if (time === 'DNF') {
    return -1;
  } else if (time === 'DNS') {
    return -2;
  } else if (event === '333mbf') {
    let cubes = time.split(String.fromCharCode(160))[0]; // freaking cubecomps................
    let solved = +cubes.split('/')[0];
    let attempted = +cubes.split('/')[1];
    let points = solved - (attempted - solved);
    let seconds = convertToSeconds(time.split(String.fromCharCode(160))[1]);
    return points + (360000 - seconds) / 360000;
  } else if (event === '333fm') {
    return +time;
  } else  {
    time = time.toString();
    return time === 'DNF' ? 0 : Math.round(100 * (time.indexOf(':') > -1 ? (60 * +time.split(':')[0] + +time.split(':')[1]) : +time));
  }
};

const getRankedResult = (result, event) => {
  return event === '333bf' ? result.best : (result.mean || result.average || result.best);
};

const Result = State.extend({
  props: {
    position: 'number',
    advanced: 'boolean',
    name: 'string',
    country: 'string',
    competitor_id: 'number',
    t1: 'number',
    t2: 'number',
    t3: 'number',
    t4: 'number',
    t5: 'number',
    average: 'number',
    average_record: 'string',
    best: 'number',
    best_record: 'string',
    event: 'string',
  },

  derived: {
    rankedResult: {
      deps: ['best', 'event'],
      fn: function () {
        return this[rank[this.event]];
      },
    },
    kinch: {
      deps: ['best'],
      fn: function () {
        if (!this.rankedResult || this.rankedResult < 0) {
          return 0;
        }

        return 100 * (this.event !== '333mbf' ? (this.collection.best().rankedResult / this.rankedResult) : (this.rankedResult / this.collection.best().rankedResult));
      },
    },
    placed: {
      deps: ['position'],
      fn: function () {
        return this.position <= 3;
      },
    },
  },

  parse (result, options) {
    let event = options.event;

    return ({
      position: parseInt(result.position),
      advanced: result.top_position,
      name: result.name,
      country: result.country,
      competitor_id: +result.competitor_id,
      t1: convertToSeconds(result.t1, event),
      t2: convertToSeconds(result.t2, event),
      t3: convertToSeconds(result.t3, event),
      t4: convertToSeconds(result.t4, event),
      t5: convertToSeconds(result.t5, event),
      average: result.mean ? convertToSeconds(result.mean, event) : convertToSeconds(result.average, event),
      average_record: result.mean_record || result.average_record,
      best: convertToSeconds(result.best, event),
      best_record: result.best_record,
      event: event,
      // kinch: rankedResult ? 100 * (rankedResult >= 0 ? (options.event === 19 ? options.best / rankedResult : rankedResult / options.best) : 0) : 0,
    });
  },
});

const Results = Collection.extend({
  Model: Result,
  mainIndex: 'competitor_id',

  comparator: function (a,b) {
    return this.event === '333mbf' ? compare(a.rankedResult, b.rankedResult) : -compare(a.rankedResult, b.rankedResult);
  },

  best () {
    return this.filter(result => result.rankedResult > 0)[0];
  },

  final () {
    return this.filter(round => round.final)[0];
  },

  parse (results, options) {
    let event = this.event = EventNames[options.event];

    return results.map(result =>
      new Result(result, {
        event: event,
        best: convertToSeconds(getRankedResult(results[0], event), event),
        parse: true,
      })
    );
  },
});

const formats = {
  'First Round': '1',
  'Second Round': '2',
  'Semi Final': '3',
  'Final': 'f',
  'Combined Final': 'c',
};

const Round = State.extend({
  props: {
    competition_id: 'string',
    event_id: 'string',
    finished: 'boolean',
    id: 'string',
    live: 'boolean',
    name: 'string',
  },

  derived: {
    format: {
      deps: ['name'],
      fn: function () {
        return formats[this.name];
      },
    },
    final: {
      deps: ['format'],
      fn: function () {
        return this.format === 'c' || this.format === 'f';
      },
    },
  },

  children: {
    results: Results,
  },

  fetch () {
    if (this.event_id && this.id) {
      Api.getResults(this.competition_id, this.event_id, this.id).then(results => {
        if (!results.error && results.status !== 404) {
          this.results = new Results(results, {event: this.event_id, parse: true});
          this.collection.trigger('change');
        }
      });
    }
  },
});

const Rounds = Collection.extend({
  model: Round,
});

const Event = State.extend({
  props: {
    name: 'string',
    id: 'string',
  },

  derived: {
    shortName: {
      deps: ['id'],
      fn: function () {
        return EventNames[this.id];
      },
    },
  },

  allResults (competitor_id) {
    return this.rounds.map(round => {
      return round.results.get(competitor_id);
    });
  },

  initialize (attrs) {
    if (attrs.rounds) {
      this.id = attrs.rounds[0].event_id;
    }
  },

  children: {
    rounds: Rounds,
  },
});

const Events = Collection.extend({
  model: Event,
});

const Competitor = State.extend({
  props: {
    competition_id: 'string',
    id: 'number',
    name: 'string',
  },

  parse (competitor) {
    return {
      competition_id: competitor.competition_id,
      id: +competitor.id,
      name: competitor.name,
    };
  },
});

const Competitors = Collection.extend({
  model: Competitor,

  parse (competitors) {
    return competitors.map(c => new Competitor(c, {parse: true}));
  },
});

module.exports = State.extend({
  props: {
    id: 'string',
    name: 'string',
  },

  children: {
    events: Events,
    competitors: Competitors,
  },

  initialize (options) {
    this.set(options);
  },

  fetch () {
    Api.getCompetitors(this.id).then(competitors => {
      this.competitors.set(competitors, {parse: true});
    });

    Api.getEvents(this.id).then(events => {
      this.events.set(events);
      this.events.forEach(event => {
        event.rounds.forEach(round => {
          round.fetch();
        });
      });
    });
  },
});
