import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { AzureBlobService } from 'src/media/service/azure/azure-file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController, RoleController],
  providers: [UserService,RoleService,AzureBlobService],
  exports: [UserService]
})
export class UserModule {}
