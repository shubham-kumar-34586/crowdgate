import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import userRepository from "../repositories/user.repository.js";
import refreshTokenRepository from "../repositories/refreshToken.repository.js";


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

        const passwordHash = await bcrypt.hash(
            userData.password,
            12
        );

        const newUser = await userRepository.create({
            full_name: userData.full_name,
            email: userData.email,
            password_hash: passwordHash,
            role: "user"
        });

        return newUser;
    }


    generateRefreshToken() {

        return crypto
            .randomBytes(64)
            .toString("hex");
    }


    hashRefreshToken(token) {

        return crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }


    getRefreshTokenExpiry() {

        const expiresAt = new Date();

        expiresAt.setDate(
            expiresAt.getDate() +
            Number(
                process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7
            )
        );

        return expiresAt;
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

        const accessToken = jwt.sign(
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

        const refreshToken = this.generateRefreshToken();

        const refreshTokenHash =
            this.hashRefreshToken(refreshToken);

        const expiresAt = this.getRefreshTokenExpiry();

        await refreshTokenRepository.create({
            user_id: user.id,
            token_hash: refreshTokenHash,
            expires_at: expiresAt
        });

        const { password_hash, ...safeUser } = user;

        return {
            user: safeUser,
            accessToken,
            refreshToken
        };
    }


    async refresh(refreshToken) {

        if (!refreshToken) {
            const error = new Error("Refresh token is required");
            error.status = 401;
            throw error;
        }

        const tokenHash =
            this.hashRefreshToken(refreshToken);

        const storedToken =
            await refreshTokenRepository.findByTokenHash(
                tokenHash
            );

        if (!storedToken) {
            const error = new Error("Invalid or expired refresh token");
            error.status = 401;
            throw error;
        }

        const user = await userRepository.findById(
            storedToken.user_id
        );

        if (!user) {
            const error = new Error("User not found");
            error.status = 401;
            throw error;
        }

        const accessToken = jwt.sign(
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

        // Rotate the old refresh token
        await refreshTokenRepository.revokeById(
            storedToken.id
        );

        const newRefreshToken =
            this.generateRefreshToken();

        const newRefreshTokenHash =
            this.hashRefreshToken(newRefreshToken);

        const expiresAt =
            this.getRefreshTokenExpiry();

        await refreshTokenRepository.create({
            user_id: user.id,
            token_hash: newRefreshTokenHash,
            expires_at: expiresAt
        });

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }


    async logout(refreshToken) {

        if (!refreshToken) {
            const error = new Error("Refresh token is required");
            error.status = 400;
            throw error;
        }

        const tokenHash =
            this.hashRefreshToken(refreshToken);

        const storedToken =
            await refreshTokenRepository.findByTokenHash(
                tokenHash
            );

        if (!storedToken) {
            return;
        }

        await refreshTokenRepository.revokeById(
            storedToken.id
        );
    }


    async getCurrentUser(userId) {

        const user =
            await userRepository.findById(userId);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        return user;
    }

}


export default new AuthService();