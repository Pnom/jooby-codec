import Command from './Command.js';
import {getEncodingFromBytes} from '../utils/bytesEncoding.js';
import {IHexFormatOptions} from '../config.js';
import {TBytesEncodeFormat, HEX} from '../utils/constants/bytesEncodeFormat.js';


/**
 * UnknownCommand command parameters.
 */
interface IUnknownCommandParameters {
    /** command id */
    id: number,
    /** command data size */
    size: number,
    /** raw data */
    data: Uint8Array
}


/**
 * Unknown command.
 */
class UnknownCommand extends Command {
    constructor ( public parameters: IUnknownCommandParameters ) {
        super();
    }

    // data - only body (without header)
    static fromBytes ( id: number, size: number, data: Uint8Array ) {
        const parameters: IUnknownCommandParameters = {id, size, data};

        return new UnknownCommand(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {id, size, data} = this.parameters;

        return new Uint8Array([id, size, ...data]);
    }

    toJson ( encodeFormat: TBytesEncodeFormat = HEX, hexFormat: IHexFormatOptions = {} ) {
        const {id, data} = this.parameters;

        return JSON.stringify({
            id,
            data: getEncodingFromBytes(data, encodeFormat, hexFormat)
        });
    }
}


export default UnknownCommand;
