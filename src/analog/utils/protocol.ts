/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import Command from '../Command.js';
import UnknownCommand from '../../analogBase/UnknownCommand.js';
import {requestById, responseById} from '../constants/commandRelations.js';
import * as directionTypes from '../../constants/directions.js';
import {AUTO, DOWNLINK, UPLINK} from '../../constants/directions.js';


// all allowed types
const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCommand = ( id: number, data: Uint8Array, direction: number = AUTO, hardwareType?: number ): Command => {
    if ( !directionTypeIds.has(direction) ) {
        throw new Error('wrong direction type');
    }

    const downlinkCommand = requestById.get(id);
    const uplinkCommand = responseById.get(id);

    // check command availability
    if (
        (!downlinkCommand && !uplinkCommand)
        || (direction === DOWNLINK && !downlinkCommand)
        || (direction === UPLINK && !uplinkCommand)
    ) {
        // missing command implementation
        return new UnknownCommand({id, data});
    }

    // the specific direction
    if ( direction === DOWNLINK || direction === UPLINK ) {
        const command = direction === UPLINK ? uplinkCommand : downlinkCommand;

        return command!.fromBytes(data, {hardwareType}) as Command;
    }

    // direction autodetect
    try {
        // uplink should be more often
        return uplinkCommand!.fromBytes(data, {hardwareType}) as Command;
    } catch {
        return downlinkCommand!.fromBytes(data) as Command;
    }
};


export {getCommand};
