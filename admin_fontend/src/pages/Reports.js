import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    savings: { total: 0, count: 0 },
    loans: { total: 0, count: 0 },
    repayments: { total: 0, count: 0 }
  });
  const [reportType, setReportType] = useState(location.state?.reportType || 'savings');
  const [detailedData, setDetailedData] = useState([]);
  const [fetchingDetailed, setFetchingDetailed] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchDetailedData();
  }, [reportType]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const [savingsRes, loansRes, repaymentsRes] = await Promise.all([
        api.get('/admin/reports/savings'),
        api.get('/admin/reports/loans'),
        api.get('/admin/reports/repayments')
      ]);

      setSummary({
        savings: savingsRes.data?.data || savingsRes.data || { total: 0, count: 0 },
        loans: {
          total: (loansRes.data?.data || loansRes.data || []).reduce((acc, curr) => acc + (curr.total || 0), 0),
          count: (loansRes.data?.data || loansRes.data || []).reduce((acc, curr) => acc + (curr.count || 0), 0)
        },
        repayments: repaymentsRes.data?.data || repaymentsRes.data || { total: 0, count: 0 }
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch summary data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedData = async () => {
    try {
      setFetchingDetailed(true);
      const endpoint = reportType === 'audit' ? '/admin/audit-logs' : `/admin/reports/${reportType}/detailed`;
      const res = await api.get(endpoint);
      setDetailedData(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to fetch detailed ${reportType} data`);
    } finally {
      setFetchingDetailed(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    const date = new Date().toLocaleString();

    doc.setFontSize(20);
    doc.text('Harari Sacco Management System', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.text(title, 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 105, 32, { align: 'center' });

    const tableColumn = reportType === 'loans'
      ? ["Member", "Amount", "Status", "Date"]
      : (reportType === 'members' || reportType === 'staff')
        ? ["Name", "Email", "Phone", "Status", "Joined"]
        : reportType === 'audit'
          ? ["Action", "Performed By", "Target", "Date"]
          : ["Member", "Amount", "Date"];

    const tableRows = detailedData.map(item => {
      if (reportType === 'members' || reportType === 'staff') {
        return [
          item.fullName || 'N/A',
          item.email || 'N/A',
          item.phone || 'N/A',
          item.status || 'N/A',
          item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
        ];
      }
      if (reportType === 'audit') {
        return [
          item.action || 'N/A',
          item.performedBy?.fullName || 'System',
          item.targetEntity || 'N/A',
          item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'
        ];
      }
      const row = [
        item.memberId?.fullName || 'N/A',
        (item.amount || 0).toLocaleString(),
        reportType === 'loans' ? (item.status || 'N/A') : (item.date || item.createdAt ? new Date(item.date || item.createdAt).toLocaleDateString() : 'N/A'),
      ];
      if (reportType === 'loans') {
        row.push(item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A');
      }
      return row;
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`${reportType}_report_${new Date().getTime()}.pdf`);
    toast.success('PDF Downloaded');
  };

  const downloadCSV = () => {
    if (detailedData.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = (reportType === 'members' || reportType === 'staff')
      ? ["Name", "Email", "Phone", "Status", "Joined"]
      : reportType === 'loans'
        ? ["Member", "Email", "Amount", "Status", "Date"]
        : reportType === 'audit'
          ? ["Action", "Performed By", "Target", "Date"]
          : ["Member", "Email", "Amount", "Date"];

    const csvRows = [
      headers.join(','),
      ...detailedData.map(item => {
        if (reportType === 'members' || reportType === 'staff') {
          return [
            `"${item.fullName}"`,
            `"${item.email}"`,
            `"${item.phone || 'N/A'}"`,
            `"${item.status}"`,
            `"${new Date(item.createdAt).toLocaleDateString()}"`
          ].join(',');
        }
        if (reportType === 'audit') {
          return [
            `"${item.action}"`,
            `"${item.performedBy?.fullName || 'System'}"`,
            `"${item.targetEntity || 'N/A'}"`,
            `"${new Date(item.timestamp).toLocaleString()}"`
          ].join(',');
        }
        const row = [
          `"${item.memberId?.fullName || 'N/A'}"`,
          `"${item.memberId?.email || 'N/A'}"`,
          item.amount || 0,
          reportType === 'loans' ? (item.status || 'N/A') : `"${item.date || item.createdAt ? new Date(item.date || item.createdAt).toLocaleDateString() : 'N/A'}"`,
        ];
        if (reportType === 'loans') {
          row.push(`"${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}"`);
        }
        return row.join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Downloaded');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Reports & Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Comprehensive insights and financial performance tracking.
          </p>
        </div>
        <button
          onClick={fetchSummary}
          className="btn"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            padding: '0.75rem 1.25rem',
            borderRadius: '14px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
          Sync Data
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card-static" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Savings</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>${(summary.savings?.total || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>From {summary.savings?.count || 0} transactions</div>
        </div>

        <div className="glass-card-static" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Loans</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>${(summary.loans?.total || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{summary.loans?.count || 0} active loans</div>
        </div>

        <div className="glass-card-static" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
          <div style={{ color: 'var(--warning)', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Repayments</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>${(summary.repayments?.total || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>From {summary.repayments?.count || 0} payments</div>
        </div>
      </div>

      <div className="glass-card-static" style={{ flex: 'none', margin: 0, padding: '2.5rem', display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.5rem' }}>Report Type:</span>
              {[
                { id: 'savings', label: 'Savings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
                { id: 'loans', label: 'Loans', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> },
                { id: 'repayments', label: 'Repayments', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
                { id: 'members', label: 'Members', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
                { id: 'staff', label: 'Staff', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg> },
                { id: 'audit', label: 'Audit', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`btn ${reportType === type.id ? 'active' : ''}`}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: reportType === type.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: reportType === type.id ? '#000' : 'var(--text-secondary)',
                    border: `1px solid ${reportType === type.id ? 'var(--primary)' : 'var(--border)'}`,
                    transition: 'all 0.3s ease',
                    boxShadow: reportType === type.id ? '0 4px 15px var(--primary-glow)' : 'none'
                  }}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={downloadPDF} className="btn" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              PDF
            </button>
            <button onClick={downloadCSV} className="btn" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              CSV
            </button>
          </div>
        </div>

        <div className="table-container" style={{ margin: 0, borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {fetchingDetailed ? (
            <div style={{ padding: '6rem', textAlign: 'center' }}>
              <div className="loading-spinner"></div>
              <div style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Generating report data...</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {(reportType === 'members' || reportType === 'staff') ? (
                    <>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>User Profile</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Joined Date</th>
                    </>
                  ) : reportType === 'audit' ? (
                    <>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Action</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Performed By</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Timestamp</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount</th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{reportType === 'loans' ? 'Status' : 'Date'}</th>
                      {reportType === 'loans' && <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Request Date</th>}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {detailedData.length > 0 ? (
                  detailedData.slice(0, 10).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', animation: `slideUp 0.4s ease forwards ${idx * 0.05}s`, opacity: 0 }}>
                      {(reportType === 'members' || reportType === 'staff') ? (
                        <>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.fullName || 'N/A'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.phone || 'N/A'}</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              background: item.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                              color: item.status === 'active' ? 'var(--primary)' : 'var(--danger)',
                              border: `1px solid ${item.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                            }}>
                              {item.status || 'N/A'}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </>
                      ) : reportType === 'audit' ? (
                        <>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.action || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{item.performedBy?.fullName || 'System'}</div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.targetEntity || 'N/A'}</td>
                          <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.memberId?.fullName || 'N/A'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.memberId?.email || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>${(item.amount || 0).toLocaleString()}</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            {reportType === 'loans' ? (
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                background: item.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: item.status === 'approved' ? 'var(--primary)' : 'var(--warning)',
                                border: `1px solid ${item.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                              }}>
                                {item.status || 'N/A'}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.date || item.createdAt ? new Date(item.date || item.createdAt).toLocaleDateString() : 'N/A'}</span>
                            )}
                          </td>
                          {reportType === 'loans' && (
                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                          )}
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                      No data available for the selected report type.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {detailedData.length > 10 && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing first 10 entries. Download full report for complete data.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;