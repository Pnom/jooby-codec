import getBase64FromBytes from './getBase64FromBytes.js';
import getBytesFromBase64 from './getBytesFromBase64.js';
import getBytesFromHex from './getBytesFromHex.js';
import getHexFromBytes from './getHexFromBytes.js';
import {hexFormatOptions, IHexFormatOptions} from '../config.js';
import {TBytesEncodeFormat, HEX} from './constants/bytesEncodeFormat.js';


export const getEncodingFromBytes = (
    bytes: Uint8Array,
    encodingFormat: TBytesEncodeFormat = HEX,
    hexFormat: IHexFormatOptions = hexFormatOptions
) => (encodingFormat === HEX
    ? getHexFromBytes(bytes, hexFormat)
    : getBase64FromBytes(bytes));

export const getBytesFromEncoding = ( data: string, encodingFormat: TBytesEncodeFormat = HEX ) => (encodingFormat === HEX
    ? getBytesFromHex(data)
    : getBytesFromBase64(data));
