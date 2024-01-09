import Command, {ICommandBinary, TCommandExampleList} from '../Command.js';
import CommandBinaryBuffer, {IMtxCommand} from '../CommandBinaryBuffer.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';


const COMMAND_ID = 0x1e;
const COMMAND_HEADER_SIZE = 2;


const examples: TCommandExampleList = [
    {
        name: 'MtxCommand request',
        parameters: {
            sequence: 2,
            last: false,
            fragmentsNumber: 5,
            fragmentIndex: 3,
            data: getBytesFromHex('00 01 02 03 04')
        },
        hex: {
            header: '1e 07',
            body: '02 53 00 01 02 03 04'
        }
    }
];


export default class MtxCommandBase extends Command {
    constructor ( public parameters: IMtxCommand ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new this(buffer.getMtxCommand());
    }

    // returns full message - header with body
    toBinary (): ICommandBinary {
        const {parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + parameters.data.length);

        // body
        buffer.setMtxCommand(parameters);

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}
