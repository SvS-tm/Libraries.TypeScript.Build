import { BarrelProcessingOperation } from "./barrel-processing-information";

export type BarrelProcessingInfo = 
(
    {
        path: string;
    }
        &
    (
        
        {
            operation: BarrelProcessingOperation.Clean;
            cleanedExports: number;
        }
            |
        {
            operation: BarrelProcessingOperation.Delete;
        }
    )
);
