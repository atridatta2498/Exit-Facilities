const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch (err) {
  console.error('Error loading PDFKit:', err);
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://62.72.31.209:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/api/feedback', async (req, res) => {
  try {
    const fb = req.body;
    // basic validation
    if (!fb.roll) return res.status(400).json({ error: 'Missing roll' });

    // check if roll already submitted
    try {
      const [existing] = await pool.execute('SELECT COUNT(*) as c FROM efacilities WHERE roll = ?', [fb.roll]);
      const count = existing && existing[0] && existing[0].c ? existing[0].c : (existing[0] && Object.values(existing[0])[0]) || 0;
      if (Number(count) > 0) {
        return res.status(409).json({ error: 'already_submitted' });
      }
    } catch (chkErr) {
      console.error('Check existing error', chkErr);
      // continue to attempt insert (or fail)
    }

    const params = [
      fb.roll, fb.name, fb.branch, fb.accyear, fb.contact, fb.email,
      fb.q1, fb.q2, fb.q3, fb.q4, fb.q5, fb.q6, fb.q7, fb.q8, fb.q9, fb.q10,
      fb.q11, fb.q12, fb.q13, fb.q14, fb.q15 || '', fb.q16, fb.q17, fb.q18, fb.q19, fb.q20, fb.q21
    ];

    const sql = `INSERT INTO efacilities (
      roll, name, branch, accyear, contact, email,
      q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
      q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21
    ) VALUES (${params.map(() => '?').join(',')})`;

    await pool.execute(sql, params);
    res.json({ success: true });
  } catch (err) {
    console.error('Insert error', err);
    res.status(500).json({ error: 'insert_failed' });
  }
});

// GET submission by roll (returns 200 with row if exists, 404 if not)
app.get('/api/feedback/:roll', async (req, res) => {
  try {
    const { roll } = req.params;
    console.log(`Searching for roll number: ${roll}`);
    
    // Check database connection
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    
    const [rows] = await connection.execute('SELECT * FROM efacilities WHERE roll = ?', [roll]);
    connection.release();
    
    console.log(`Query results:`, rows);
    
    if (rows && rows.length > 0) {
      return res.json(rows[0]);
    }
    console.log(`No records found for roll: ${roll}`);
    return res.status(404).json({ error: 'not_found', message: `No feedback found for roll number ${roll}` });
  } catch (err) {
    console.error('Get by roll error:', err);
    if (err.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'db_connection_failed', message: 'Unable to connect to database' });
    }
    res.status(500).json({ error: 'query_failed', message: err.message });
  }
});

// Get submissions filtered by branches query param: ?branches=CSE,CST
app.get('/api/submissions', async (req, res) => {
  try {
    const { branches } = req.query;
    let rows;
    if (!branches) {
      [rows] = await pool.execute('SELECT * FROM efacilities ORDER BY roll DESC LIMIT 100');
    } else {
      const branchList = String(branches).split(',').map(s => s.trim()).filter(Boolean);
      if (branchList.length === 0) {
        [rows] = await pool.execute('SELECT * FROM efacilities ORDER BY roll DESC LIMIT 100');
      } else {
        const placeholders = branchList.map(() => '?').join(',');
        const sql = `SELECT * FROM efacilities WHERE branch IN (${placeholders}) ORDER BY roll DESC`;
        [rows] = await pool.execute(sql, branchList);
      }
    }
    res.json(rows);
  } catch (err) {
    console.error('Get submissions error', err);
    res.status(500).json({ error: 'query_failed' });
  }
});

