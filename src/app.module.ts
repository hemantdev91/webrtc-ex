import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwServerModule } from './tw-server/tw-server.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configurations/twilioConfig';

@Module({
  imports: [
    TwServerModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
