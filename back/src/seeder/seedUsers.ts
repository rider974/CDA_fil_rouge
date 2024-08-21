// src/seeder/user-seeder.ts
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { Role } from '../entity/role';

const seedUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    // récupération des roles
    const adminRole = await roleRepository.findOneBy({ role_name: 'admin' });
    const moderatorRole = await roleRepository.findOneBy({ role_name: 'moderator' });
    const memberRole = await roleRepository.findOneBy({ role_name: 'member' });

    if (!adminRole || !moderatorRole || !memberRole) {
      throw new Error('One or more roles not found.');
    }

    // seed d'utilisateur example
    const users = [
      { username: 'admin', email: 'admin@example.com', password: 'adminpass', role: adminRole },
      { username: 'moderator', email: 'moderator@example.com', password: 'moderatorpass', role: moderatorRole },
      { username: 'member', email: 'member@example.com', password: 'memberpass', role: memberRole },
    ];

    for (const user of users) {
      const newUser = userRepository.create(user);
      console.log(newUser);
      await userRepository.save(newUser);
    }

    console.log('Users seeded');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default seedUsers;