import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadServerConfig from '../config/loadServerConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entities';
import { TicketModule } from '../ticket/ticket.module';
import { ValidationModule } from '../validations/validation.module';
import { RenderingModule } from '../rendering/rendering.module';
import { ProjectModule } from '../project/project.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadServerConfig]
    }),
    TypeOrmModule.forRootAsync({
      async useFactory(configService: ConfigService) {
        const baseConfig = configService.get('database');
        return {
          ...baseConfig,
          entities: entities,
          synchronize: true
        };
      },
      inject: [ConfigService]
    }),
    TicketModule,
    ProjectModule,
    ValidationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    })
  ]
})
export class AppModule {}
