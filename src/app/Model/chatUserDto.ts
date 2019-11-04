export interface ChatUserDto {
    guid: string;
    status: UserStatus;
    name: string;
}

export enum UserStatus {
    Online, Offline
}
