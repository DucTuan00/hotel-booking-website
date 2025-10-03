import 'express';
import { UserRole } from "@/types/user";

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
            role: UserRole;
        };
    }
}
