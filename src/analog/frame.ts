import * as Frame from '../analogBase/frame.js';
import * as baseFrame from '../utils/frame.js';
import {IMessageConfig} from '../analogBase/message.js';
import * as protocol from './utils/protocol.js';


export const fromBytes = ( bytes: Uint8Array, config?: IMessageConfig ) => Frame.fromBytes(protocol, bytes, config);

export const fromHex = ( hex: string, config?: IMessageConfig ) => Frame.fromHex(protocol, hex, config);

export const fromBase64 = ( base64: string, config?: IMessageConfig ) => Frame.fromBase64(protocol, base64, config);

export const fromFrames = ( frames: Array<baseFrame.IFrame>, config?: IMessageConfig ) => Frame.fromFrames(protocol, frames, config);

export const {
    getCommands,
    toFrame
} = Frame;
