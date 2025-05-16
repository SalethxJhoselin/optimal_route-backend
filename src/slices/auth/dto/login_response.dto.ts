import { UserDto } from "src/slices/user/user.dto";

export class LoginResponseDto {
    user: UserDto;
    access_token: string;
    refresh_token: string;
}