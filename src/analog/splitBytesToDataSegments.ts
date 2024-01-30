import DataSegmentBase from './commands/DataSegmentBase.js';


export interface IDataSegmentSplitOptions {
    startSegmentationSessionId: number,
    maxSegmentSize: number
}

export interface IDataSegments {
    segmentationSessionId: number,
    segment: DataSegmentBase
}


const MAX_SEGMENTS_IN_SESSION = 7;


export const splitBytesToDataSegments = ( bytes: Uint8Array, {startSegmentationSessionId, maxSegmentSize}: IDataSegmentSplitOptions ): Array<IDataSegments> => {
    const segmentsNumber = Math.ceil(bytes.length / maxSegmentSize);
    const segments = [];

    let segmentationSessionId = startSegmentationSessionId;

    for ( let index = 0; index < segmentsNumber; index++ ) {
        if ( segmentationSessionId > MAX_SEGMENTS_IN_SESSION ) {
            segmentationSessionId++;
        }

        const segment = new DataSegmentBase({
            segmentationSessionId,
            segmentIndex: index + 1,
            segmentsNumber,
            last: false,
            data: bytes.slice(index * maxSegmentSize, maxSegmentSize)
        });

        segments.push({
            segmentationSessionId,
            segment
        });
    }

    return segments;
};
