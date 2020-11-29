const mongoose = require('mongoose');
require('../../src/models/User');
const UserModel = mongoose.model('users');
const { setupDB } = require('../test-setup');
const databaseName = "unit-user";

setupDB(databaseName);

describe('User Model Test', () => {

    it('create & save user successfully', async () => {
        const userData = {
            username: 'Wiktoria',
            password: 'password',
        };
        const validUser = new UserModel({username: userData.username});
        const savedUser = await UserModel.register(validUser, userData.password);

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
    });

    it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new UserModel({username: 'Wiktoria2', password:'password', age: 18});
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.age).toBeUndefined();
    });
});
