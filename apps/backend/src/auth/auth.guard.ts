import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    const supabase = this.supabaseService.getClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    const isEmailConfirmed =
      !!user.email_confirmed_at ||
      !!user.confirmed_at ||
      user.user_metadata.email_verified === true;

    if (!existingUser) {
      await this.prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.email ?? 'Unnamed',
          status: isEmailConfirmed ? UserStatus.ACTIVE : UserStatus.PENDING,
          role: UserRole.USER,
        },
      });
    }

    const localUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (localUser?.status === UserStatus.BANNED) {
      throw new UnauthorizedException('User is banned');
    }

    // Inject user into request for downstream handlers
    request['user'] = {
      supabase: user, // Raw Supabase user
      local: localUser, // Your app's DB user
    };

    return true;
  }
}
