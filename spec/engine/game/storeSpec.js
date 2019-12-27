const _ = require('lodash'),
    utils =  require('../../../src/utils'),
    driver = utils.getDriver(),
    C = driver.constants,
    store = require('../../../src/game/store');

describe('Store', () => {
    let globals = {};
    beforeEach(()=>{
        store.make({}, {}, { wrapFn: fn => fn }, globals);
    });

    describe('Empty store resources index', () => {
        let containerStore;
        beforeEach(()=>{
            containerStore = new globals.Store({
                type: "container",
                store: { energy: 0, ops: 0 },
                storeCapacity: 2000
            });
        });

        it('Every resource key exists', () => {
            C.RESOURCES_ALL.forEach(r => {
                expect(containerStore[r]).toBe(0);
            });
        });

        it('For...in contains energy only', () => {
            const keys = [];
            for(let key in containerStore) {
                keys.push(key);
            }

            expect(keys).toEqual([]);
        });
    });

    describe('Non-empty store resources index', () => {
        let containerStore;
        beforeEach(()=>{
            containerStore = new globals.Store({
                type: "container",
                store: { energy: 1000, ops: 50, H: 0 },
                storeCapacity: 2000
            });
        });

        it('For...in contains non-zero resources only', () => {
            const keys = [];
            for(let key in containerStore) {
                keys.push(key);
            }

            expect(keys).toEqual(['energy', 'ops']);
        });
    });

    // energy-only structures: spawner, extension, tower, creep, power creep
    describe('Spawner', () => {
        let spawnerStore;
        beforeEach(()=>{
            const spawner = {
                type: "spawn",
                store: { energy: 100 },
                storeCapacityResource: { energy: 300 }
            };
            spawnerStore = new globals.Store(spawner);
        });

        it('Compatible with energy', () => {
            expect(spawnerStore.getCapacity('energy')).toBe(300);
            expect(spawnerStore.getUsedCapacity('energy')).toBe(100);
            expect(spawnerStore.getFreeCapacity('energy')).toBe(200);
        });

        it('Not compatible with random resource', () => {
            expect(spawnerStore.getCapacity()).toBeNull();
            expect(spawnerStore.getUsedCapacity()).toBeNull();
            expect(spawnerStore.getFreeCapacity()).toBeNull();
        });

        it('Not compatible with power', () => {
            expect(spawnerStore.getCapacity('power')).toBeNull();
            expect(spawnerStore.getUsedCapacity('power')).toBeNull();
            expect(spawnerStore.getFreeCapacity('power')).toBeNull();
        });

        it('Not compatible with minerals', () => {
            expect(spawnerStore.getCapacity('H')).toBeNull();
            expect(spawnerStore.getUsedCapacity('H')).toBeNull();
            expect(spawnerStore.getFreeCapacity('H')).toBeNull();
        });

        it('Not compatible with boosts', () => {
            expect(spawnerStore.getCapacity('XGH2O')).toBeNull();
            expect(spawnerStore.getUsedCapacity('XGH2O')).toBeNull();
            expect(spawnerStore.getFreeCapacity('XGH2O')).toBeNull();
        });

        it('Not compatible with commodities', () => {
            expect(spawnerStore.getCapacity('purifier')).toBeNull();
            expect(spawnerStore.getUsedCapacity('purifier')).toBeNull();
            expect(spawnerStore.getFreeCapacity('purifier')).toBeNull();
        });
    });

    // specialized structures: power spawn, nuker
    describe('PowerSpawn', () => {
        let psStore;
        beforeEach(()=>{
            const powerSpawner = {
                type: "powerSpawn",
                store: { energy: 2100, power: 40 },
                storeCapacityResource: { energy: 5000, power: 100 }
            };
            psStore = new globals.Store(powerSpawner);
        });

        it('Compatible with energy', () => {
            expect(psStore.getCapacity('energy')).toBe(5000);
            expect(psStore.getUsedCapacity('energy')).toBe(2100);
            expect(psStore.getFreeCapacity('energy')).toBe(2900);
        });

        it('Compatible with power', () => {
            expect(psStore.getCapacity('power')).toBe(100);
            expect(psStore.getUsedCapacity('power')).toBe(40);
            expect(psStore.getFreeCapacity('power')).toBe(60);
        });

        it('Not compatible with random resource', () => {
            expect(psStore.getCapacity()).toBeNull();
            expect(psStore.getUsedCapacity()).toBeNull();
            expect(psStore.getFreeCapacity()).toBeNull();
        });

        it('Not compatible with minerals', () => {
            expect(psStore.getCapacity('H')).toBeNull();
            expect(psStore.getUsedCapacity('H')).toBeNull();
            expect(psStore.getFreeCapacity('H')).toBeNull();
        });

        it('Not compatible with boosts', () => {
            expect(psStore.getCapacity('XGH2O')).toBeNull();
            expect(psStore.getUsedCapacity('XGH2O')).toBeNull();
            expect(psStore.getFreeCapacity('XGH2O')).toBeNull();
        });

        it('Not compatible with commodities', () => {
            expect(psStore.getCapacity('purifier')).toBeNull();
            expect(psStore.getUsedCapacity('purifier')).toBeNull();
            expect(psStore.getFreeCapacity('purifier')).toBeNull();
        });
    });

    // general purpose stores: storage, terminal, factory, container
    describe('Container', () => {
        let containerStore;
        beforeEach(()=>{
            containerStore = new globals.Store({
                type: "container",
                store: { energy: 1000, H: 200, XGH2O: 100, purifier: 50, power: 10 },
                storeCapacity: 2000
            });
        });

        it('Compatible with energy', () => {
            expect(containerStore.getCapacity('energy')).toBe(2000);
            expect(containerStore.getUsedCapacity('energy')).toBe(1000);
            expect(containerStore.getFreeCapacity('energy')).toBe(640);
        });

        it('Compatible with random resource', () => {
            expect(containerStore.getCapacity()).toBe(2000);
            expect(containerStore.getUsedCapacity()).toBe(1360);
            expect(containerStore.getFreeCapacity()).toBe(640);
        });

        it('Compatible with power', () => {
            expect(containerStore.getCapacity('power')).toBe(2000);
            expect(containerStore.getUsedCapacity('power')).toBe(10);
            expect(containerStore.getFreeCapacity('power')).toBe(640);
        });

        it('Compatible with minerals', () => {
            expect(containerStore.getCapacity('H')).toBe(2000);
            expect(containerStore.getUsedCapacity('H')).toBe(200);
            expect(containerStore.getUsedCapacity('O')).toBe(0);
            expect(containerStore.getFreeCapacity('H')).toBe(640);
            expect(containerStore.getFreeCapacity('O')).toBe(640);
        });

        it('Compatible with boosts', () => {
            expect(containerStore.getCapacity('XGH2O')).toBe(2000);
            expect(containerStore.getUsedCapacity('XGH2O')).toBe(100);
            expect(containerStore.getFreeCapacity('XGH2O')).toBe(640);
        });

        it('Compatible with commodities', () => {
            expect(containerStore.getCapacity('purifier')).toBe(2000);
            expect(containerStore.getUsedCapacity('purifier')).toBe(50);
            expect(containerStore.getFreeCapacity('purifier')).toBe(640);
        });
    });

    // withdraw-only objects: tombstones, ruins
    describe('Tombstone', () => {
        let tombstoneStore;
        beforeEach(()=>{
            tombstoneStore = new globals.Store({
                type: "tombstone",
                store: { energy: 1000, H: 200, XGH2O: 100, purifier: 50, power: 10 }
            });
        });

        it('Contains 1000 energy', () => {
            expect(tombstoneStore.getUsedCapacity('energy')).toBe(1000);
        });

        it('Contains 10 power', () => {
            expect(tombstoneStore.getUsedCapacity('power')).toBe(10);
        });

        it('Contains 200 mineral', () => {
            expect(tombstoneStore.getUsedCapacity('H')).toBe(200);
        });

        it('Contains 100 boost', () => {
            expect(tombstoneStore.getUsedCapacity('XGH2O')).toBe(100);
        });

        it('Contains 50 commodity', () => {
            expect(tombstoneStore.getUsedCapacity('purifier')).toBe(50);
        });

        it('Not compatible with energy', () => {
            expect(tombstoneStore.getCapacity('energy')).toBeNull();
            expect(tombstoneStore.getFreeCapacity('energy')).toBeNull();
        });

        it('Not compatible with random resource', () => {
            expect(tombstoneStore.getCapacity()).toBeNull();
            expect(tombstoneStore.getUsedCapacity()).toBeNull();
            expect(tombstoneStore.getFreeCapacity()).toBeNull();
        });

        it('Not compatible with power', () => {
            expect(tombstoneStore.getCapacity('power')).toBeNull();
            expect(tombstoneStore.getFreeCapacity('power')).toBeNull();
        });

        it('Not compatible with minerals', () => {
            expect(tombstoneStore.getCapacity('H')).toBeNull();
            expect(tombstoneStore.getFreeCapacity('H')).toBeNull();
        });

        it('Not compatible with boosts', () => {
            expect(tombstoneStore.getCapacity('XGH2O')).toBeNull();
            expect(tombstoneStore.getFreeCapacity('XGH2O')).toBeNull();
        });

        it('Not compatible with commodities', () => {
            expect(tombstoneStore.getCapacity('purifier')).toBeNull();
            expect(tombstoneStore.getFreeCapacity('purifier')).toBeNull();
        });
    });

    describe('Lab', () => {
        describe('Empty', () => {
            let labStore;
            beforeEach(()=>{
                labStore = new globals.Store({
                    type: 'lab',
                    store: {},
                    storeCapacity: 5000,
                    storeCapacityResource: {
                        "energy" : 2000,
                        "UO" : null
                    }
                });
            });

            it('Compatible with energy', () => {
                expect(labStore.getCapacity('energy')).toBe(2000);
                expect(labStore.getUsedCapacity('energy')).toBe(0);
                expect(labStore.getFreeCapacity('energy')).toBe(2000);
            });

            it('Not compatible with random resource', () => {
                expect(labStore.getCapacity()).toBeNull();
                expect(labStore.getUsedCapacity()).toBeNull();
                expect(labStore.getFreeCapacity()).toBeNull();
            });

            it('Compatible with minerals', () => {
                expect(labStore.getCapacity('H')).toBe(3000);
                expect(labStore.getUsedCapacity('H')).toBe(0);
                expect(labStore.getFreeCapacity('H')).toBe(3000);
            });

            it('Compatible with boosts', () => {
                expect(labStore.getCapacity('UO')).toBe(3000);
                expect(labStore.getUsedCapacity('UO')).toBe(0);
                expect(labStore.getFreeCapacity('UO')).toBe(3000);
            });
        });

        describe('Non-empty', () => {
            let labStore;
            beforeEach(()=>{
                labStore = new globals.Store({
                    type: 'lab',
                    store: {
                        energy: 800,
                        UO: 1200
                    },
                    storeCapacity: null,
                    storeCapacityResource: {
                        energy: 2000,
                        UO: 3000,
                        H: null
                    }
                });
            });

            it('Compatible with energy', () => {
                expect(labStore.getCapacity('energy')).toBe(2000);
                expect(labStore.getUsedCapacity('energy')).toBe(800);
                expect(labStore.getFreeCapacity('energy')).toBe(1200);
            });

            it('Not compatible with random resource', () => {
                expect(labStore.getCapacity()).toBeNull();
                expect(labStore.getUsedCapacity()).toBeNull();
                expect(labStore.getFreeCapacity()).toBeNull();
            });

            it('Compatible with the same mineral', () => {
                expect(labStore.getCapacity('UO')).toBe(3000);
                expect(labStore.getUsedCapacity('UO')).toBe(1200);
                expect(labStore.getFreeCapacity('UO')).toBe(1800);
            });

            it('Not compatible with not contained mineral', () => {
                expect(labStore.getCapacity('H')).toBeNull();
                expect(labStore.getUsedCapacity('H')).toBeNull();
                expect(labStore.getFreeCapacity('H')).toBeNull();
            });
        });
    });
});
