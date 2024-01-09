import Command from './Command.js';

interface IAnalogProtocol {
    getCommand: ( id: number, data: Uint8Array, direction: number, hardwareType?: number ) => Command;
}

export default IAnalogProtocol;
