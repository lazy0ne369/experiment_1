import { useState } from 'react';
import { getUsers, getSubmissions, deleteUser, deleteSubmission } from '../utils/storage';
import type { User, PropertySubmission } from '../types';
import { formatCurrency } from '../utils/recommendations';
import { Users, FileText, Trash2, Search, Eye, X } from 'lucide-react';
import './AdminPage.css';

type Tab = 'users' | 'submissions';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(getUsers());
  const [submissions, setSubmissions] = useState<PropertySubmission[]>(getSubmissions());
  const [selectedSubmission, setSelectedSubmission] = useState<PropertySubmission | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete their submissions.')) {
      deleteUser(userId);
      setUsers(getUsers());
      setSubmissions(getSubmissions());
    }
  };

  const handleDeleteSubmission = (submissionId: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(submissionId);
      setSubmissions(getSubmissions());
    }
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    independent_house: 'Independent House',
    plot: 'Plot',
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and property submissions</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <Users size={24} />
          <div>
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="admin-stat">
          <FileText size={24} />
          <div>
            <span className="stat-value">{submissions.length}</span>
            <span className="stat-label">Total Submissions</span>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Users
          </button>
          <button
            className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <FileText size={18} />
            Submissions
          </button>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'users' ? (
          <div className="data-table">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="empty-message">No users found</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="table-row">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                  <span className="user-date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span className="actions">
                    {user.role !== 'admin' && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="data-table submissions">
            <div className="table-header">
              <span>Property Type</span>
              <span>Location</span>
              <span>Size</span>
              <span>Budget</span>
              <span>Date</span>
              <span>Actions</span>
            </div>
            {filteredSubmissions.length === 0 ? (
              <div className="empty-message">No submissions found</div>
            ) : (
              filteredSubmissions.map((sub) => (
                <div key={sub.id} className="table-row">
                  <span className="property-type">{propertyTypeLabels[sub.propertyType]}</span>
                  <span className="location">{sub.location}</span>
                  <span className="size">{sub.size} sq ft</span>
                  <span className="budget">{formatCurrency(sub.budget)}</span>
                  <span className="date">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  <span className="actions">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedSubmission(sub)}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteSubmission(sub.id)}
                      title="Delete submission"
                    >
                      <Trash2 size={16} />
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSubmission(null)}>
              <X size={24} />
            </button>
            <h2>Submission Details</h2>
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Property Type:</span>
                <span>{propertyTypeLabels[selectedSubmission.propertyType]}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span>{selectedSubmission.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Size:</span>
                <span>{selectedSubmission.size} sq ft</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Budget:</span>
                <span>{formatCurrency(selectedSubmission.budget)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Condition:</span>
                <span className="capitalize">{selectedSubmission.condition}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Year Built:</span>
                <span>{selectedSubmission.yearBuilt}</span>
              </div>
            </div>
            <h3>Recommendations ({selectedSubmission.recommendations.length})</h3>
            <div className="modal-recommendations">
              {selectedSubmission.recommendations.map((rec) => (
                <div key={rec.recommendation.id} className="rec-item">
                  <span className="rec-title">{rec.recommendation.title}</span>
                  <span className="rec-cost">{formatCurrency(rec.estimatedCostForProperty)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
