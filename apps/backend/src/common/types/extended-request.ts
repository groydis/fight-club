// src/types/extended-request.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    [key: string]: any; // You can tighten this if you know the full shape
  };
}
