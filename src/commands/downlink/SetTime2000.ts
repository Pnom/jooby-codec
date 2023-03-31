/**
 * [[include:commands/downlink/SetTime2000.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import BinaryBuffer from '../../BinaryBuffer.js';


const COMMAND_ID = 0x02;
const COMMAND_TITLE = 'SET_TIME_2000';
const COMMAND_BODY_SIZE = 5;


/**
 * SetTime2000 command parameters
 *
 * @example
 * {sequenceNumber: 5, time: 9462957}
 */
interface IDownlinkSetTime2000Parameters {
    /** sequence Number */
    sequenceNumber: number,
    /** seconds 2000 */
    time: number
}


/**
 * SetTime2000 downlink command
 *
 * @example
 * ```js
 * const parameters = {sequenceNumber: 5, time: 9462957};
 * const command = new SetTime2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * ```
 */
class SetTime2000 extends Command {
    constructor ( public parameters: IDownlinkSetTime2000Parameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = false;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            time: buffer.getInt32()
        };

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new SetTime2000(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, time} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(sequenceNumber);
        buffer.setInt32(time);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetTime2000;
