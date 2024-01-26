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
    static fromBytes ( data: Uint8Array, id: number ) {
        const parameters: IUnknownCommandParameters = {id, data};

        return new UnknownCommand(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {id, data} = this.parameters;

        return Command.toBytes(id, data);
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
