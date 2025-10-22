import { createPool, Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const pool: Pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'efacilities',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export interface StudentFeedback {
  roll: string;
  name: string;
  branch: string;
  accyear: string;
  contact: string;
  email: string;
  q1: number;  // Rating 1-5
  q2: number;  // Rating 1-5
  q3: number;  // Rating 1-5
  q4: number;  // Rating 1-5
  q5: number;  // Rating 1-5
  q6: number;  // Rating 1-5
  q7: number;  // Rating 1-5
  q8: number;  // Rating 1-5
  q9: number;  // Rating 1-5
  q10: number; // Rating 1-5
  q11: number; // Rating 1-5
  q12: number; // Rating 1-5
  q13: number; // Rating 1-5
  q14: number; // Rating 1-5
  q15: string; // Text comments/suggestions
  q16: number; // Rating 1-5
  q17: number; // Rating 1-5
  q18: number; // Rating 1-5
  q19: number; // Rating 1-5
  q20: number; // Rating 1-5
  q21: number; // Rating 1-5
}

export const efacilitiesService = {
  async submitFeedback(feedback: StudentFeedback): Promise<void> {
    try {
      await pool.execute(
        `INSERT INTO efacilities (
          roll, name, branch, accyear, contact, email,
          q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
          q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          feedback.roll,
          feedback.name,
          feedback.branch,
          feedback.accyear,
          feedback.contact,
          feedback.email,
          feedback.q1,
          feedback.q2,
          feedback.q3,
          feedback.q4,
          feedback.q5,
          feedback.q6,
          feedback.q7,
          feedback.q8,
          feedback.q9,
          feedback.q10,
          feedback.q11,
          feedback.q12,
          feedback.q13,
          feedback.q14,
          feedback.q15,
          feedback.q16,
          feedback.q17,
          feedback.q18,
          feedback.q19,
          feedback.q20,
          feedback.q21
        ]
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  },

  async getFeedbackByRoll(roll: string): Promise<StudentFeedback | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM efacilities WHERE roll = ?',
        [roll]
      );
      return rows[0] as StudentFeedback || null;
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw new Error('Failed to get feedback');
    }
  }
}