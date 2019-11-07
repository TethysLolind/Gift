export interface UserInfoDto {
    guid: string;
    status: UserStatus;
    name: string;
    connectionId: string;
    loginInTime: number;
    loginOutTime: number;
    latestTimestamp: number;

}

export enum UserStatus {
    Online = 1, Offline = 0
}
