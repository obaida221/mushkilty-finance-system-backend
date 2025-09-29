import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	Unique,
	Column,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('role_permissions')
@Unique('UQ_role_permission', ['role_id', 'permission_id'])
export class RolePermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	role_id: number;

	@Column()
	permission_id: number;

	@ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'role_id' })
	role: Role;

	@ManyToOne(() => Permission, (perm) => perm.rolePermissions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'permission_id' })
	permission: Permission;
}
