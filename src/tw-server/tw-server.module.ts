import { Module } from '@nestjs/common';
import { TwGateway } from './tw.gateway';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [TwGateway],
})
export class TwServerModule {}
