import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserIdCheckMiddlewares } from './middlewares/use-id-check.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'abagail.mitchell95@ethereal.email',
          pass: 'NCzsBK65H4hhJdmBSr'
        }
      },
      defaults: {
        from: '"luiz" <	abagail.mitchell95@ethereal.email>'
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new PugAdapter(),
        options: {
          strict: true
        }
      }
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddlewares).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL
    })
  }
}
