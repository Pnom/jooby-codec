/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import * as protocol from './utils/protocol.js';
import * as Message from '../analogBase/message.js';


export const fromBytes = ( data: Uint8Array, config?: Message.IMessageConfig ) => Message.fromBytes(protocol, data, config);

export const fromHex = ( data: string, config?: Message.IMessageConfig ) => Message.fromHex(protocol, data, config);

export const fromBase64 = ( data: string, config?: Message.IMessageConfig ) => Message.fromBase64(protocol, data, config);

export const {
    getCommands,
    toMessage,
    toBytes,
    toHex,
    toBase64
} = Message;