// Compute aggregated stats per question (q1..q21)
app.get('/api/stats', async (req, res) => {
  try {
    const { branches } = req.query;
    let rows;
    if (!branches) {
      [rows] = await pool.execute('SELECT * FROM efacilities');
    } else {
      const branchList = String(branches).split(',').map(s => s.trim()).filter(Boolean);
      if (branchList.length === 0) {
        [rows] = await pool.execute('SELECT * FROM efacilities');
      } else {
        const placeholders = branchList.map(() => '?').join(',');
        const sql = `SELECT * FROM efacilities WHERE branch IN (${placeholders})`;
        [rows] = await pool.execute(sql, branchList);
      }
    }

    const totalUsers = (rows && rows.length) || 0;

    const questionsText = [
      'Digital Library Facility',
      'The timings of the Library',
      'Services of the Library staff', 
      'Coverage of buses to various routes',
      'The condition of the buses',
      'Maintenance of Canteen',
      'Quality of the food',
      'Maintenance of Labs',
      'Cooperation of Lab In-charges',
      'Internet facility',
      'Maintenance of Hostels',
      'Tidiness of Hostels',
      'Maintenance of Toilets',
      'Sports & Games facilities in the college',
      'Utility of indoor stadium',
      'College ambience',
      'Drinking water facility',
      'Power back up facility',
      'Department library',
      'Departmental store in the campus',
      'Banking facility in the college'
    ];

    const stats = [];
    for (let i = 1; i <= 21; i++) {
      const key = `q${i}`;
      // For q15 (comments) skip numeric aggregation
      if (i === 15) {
        // Count non-empty suggestions
        const suggestions = (rows || []).filter(r => r && r[key] && String(r[key]).trim() !== '');
        stats.push({
          qno: i,
          question: questionsText[i - 1] || key,
          poor: 0,
          average: 0,
          aboveaverage: 0,
          good: 0,
          excellent: 0,
          weightedAvg: null,
          totalUsers
        });
        continue;
      }

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;
      for (const r of (rows || [])) {
        const v = r && r[key];
        const n = Number(v);
        if (!Number.isNaN(n) && n >= 1 && n <= 5) {
          counts[n] = (counts[n] || 0) + 1;
          sum += n;
        }
      }
      const totalResponses = counts[1] + counts[2] + counts[3] + counts[4] + counts[5];
      const weightedAvg = totalResponses > 0 ? +(sum / totalResponses).toFixed(1) : null;

      stats.push({
        qno: i,
        question: questionsText[i - 1] || key,
        poor: counts[1],
        average: counts[2],
        aboveaverage: counts[3],
        good: counts[4],
        excellent: counts[5],
        weightedAvg,
        totalUsers
      });
    }

    res.json({ totalUsers, stats });
  } catch (err) {
    console.error('Stats error', err);
    res.status(500).json({ error: 'stats_failed' });
  }
});

