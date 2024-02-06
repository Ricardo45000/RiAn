import bcrypt from 'bcryptjs';

function hashPassword(password) {
    const saltRounds = 10; // You can adjust the number of salt rounds based on your security requirements
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

console.log(hashPassword(process.argv[2]));