import pool from "../database/db.js";

class UserRepository {

    async findByEmail(email) {
        const query = `
        SELECT *
        FROM users
        WHERE email = $1
        `;
        const result = await pool.query(query, [email]);

        return result.rows[0];
    }
    async create(userData) {
  // 1. Destructure the properties from the incoming object
  const {
    full_name,
    email,
    password_hash,
    role,
  } = userData;

  // 2. Write the parameterized SQL query
  const query = `
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  // 3. Map the destructured variables to the $1, $2, $3, $4 placeholders
  const values = [full_name, email, password_hash, role];

  // 4. Execute the query using the pg pool
  try {
    const result = await pool.query(query, values);
    
    // Return the newly inserted row
    return result.rows[0]; 
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

}

export default new UserRepository();




// Remember

// Repository = SQL only

// Never write:

// Validation ❌
// JWT ❌
// Business Logic ❌

// Only database queries.