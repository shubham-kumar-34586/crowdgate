import pool from "../database/db.js";

class RefreshTokenRepository {

    async create(refreshTokenData) {

        const {
            user_id,
            token_hash,
            expires_at
        } = refreshTokenData;

        const query = `
            INSERT INTO refresh_tokens (
                user_id,
                token_hash,
                expires_at
            )
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [
            user_id,
            token_hash,
            expires_at
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }


    async findByTokenHash(tokenHash) {

        const query = `
            SELECT *
            FROM refresh_tokens
            WHERE token_hash = $1
            AND revoked_at IS NULL
            AND expires_at > CURRENT_TIMESTAMP;
        `;

        const result = await pool.query(query, [tokenHash]);

        return result.rows[0];
    }


    async revokeById(id) {

        const query = `
            UPDATE refresh_tokens
            SET revoked_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

}

export default new RefreshTokenRepository();