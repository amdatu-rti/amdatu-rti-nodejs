/// <reference path="node.d.ts" />

declare module "rti" {
    export class ProbeData {
        constructor(name: string, details: any, healthy: boolean, visualizationId?: string);
    }

    export interface ProbeController {
        add(name: string, callback: () => ProbeData);
    }

    export interface Logger {
        error(message: string, context?: any);
        warn(message: string, context?: any);
        info(message: string, context?: any);
        debug(message: string, context?: any);

        setLevel(level: string);
    }
}

