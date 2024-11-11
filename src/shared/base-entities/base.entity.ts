import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
  } from 'typeorm';
  
  export default class BaseProperties extends BaseEntity {
  
  
    @CreateDateColumn()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreated: Date;
  
    @UpdateDateColumn()
    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
      nullable: true,
    })
    dateUpdated: Date;
  
    @DeleteDateColumn()
    @Column({ type: 'timestamp', nullable: true })
    dateDeleted: Date;
  }
  