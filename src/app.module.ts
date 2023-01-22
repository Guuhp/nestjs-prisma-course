import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { UserIdCheckMiddlewares } from './middlewares/use-id-check.middlewares';

@Module({
  imports: [UserModule],
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
