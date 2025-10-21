import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Header,
  DashboardContainer,
  DashboardHeader,
  HeaderLeft,
  CollegeLogo,
  HeaderTitle,
  HeaderControls,
  DownloadButton,
  LogoutButton,
  ResponsesGrid,
  ResponseCard,
  ResponseTitle,
  ResponseList,
  ResponseItem,
  QuestionText,
  AnswerText
} from './AdminDashboard.styles';

interface Response {
  id: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Response[]>([]);
  const adminType = localStorage.getItem('adminType');

  useEffect(() => {
    document.title = 'Admin Dashboard | Sri Vasavi Engineering College';
  }, []);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Fetch responses based on admin type
    let isMounted = true;
    const fetchResponses = async () => {
      try {
        if (!adminType) return;
        
        // Get branch filter from branchInfo
        const department = adminType.toUpperCase() as DepartmentType;
        const branches = branchInfo[department]?.branchFilter || '';
        const res = await fetch(`http://localhost:4000/api/stats?branches=${encodeURIComponent(branches)}`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        const body = await res.json();
        const stats = (body && body.stats) || [];

        // Map stats into display rows
        const mapped = stats.map((s: any, idx: number) => ({
          id: String(s.qno),
          questions: [
            { question: s.qno + '. ' + s.question, answer: `${s.poor} (${totalPercent(s.poor, s.totalUsers)})` },
            { question: '', answer: `${s.average} (${totalPercent(s.average, s.totalUsers)})` },
            { question: '', answer: `${s.aboveaverage} (${totalPercent(s.aboveaverage, s.totalUsers)})` },
            { question: '', answer: `${s.good} (${totalPercent(s.good, s.totalUsers)})` },
            { question: '', answer: `${s.excellent} (${totalPercent(s.excellent, s.totalUsers)})` }
          ],
          timestamp: '',
          weightedAvg: s.weightedAvg,
          totalUsers: s.totalUsers
        }));
        if (isMounted) setResponses(mapped as Response[]);
      } catch (err) {
        console.error('Fetch responses failed', err);
      }
    };

    fetchResponses();
    const interval = setInterval(fetchResponses, 15000); // auto-refresh every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminType');
    navigate('/admin/login');
  };

  const getAnswerType = (answer: string): 'Average' | 'Moderate' | 'Good' => {
    switch (answer.toLowerCase()) {
      case 'good':
        return 'Good';
      case 'moderate':
        return 'Moderate';
      default:
        return 'Average';
    }
  };

  const totalPercent = (count: number, total: number) => {
    if (!total || total === 0) return '0%';
    const p = Math.round((count / total) * 100);
    return `${p}%`;
  };

  type DepartmentInfo = {
    department: string;
    branchFilter: string;
};

type DepartmentType = 'CSE' | 'AIML' | 'EEE' | 'ME' | 'CE' | 'BSH' | 'MBA';

const branchInfo: Record<DepartmentType, DepartmentInfo> = {
    'CSE': {
      department: 'Department of Computer Science & Engineering (Accredited by NBA)',
      branchFilter: 'CSE,CST'
    },
    'AIML': {
      department: 'Department of Artificial Intelligence and Machine Learning (Accredited by NBA)',
      branchFilter: 'CAI,AIML'
    },
    'EEE': {
      department: 'Department of Electrical and Electronics Engineering (Accredited by NBA)',
      branchFilter: 'EEE'
    },
    'ME': {
      department: 'Department of Mechanical Engineering (Accredited by NBA)',
      branchFilter: 'MECH'
    },
    'CE': {
      department: 'Department of Civil Engineering (Accredited by NBA)',
      branchFilter: 'CIVIL'
    },
    'BSH': {
      department: 'Department of Basic Sciences and Humanities',
      branchFilter: 'BSH'
    },
    'MBA': {
      department: 'Department of Master of Business Administration',
      branchFilter: 'MBA'
    }
  };

