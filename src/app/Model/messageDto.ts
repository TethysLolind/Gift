export interface MessageDto {
    fromGuid: string;
    toGuid: string;
    timestamp: number;
    exchanged: boolean;
    msgId: string;
    context: string;
}
