export declare class SlashCommandHandler {
    path: string;
    slash: Map<any, any>;
    constructor(path: string);
    init(): Promise<void>;
    execute(slashCommandName: string): Function;
}
export declare class ComponentHandler {
    path: string;
    component: Map<any, any>;
    constructor(path: string);
    init(): Promise<void>;
    execute(componentIdentifier: string): Function;
}
//# sourceMappingURL=handler.d.ts.map