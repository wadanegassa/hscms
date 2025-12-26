import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [filter, setFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(u => u.map(x => x._id === id ? { ...x, status: newStatus } : x));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  }

  const list = users.filter(u => filter === 'All' || u.role === filter.toLowerCase());

  return (
    <div>
      <h3>Manage Users</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" placeholder="Search by name or email" />
          <select className="input" value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Admin</option>
            <option>Staff</option>
            <option>Member</option>
          </select>
        </div>
        <button className="btn" onClick={fetchUsers}>Refresh</button>
      </div>

      <div className="table">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 12,
                      background: u.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: u.status === 'active' ? '#065f46' : '#991b1b'
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn secondary" onClick={() => toggleStatus(u._id, u.status)}>
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
export default Users;
