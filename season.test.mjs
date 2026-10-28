import test from 'node:test';import assert from 'node:assert/strict';import {getSeasonState,countdownParts} from './dist/season.js';
test('opens at midnight October 28 in New York',()=>{assert.equal(getSeasonState(new Date('2026-10-28T03:59:59Z')).active,false);assert.equal(getSeasonState(new Date('2026-10-28T04:00:00Z')).active,true)});
test('stays active throughout January 2 and closes January 3 in New York',()=>{assert.equal(getSeasonState(new Date('2027-01-03T04:59:59Z')).active,true);assert.equal(getSeasonState(new Date('2027-01-03T05:00:00Z')).active,false)});
test('December and January belong to same season',()=>{assert.equal(getSeasonState(new Date('2026-12-31T17:00:00Z')).startYear,2026);assert.equal(getSeasonState(new Date('2027-01-01T17:00:00Z')).startYear,2026)});
test('offseason counts down to this year October 28',()=>{const s=getSeasonState(new Date('2027-03-15T12:00:00Z'));assert.equal(s.active,false);assert.equal(s.nextStart.toISOString(),'2027-10-28T04:00:00.000Z');assert.ok(s.remainingMs>0)});
test('recurs across future years including leap year',()=>{for(const year of [2027,2028,2029,2030]){assert.equal(getSeasonState(new Date(year+'-10-28T04:00:00Z')).active,true);assert.equal(getSeasonState(new Date(year+'-10-28T03:59:59Z')).active,false)}});
test('countdown units remain correct at boundaries',()=>{assert.deepEqual(countdownParts(90061000),{days:1,hours:1,minutes:1,seconds:1});assert.deepEqual(countdownParts(-1),{days:0,hours:0,minutes:0,seconds:0});assert.equal(getSeasonState(new Date('2026-10-28T03:59:59Z')).remainingMs,1000)});

