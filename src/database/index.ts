import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { NODE_ENV } from '../app/constants';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const isDevelopment =
          configService.get<string>('NODE_ENV') === NODE_ENV.DEVELOPMENT;

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/database/migrations',
          },
          namingStrategy: new SnakeNamingStrategy(),
          logging: isDevelopment,
          synchronize: isDevelopment,
          extra: { charset: 'utf8mb4_unicode_ci' },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
