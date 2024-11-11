import { Role } from "../src/user/entities/role.entity";
import User from "../src/user/entities/user.entity";
import { hash } from "bcrypt";
import { MigrationInterface, QueryRunner } from "typeorm";
import * as dotenv from "dotenv";
import { Logger } from "@nestjs/common";
dotenv.config();

export class CreateSuperUser1713913862994 implements MigrationInterface {
  private readonly logger = new Logger(CreateSuperUser1713913862994.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const roleRepository = queryRunner.manager.getRepository(Role);
      let existingRole = await roleRepository.findOne({
        where: { roleName: "admin" },
      });

      if (!existingRole) {
        const roleData = {
          roleName: "admin",
          description: "Administrator",
        };
        const newRole = roleRepository.create(roleData);
        existingRole = await roleRepository.save(newRole);
      }

      const userRepository = queryRunner.manager.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: { email: process.env.ADMIN_EMAIL },
      });

      if (!existingUser) {
        const userData = {
          firstName: "eric",
          lastName: "crick",
          email: process.env.ADMIN_EMAIL,
          password: await hash(process.env.ADMIN_PASSWORD, 8),
          isActive: true,
          role: existingRole || undefined,
        };
        const newUser = userRepository.create(userData);
        await userRepository.save(newUser);
        this.logger.log("Admin user created successfully");
      }
    } catch (error) {
      this.logger.error(`Creating admin user failed: ${error}`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const roleRepository = queryRunner.manager.getRepository(Role);

      const user = await userRepository.findOne({
        where: { email: process.env.ADMIN_EMAIL },
      });

      if (user) {
        await userRepository.remove(user);
        this.logger.log("Admin user removed successfully");
      }

      const role = await roleRepository.findOne({
        where: { roleName: "admin" },
      });

      if (role) {
        await roleRepository.remove(role);
        this.logger.log("Admin role removed successfully");
      }
    } catch (error) {
      this.logger.error(`Rolling back migration failed: ${error}`);
    }
  }
}
