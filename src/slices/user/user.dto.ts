import { RoleDto } from "../role/role.dto";

export class UserDto {
    id: string;
    email?: string;
    email_confirmed_at?: string;
    phone_number?: number;
    state?: string;
    role?: RoleDto;
    user_metadata?: any;
    created_at?: string;
    updated_at?: string;
}