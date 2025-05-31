import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { SupabaseAuthMiddleware } from './auth/supabase-auth.middleware';
import { UserModule } from './user/user.module';
import { CharactersModule } from './characters/characers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SupabaseModule,
    UserModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SupabaseAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Optional: scope this to /api/private/* etc.
  }
}
