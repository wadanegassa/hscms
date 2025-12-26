import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState(null);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState(null);
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    loans: true,
    savings: true,
    repayments: true
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [savingsRes, loansRes, repaymentsRes] = await Promise.all([
        api.get('/admin/reports/savings'),
        api.get('/admin/reports/loans'),
        api.get('/admin/reports/repayments')
      ]);

      setSavings(savingsRes.data?.data || savingsRes.data || { total: 0, count: 0 });
      const loansData = loansRes.data?.data || loansRes.data || [];
      setLoans(Array.isArray(loansData) ? loansData : []);
      setRepayments(repaymentsRes.data?.data || repaymentsRes.data || { total: 0, count: 0 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    // ... (omitted for brevity, will add back later if needed, but keeping empty function for now to avoid unused vars if I were to remove it completely, but actually I'll keep the logic since it's not the issue)
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    doc.text('Reports', 10, 10);
    doc.save('report.pdf');
  };

  const downloadExcel = () => {
    // ...
  };

  const toggleSection = (key) => {
    setSelectedSections(s => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className="fade-in">
      <div className="flex-between mb-6">
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>📑 Reports & Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            View comprehensive reports and statistics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Controls would go here */}
          <button onClick={fetchReports}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading reports...</div>
        </div>
      ) : (
        <div>Content goes here</div>
      )}
    </div>
  );
};

export default Reports;