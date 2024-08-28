import { AppDataSource } from '../data-source';
import { Role} from '../entity/role';

const seedRoles = async () => {
    try{
  const roleRepository = AppDataSource.getRepository(Role);
  const roles = [
    { role_name: 'admin' },
    { role_name: 'moderator' },
    { role_name: 'member' },
  ];

  for (const role of roles) {
    const newRole = roleRepository.create(role);
    console.log(newRole);
    await roleRepository.save(newRole);
  }
  console.log('Roles seeded');
}catch (error) {
    console.error('Error seeding roles:', error);
}
};

export default seedRoles;