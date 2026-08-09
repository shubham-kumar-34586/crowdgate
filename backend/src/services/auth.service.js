import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";


class AuthService {

    async register(userData) {

        const existingUser = await userRepository.findByEmail(
            userData.email
        );

        if (existingUser) {
            const error = new Error("Email already registered");
            error.status = 409;
            throw error;
        }
        const passwordHash = await bcrypt.hash(userData.password, 12);

        const newUser = await userRepository.create({
            full_name: userData.full_name,
            email: userData.email,
            password_hash: passwordHash,
            role: "user"
        });

        return newUser;
    }


    async login(userData) {
    const { email, password } = userData;

    const user = await userRepository.findByEmail(email);

    if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    const { password_hash, ...safeUser } = user;

    return {
        user: safeUser,
        token
    };
}

}



export default new AuthService();


// Remember

// Service = Business Logic

// Examples:

// Check email exists
// Hash password
// Generate token
// Call repository