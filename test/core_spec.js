import { List, Map } from 'immutable';
import { expect } from 'chai';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {
    describe('setEntries', () => {
        it('adds the entries to the state', () => {
            const state = new Map();
            const entries = List.of('Trainspotting', '28 Days Later');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(new Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });

        it('converts to immutable', () => {
            const state = new Map();
            const entries = ['Trainspotting', '28 Days Later'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(new Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });
    });

    describe('next', () => {
        it('takes the next two entries under vote', () => {
            const state = new Map({
                entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
            });
            const nextState = next(state);
            expect(nextState).to.equal(new Map({
                vote: new Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                }),
                entries: List.of('Sunshine')
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = new Map({
                vote: new Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: new Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(new Map({
                vote: new Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting')
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = new Map({
                vote: new Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: new Map({
                        'Trainspotting': 3,
                        '28 Days Later': 3
                    })
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(new Map({
                vote: new Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
            }));
        });

        it('marks winner when just one entry left', () => {
            const state = new Map({
                vote: new Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: new Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: new List()
            });
            const nextState = next(state);
            expect(nextState).to.equal(new Map({
                winner: 'Trainspotting'
            }));
        });
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = new Map({
                pair: List.of('Trainspotting', '28 Days Later')
            });
            const nextState = vote(state, 'Trainspotting')
            expect(nextState).to.equal(new Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: new Map({
                    Trainspotting: 1
                })
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = new Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: new Map({
                    'Trainspotting': 3,
                    '28 Days Later': 2
                })
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(new Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: new Map({
                    'Trainspotting': 4,
                    '28 Days Later': 2
                })
            }));
        });
    });
});
