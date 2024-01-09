/* eslint-disable */
import processExamples from '../analogBase/processExamples.js';
import {commands} from '../../src/analog/index.js';


const {uplink, downlink} = commands;


describe('downlink commands', () => {
    processExamples(downlink);
});

describe('uplink commands', () => {
    processExamples(uplink);
});