  const generatePDF = () => {
    // Create a new PDF document in A4 landscape
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add logo
    const logoImg = new Image();
    logoImg.src = '/logo192.png';
    doc.addImage(logoImg, 'PNG', 20, 10, 25, 25); // x, y, width, height
    
    // Add header text
    doc.setFontSize(14);
    doc.text('SRI VASAVI ENGINEERING COLLEGE (AUTONOMOUS)', doc.internal.pageSize.width / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('PEDATADEPALLI, TADEPALLIGUDEM-534 101. W.G.Dist.', doc.internal.pageSize.width / 2, 22, { align: 'center' });
    
    if (adminType) {
        const department = adminType.toUpperCase() as DepartmentType;
        if (branchInfo[department]) {
          doc.setFontSize(11);
          doc.text(branchInfo[department].department, doc.internal.pageSize.width / 2, 29, { align: 'center' });
        }
    }

    // Add course information table
    autoTable(doc, {
      startY: 40,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 5 }
    });

    // Add statistics table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [[
        'SNO',
        'QNO',
        'POOR',
        'AVERAGE',
        'ABOVE AVERAGE',
        'GOOD',
        'EXCELLENT',
        'WEIGHTED AVG',
        'USERS'
      ]],
      body: responses.map((r, idx) => [
        idx + 1,
        r.questions[0].question,
        r.questions[0].answer,
        r.questions[1].answer,
        r.questions[2].answer,
        r.questions[3].answer,
        r.questions[4].answer,
        (r as any).weightedAvg?.toFixed(2) ?? '-',
        (r as any).totalUsers ?? '-'
      ]),
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1,
        halign: 'center'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      }
    });

    // Add footer for all departments
    const startY = (doc as any).lastAutoTable.finalY + 20;

    // Common footer text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);  // Gray color for footer
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const footerText = [
      `Report generated on ${currentDate}`,
      'Sri Vasavi Engineering College (Autonomous)',
      'Pedatadepalli, Tadepalligudem - 534101',
      'West Godavari District, Andhra Pradesh'
    ];

    footerText.forEach((text, index) => {
      doc.text(text, doc.internal.pageSize.width / 2, startY + (index * 6), { align: 'center' });
    });

    // Save the PDF
    doc.save(`${adminType?.toUpperCase()}_Statistics.pdf`);
  };

  return (
    
    <DashboardContainer>
      <DashboardHeader>
        <HeaderLeft>
          
          <HeaderTitle>
            {adminType?.toUpperCase()}
          </HeaderTitle>
        </HeaderLeft>
        <HeaderControls>
          <DownloadButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
          >
            Download PDF
          </DownloadButton>
          <LogoutButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            Logout
          </LogoutButton>
        </HeaderControls>
      </DashboardHeader>
      <div
        style={{
          overflowX: 'auto',
          maxHeight: '60vh',
          overflowY: 'auto',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginBottom: '2rem',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px' }}>SNO</th>
              <th style={{ padding: '12px' }}>QNO</th>
              <th style={{ padding: '12px' }}>POOR</th>
              <th style={{ padding: '12px' }}>AVERAGE</th>
              <th style={{ padding: '12px' }}>ABOVEAVERAGE</th>
              <th style={{ padding: '12px' }}>GOOD</th>
              <th style={{ padding: '12px' }}>EXCELLENT</th>
              <th style={{ padding: '12px' }}>WEIGHTEDAVG</th>
              <th style={{ padding: '12px' }}>NO OF USERS</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((r, idx) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px' }}>{idx + 1}</td>
                <td style={{ padding: '10px' }}>{r.questions[0].question}</td>
                <td style={{ padding: '10px' }}>{r.questions[0].answer}</td>
                <td style={{ padding: '10px' }}>{r.questions[1].answer}</td>
                <td style={{ padding: '10px' }}>{r.questions[2].answer}</td>
                <td style={{ padding: '10px' }}>{r.questions[3].answer}</td>
                <td style={{ padding: '10px' }}>{r.questions[4].answer}</td>
                <td style={{ padding: '10px' }}>{(r as any).weightedAvg ?? '-'}</td>
                <td style={{ padding: '10px' }}>{(r as any).totalUsers ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;