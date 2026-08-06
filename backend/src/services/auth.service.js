import userRepository from "../repositories/user.repository.js";

class AuthService {

    async register(userData) {

        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error("Email already registered");
        }

        const newUser = await userRepository.create({
            full_name: userData.full_name,
            email: userData.email,
            password_hash: userData.password,
            role: "user"
        });

        return newUser;
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