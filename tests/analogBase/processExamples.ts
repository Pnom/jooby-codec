/* eslint-disable */

import Command, {ICommandExample} from '../../src/analogBase/Command.js';
import calculateLrc from '../../src/utils/calculateLrc.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBase64FromBytes from '../../src/utils/getBase64FromBytes.js';



const checkExample = ( constructor: any, {parameters, config, hex: {header, body} }: ICommandExample ) => {
    const commandHex = getHexFromBytes(getBytesFromHex(`${header} ${body}`));
    const commandBytes = getBytesFromHex(commandHex);
    const commandBase64 = getBase64FromBytes(commandBytes);
    const messageHex = `${commandHex} ${calculateLrc(commandBytes).toString(16)}`;
    const command = new constructor(parameters, config);
    const commandFromHex = constructor.fromBytes(body ? getBytesFromHex(body) : null, config);

    expect(command).toBeInstanceOf(constructor);
    expect(command).toBeInstanceOf(Command);
    expect(command.parameters).toStrictEqual(parameters);
    expect(command.getParameters()).toStrictEqual(parameters);
    expect(command.toHex()).toBe(commandHex);
    expect(command.toJson()).toBe(JSON.stringify(command.getParameters()));
    expect(command.toBase64()).toBe(commandBase64);

    expect(commandFromHex).toStrictEqual(command);
    expect(commandFromHex.toHex()).toBe(commandHex);
    expect(commandFromHex.parameters).toStrictEqual(parameters);
    expect(commandFromHex.getParameters()).toStrictEqual(parameters);
};


export default ( commands: Record<string, any> ) => {
    for ( const [name, constructor] of Object.entries(commands) ) {
        // each command should export at least 1 example
        expect(Array.isArray(constructor.examples)).toBe(true);
        expect(constructor.examples.length).toBeGreaterThan(0);

        describe(constructor.name, () => {
            constructor.examples.forEach((example: ICommandExample) => {
                test(example.name, () => {
                    checkExample(constructor, example);
                });
            });
        });
    }
};
