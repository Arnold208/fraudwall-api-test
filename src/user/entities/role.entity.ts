import BaseEntity from "../../shared/base-entities/base.entity";

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import User from "./user.entity";

@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  roleName: string;

  @Column({ type: "varchar", nullable: true, default: null })
  description: string;

  @OneToMany(() => User, (user) => user.role, {
    nullable: true,
  })
  users: User[];

  static getUniqueRoles(items: Role[]): Role[] {
    const uniqueItemsMap = new Map<string, Role>();
    items.forEach((item) => {
      uniqueItemsMap.set(item.id, item);
    });
    return Array.from(uniqueItemsMap.values());
  }

  @BeforeInsert()
  @BeforeUpdate()
  changeToLowerCase() {
    this.roleName = this.roleName.toLowerCase();
  }
}
