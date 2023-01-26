import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { UserIdCheckMiddlewares } from './middlewares/use-id-check.middleware';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule), 
    forwardRef(() => AuthModule)
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddlewares).forRoutes({
      path:'users/:id',
      method:RequestMethod.ALL
    })
  }
}
