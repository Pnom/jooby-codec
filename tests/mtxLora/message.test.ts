/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Message from '../../src/mtxLora/message.js';
import * as downlinkCommands from '../../src/mtxLora/commands/downlink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


interface IMessage {
    hex: string,
    commands: Array<{parameters: object, command: unknown}>,
    isValid: boolean
}

type TMessageList = Array<IMessage>;


const messages: TMessageList = [
    {
        hex: '1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033',
        commands: [
            {
                parameters: {
                    sequence: 196,
                    fragmentIndex: 1,
                    fragmentsNumber: 3,
                    last: false,
                    data: getBytesFromHex('4d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
                },
                command: downlinkCommands.MtxCommand
            }
        ],
        isValid: true
    },
    {
        hex: '1e28c43208001d00000008011d00000008001a00000008001d00000008011d00000008001a00000008009d',
        commands: [
            {
                parameters: {
                    sequence: 196,
                    fragmentIndex: 2,
                    fragmentsNumber: 3,
                    last: false,
                    data: getBytesFromHex('08001d00000008011d00000008001a00000008001d00000008011d00000008001a0000000800')
                },
                command: downlinkCommands.MtxCommand
            }
        ],
        isValid: true
    }
    //{
    //    hex: '1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5e7',
    //    commands: [
    //        {
    //            parameters: {
    //                sequence: 196,
    //                fragmentIndex: 3,
    //                fragmentsNumber: 3,
    //                last: true,
    //                data: getBytesFromHex('1d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5')
    //            },
    //            command: downlinkCommands.MtxCommand
    //        }
    //    ],
    //    isValid: true
    //}
];


const checkMessage = ( {hex, commands, isValid}: IMessage ) => {
    const messageDataFromHex = Message.fromHex(hex);
    const messageDataFromBase64 = Message.fromBase64(Buffer.from(hex.replace(/\s/g, ''), 'hex').toString('base64'));

    messageDataFromHex.commands.forEach((messageCommand, index) => {
        expect(messageCommand.command.parameters).toStrictEqual(commands[index].parameters);
    });

    expect(messageDataFromHex).toStrictEqual(messageDataFromBase64);
    expect(messageDataFromHex.isValid).toBe(isValid);
};


describe('test messages', () => {
    messages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command);
        });
    });
});

describe('message validation', () => {
    test('test valid input', () => {
        const hex = '1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5e7';
        const message = Message.fromHex(hex);

        expect(message.isValid).toBe(true);
    });

    test('test invalid input', () => {
        const hex = '1e28c43208001d00000008011d00000008001a00000008001d00002008011d00000008001a00000008009d';
        const message = Message.fromHex(hex);

        expect(message.isValid).toBe(false);
    });
});
