const { User } = require('@/entity/user');
const {UserController} = require("@/controllers/userController");

const {UserService} = require("@/controllers/userService");

describe('User Entity', () => {
  it('should create a user entity with the correct properties', () => {
    const user = new User();
    user.username = 'John Doe';
    user.email = 'john.doe@example.com';
    
    expect(user).toHaveProperty('name', 'John Doe');
    expect(user).toHaveProperty('email', 'john.doe@example.com');
  });

  it('should return the full name in uppercase', () => {
    const user = new User();
    user.username = 'John Doe';

    expect(user.getUsername()).toBe('JOHN DOE');
  });

  it('should have an undefined uuid before it is saved', () => {
    const user = new User();
    expect(user.user_uuid).toBeUndefined();
  });
});
