/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import Command, {ICommandBinary} from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import IAnalogProtocol from './IAnalogProtocol.js';
import {AUTO} from '../constants/directions.js';
import * as header from './header.js';
import {IHexFormatOptions} from '../config.js';
import calculateLrc from '../utils/calculateLrc.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


interface IMessageCommand {
    data: ICommandBinary;
    command: Command;
}

export interface IMessage {
    commands: Array<IMessageCommand>,
    lrc: {
        expected: number | undefined,
        actual: number
    },
    bytes: Uint8Array,
    isValid: boolean
}

export interface IMessageConfig {
    /** It is highly recommended to use a specific direction. */
    direction?: number,
    hardwareType?: number
}

export const getCommands = ( message: IMessage, isStrict: boolean = false ): Array<Command> => {
    if ( isStrict && !message.isValid ) {
        return [];
    }

    return message.commands.map(({command}) => command);
};

const HEADER_MAX_SIZE = 3;

export const fromBytes = ( {getCommand}: IAnalogProtocol, data: Uint8Array, config?: IMessageConfig ): IMessage => {
    const direction = config?.direction ?? AUTO;
    const hardwareType = config?.hardwareType;
    const commands: Array<IMessageCommand> = [];
    const result: IMessage = {
        commands,
        lrc: {expected: undefined, actual: 0},
        isValid: false,
        bytes: data
    };
    let processedBytes = 0;
    let expectedLrc;
    let actualLrc;

    // process the data except the last byte
    do {
        const headerInfo = header.fromBytes(data.slice(processedBytes, processedBytes + HEADER_MAX_SIZE));
        const headerData = data.slice(processedBytes, processedBytes + headerInfo.headerSize);
        const bodyData = data.slice(processedBytes + headerInfo.headerSize, processedBytes + headerInfo.headerSize + headerInfo.commandSize);
        let command: Command;

        // shift
        processedBytes = processedBytes + headerInfo.headerSize + headerInfo.commandSize;

        try {
            command = getCommand(headerInfo.commandId, bodyData, direction, hardwareType);
        } catch ( error ) {
            command = UnknownCommand.fromBytes(bodyData, headerInfo.commandId);
        }

        commands.push({
            data: {
                header: headerData,
                body: bodyData,
                bytes: mergeUint8Arrays(headerData, bodyData)
            },
            command
        });
    } while ( processedBytes < data.length - 1 );

    // check the last byte left unprocessed
    if ( data.length - processedBytes === 1 ) {
        // LRC is present
        expectedLrc = data.at(-1);
        actualLrc = calculateLrc(data.slice(0, -1));
    } else {
        // LRC is absent
        actualLrc = calculateLrc(data);
    }

    result.lrc.actual = actualLrc;
    result.lrc.expected = expectedLrc;
    result.isValid = expectedLrc === actualLrc;

    return result;
};

export const fromHex = ( protocol: IAnalogProtocol, data: string, config?: IMessageConfig ) => (
    fromBytes(protocol, getBytesFromHex(data), config)
);

export const fromBase64 = ( protocol: IAnalogProtocol, data: string, config?: IMessageConfig ) => (
    fromBytes(protocol, getBytesFromBase64(data), config)
);

export const toMessage = ( commands: Array<Command> ): IMessage => {
    const commandsBinary = commands.map(command => ({
        command,
        data: command.toBinary()
    }));

    const body = new Uint8Array(
        commandsBinary.flatMap(({data: {bytes}}) => Array.from(bytes))
    );
    const actualLrc = calculateLrc(body);

    return {
        commands: commandsBinary,
        lrc: {
            expected: actualLrc,
            actual: actualLrc
        },
        bytes: new Uint8Array([...body, actualLrc]),
        isValid: true
    };
};

export const toBytes = ( commands: Array<Command> ): Uint8Array => {
    const commandBytes = commands.map(command => command.toBytes());
    const body = mergeUint8Arrays(...commandBytes);

    return new Uint8Array([...body, calculateLrc(body)]);
};

export const toHex = ( commands: Array<Command>, options: IHexFormatOptions = {} ): string => getHexFromBytes(toBytes(commands), options);

export const toBase64 = ( commands: Array<Command> ): string => getBase64FromBytes(toBytes(commands));