// PDF Download endpoint
app.get('/api/stats/download', async (req, res) => {
  try {
    console.log('PDF download request received');
    const { branches } = req.query;
    console.log('Branches:', branches);
    let rows;
    if (!branches) {
      [rows] = await pool.execute('SELECT * FROM efacilities');
    } else {
      const branchList = String(branches).split(',').map(s => s.trim()).filter(Boolean);
      if (branchList.length === 0) {
        [rows] = await pool.execute('SELECT * FROM efacilities');
      } else {
        const placeholders = branchList.map(() => '?').join(',');
        const sql = `SELECT * FROM efacilities WHERE branch IN (${placeholders})`;
        [rows] = await pool.execute(sql, branchList);
      }
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=stats-${Date.now()}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header
    doc.fontSize(18)
      .text('SRI VASAVI ENGINEERING COLLEGE (AUTONOMOUS)', { align: 'center' })
      .fontSize(14)
      .moveDown(0.5)
      .text('PEDATADEPALLI, TADEPALLIGUDEM-534 101. W.G.Dist.', { align: 'center' })
      .moveDown(0.5)
      .text('Department of Computer Science & Engineering (Accredited by NBA)', { align: 'center' })
      .moveDown(1.5);

    // Add course info
    doc.fontSize(12)
      .text('Course Information', { underline: true })
      .moveDown(0.5);
    
    doc.font('Helvetica');
    const courseInfo = {
      'Course Name': 'ADVANCED DATA STRUCTURES & ALGORITHM ANALYSIS',
      'Branch': branches || 'All',
      'Academic Year': '2024-2025'
    };

    Object.entries(courseInfo).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
    
    doc.moveDown(1.5);

    // Create table header
    const colWidths = {
      sno: 30,
      qno: 200,
      poor: 40,
      avg: 40,
      above: 40,
      good: 40,
      exc: 40,
      weight: 50,
      users: 50
    };

    const headers = [
      { text: 'SNO', width: colWidths.sno },
      { text: 'QNO', width: colWidths.qno },
      { text: 'POOR', width: colWidths.poor },
      { text: 'AVG', width: colWidths.avg },
      { text: 'ABOVE', width: colWidths.above },
      { text: 'GOOD', width: colWidths.good },
      { text: 'EXC', width: colWidths.exc },
      { text: 'W.AVG', width: colWidths.weight },
      { text: 'USERS', width: colWidths.users }
    ];

    // Draw table headers
    let y = doc.y;
    let x = 50;
    doc.fontSize(10);

    headers.forEach(header => {
      doc.text(header.text, x, y, { width: header.width, align: 'center' });
      x += header.width;
    });

    y += 20;
    doc.moveTo(50, y).lineTo(590, y).stroke();

    // Calculate stats
    const questionsText = [
      'Digital Library Facility',
      'The timings of the Library',
      'Services of the Library staff',
      'Coverage of buses to various routes',
      'The condition of the buses',
      'Maintenance of Canteen',
      'Quality of the food',
      'Maintenance of Labs',
      'Cooperation of Lab In-charges',
      'Internet facility',
      'Maintenance of Hostels',
      'Tidiness of Hostels',
      'Maintenance of Toilets',
      'Sports & Games facilities in the college',
      'Utility of indoor stadium',
      'College ambience',
      'Drinking water facility',
      'Power back up facility',
      'Department library',
      'Departmental store in the campus',
      'Banking facility in the college'
    ];

    const stats = [];
    const totalUsers = (rows && rows.length) || 0;

    for (let i = 1; i <= 21; i++) {
      const key = `q${i}`;
      if (i === 15) {
        stats.push({
          qno: i,
          question: questionsText[i - 1] || key,
          poor: 0, average: 0, aboveaverage: 0, good: 0, excellent: 0,
          weightedAvg: null,
          totalUsers
        });
        continue;
      }

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;
      for (const r of (rows || [])) {
        const v = r && r[key];
        const n = Number(v);
        if (!Number.isNaN(n) && n >= 1 && n <= 5) {
          counts[n] = (counts[n] || 0) + 1;
          sum += n;
        }
      }
      
      const totalResponses = counts[1] + counts[2] + counts[3] + counts[4] + counts[5];
      const weightedAvg = totalResponses > 0 ? +(sum / totalResponses).toFixed(1) : null;

      stats.push({
        qno: i,
        question: questionsText[i - 1] || key,
        poor: counts[1],
        average: counts[2],
        aboveaverage: counts[3],
        good: counts[4],
        excellent: counts[5],
        weightedAvg,
        totalUsers
      });
    }

    // Draw table rows
    stats.forEach((stat, idx) => {
      if (doc.y > 700) {
        doc.addPage();
        y = 50;
        
        // Add headers on new page
        x = 50;
        headers.forEach(header => {
          doc.text(header.text, x, y, { width: header.width, align: 'center' });
          x += header.width;
        });
        y += 20;
        doc.moveTo(50, y).lineTo(590, y).stroke();
      }

      y = doc.y + 10;
      x = 50;

      // SNO
      doc.text(String(idx + 1), x, y, { width: colWidths.sno, align: 'center' });
      x += colWidths.sno;

      // Question
      doc.text(stat.question, x, y, { width: colWidths.qno });
      x += colWidths.qno;

      // Poor
      doc.text(String(stat.poor), x, y, { width: colWidths.poor, align: 'center' });
      x += colWidths.poor;

      // Average
      doc.text(String(stat.average), x, y, { width: colWidths.avg, align: 'center' });
      x += colWidths.avg;

      // Above Average
      doc.text(String(stat.aboveaverage), x, y, { width: colWidths.above, align: 'center' });
      x += colWidths.above;

      // Good
      doc.text(String(stat.good), x, y, { width: colWidths.good, align: 'center' });
      x += colWidths.good;

      // Excellent
      doc.text(String(stat.excellent), x, y, { width: colWidths.exc, align: 'center' });
      x += colWidths.exc;

      // Weighted Average
      doc.text(stat.weightedAvg?.toString() || '-', x, y, { width: colWidths.weight, align: 'center' });
      x += colWidths.weight;

      // Total Users
      doc.text(String(stat.totalUsers), x, y, { width: colWidths.users, align: 'center' });

      // Add horizontal line
      y += 20;
      doc.moveTo(50, y).lineTo(590, y).stroke();
      
      doc.y = y;
    });

    // Add college vision and mission
    doc.moveDown(2);
    doc.fontSize(11)
      .text('Vision:', { continued: true })
      .fontSize(10)
      .text(' To evolve as a centre of academic and research excellence in the area of Computer Science and Engineering.')
      .moveDown(0.5)
      .fontSize(11)
      .text('Mission:', { continued: true })
      .fontSize(10)
      .text('\n • To utilize innovative learning methods for academic improvement.\n • To encourage faculty and students to match the futuristic requirements of Computer Science and Engineering.\n • To inculcate values and etiquette to help in bringing students into good citizens.');

    // Finalize PDF
    doc.end();

  } catch (err) {
    console.error('PDF generation error', err);
    res.status(500).json({ error: 'pdf_generation_failed' });
  }
});

const PORT = process.env.SERVER_PORT || 5555;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on all interfaces, port ${PORT}`);
});
