/* eslint-disable */
import processExamples from '../analogBase/processExamples.js';
import {commands} from '../../src/mtxLora/index.js';


const {uplink, downlink} = commands;


describe('downlink commands', () => {
    processExamples(downlink);
});

describe('uplink commands', () => {
    processExamples(uplink);
});
