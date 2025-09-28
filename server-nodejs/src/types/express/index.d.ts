import 'express';
import { UserRole } from "@/types/user";

declare module 'express' {
    interface Request {
        user?: {
            id: string;
            role: UserRole;
        };
    }
}
