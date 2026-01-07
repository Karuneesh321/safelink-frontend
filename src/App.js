import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, User, LogOut, Activity, CheckCircle, Clock, Users, Bell, Info, BookOpen, Mail, Building, Award, Target, Shield } from 'lucide-react';




const API_URL = 'https://safelink-backend-hw4h.onrender.com/api';

export default function SafeLinkApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      
      if (userData.role === 'admin' || userData.role === 'volunteer') {
        fetchAlerts();
        fetchStats();
      } else {
        fetchMyAlerts();
      }
    }
    
    getCurrentLocation();
  }, [token]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Fetch alerts error:', error);
    }
  };

  const fetchMyAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Fetch my alerts error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentPage('home');
  };

  if (!token) {
    return (
      <>
        
        <LandingPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">SafeLink</h1>
          </div>
          
          <nav className="flex gap-4 items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-lg ${currentPage === 'home' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Home
            </button>
            
            {(user?.role === 'admin' || user?.role === 'volunteer') && (
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg ${currentPage === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Dashboard
              </button>
            )}
            
            <button
              onClick={() => setCurrentPage('myAlerts')}
              className={`px-4 py-2 rounded-lg ${currentPage === 'myAlerts' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              My Alerts
            </button>

            <button
              onClick={() => setCurrentPage('guides')}
              className={`px-4 py-2 rounded-lg ${currentPage === 'guides' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Guides
            </button>

            <button
              onClick={() => setCurrentPage('about')}
              className={`px-4 py-2 rounded-lg ${currentPage === 'about' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              About
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <User size={20} />
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{user?.role}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage location={location} token={token} fetchMyAlerts={fetchMyAlerts} />}
        {currentPage === 'dashboard' && <Dashboard alerts={alerts} stats={stats} token={token} fetchAlerts={fetchAlerts} />}
        {currentPage === 'myAlerts' && <MyAlerts alerts={alerts} />}

      </main>
    </div>
  );
}

function LandingPage({ setToken, setUser, setCurrentPage }) {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-600">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <AlertTriangle className="mx-auto text-white mb-4" size={80} />
          <h1 className="text-5xl font-bold text-white mb-4">SafeLink</h1>
          <p className="text-2xl text-white mb-8">Emergency Alert System</p>
          <p className="text-xl text-white opacity-90 mb-8">Help is just one click away</p>
          
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white text-red-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-xl"
          >
            Get Started →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-bold mb-2">One-Click Alert</h3>
            <p className="text-gray-600">Send emergency alerts instantly with your GPS location</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Community Support</h3>
            <p className="text-gray-600">Connect with nearby volunteers ready to help</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
            <p className="text-gray-600">Get SMS and email notifications instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({ setToken, setUser, setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setCurrentPage('home');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <AlertTriangle className="mx-auto text-red-600 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800">SafeLink</h1>
          <p className="text-gray-600 mt-2">Emergency Alert System</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-medium ${isLogin ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-medium ${!isLogin ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ location, token, fetchMyAlerts }) {
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'bg-red-500' },
    { value: 'accident', label: 'Accident', icon: '🚗', color: 'bg-orange-500' },
    { value: 'fire', label: 'Fire', icon: '🔥', color: 'bg-red-600' },
    { value: 'flood', label: 'Flood', icon: '🌊', color: 'bg-blue-500' },
    { value: 'violence', label: 'Violence', icon: '⚠️', color: 'bg-purple-500' },
    { value: 'other', label: 'Other', icon: '📢', color: 'bg-gray-500' }
  ];

  const sendAlert = async () => {
    if (!emergencyType) {
      alert('Please select emergency type');
      return;
    }

    if (!location) {
      alert('Location not available. Please enable GPS.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          emergencyType,
          description,
          latitude: location.latitude,
          longitude: location.longitude,
          address: 'Current Location'
        })
      });

      if (response.ok) {
        setAlertSent(true);
        setShowForm(false);
        setEmergencyType('');
        setDescription('');
        fetchMyAlerts();
        setTimeout(() => setAlertSent(false), 5000);
      }
    } catch (error) {
      console.error('Send alert error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {alertSent && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            <p className="font-medium text-green-800">Emergency alert sent! Help is on the way. You will receive SMS and email notifications.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <AlertTriangle className="mx-auto text-red-600 mb-4" size={80} />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Emergency Alert System</h2>
        <p className="text-gray-600 mb-8">Click the button below if you need immediate help</p>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-red-700 transform hover:scale-105 transition-all shadow-lg"
          >
            🚨 SEND EMERGENCY ALERT
          </button>
        ) : (
          <div className="text-left space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Emergency Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setEmergencyType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      emergencyType === type.value
                        ? `${type.color} text-white border-transparent`
                        : 'bg-white border-gray-300 hover:border-red-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={sendAlert}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700"
              >
                🚨 Send Alert Now
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-4 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {location && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-green-600" />
              <span>Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
            </div>
          </div>
        )}
        {location && (
  <div className="mt-4 rounded-xl overflow-hidden shadow">
    <iframe
      title="User Location Map"
      width="100%"
      height="300"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
    />
  </div>
)}

      </div>
    </div>
    
  );
}

function Dashboard({ alerts, stats, token, fetchAlerts }) {
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const updateAlertStatus = async (alertId, status) => {
    try {
      await fetch(`${API_URL}/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchAlerts();
    } catch (error) {
      console.error('Update alert error:', error);
    }
  };

  const assignToAlert = async (alertId) => {
    try {
      await fetch(`${API_URL}/alerts/${alertId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchAlerts();
    } catch (error) {
      console.error('Assign alert error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Bell className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeAlerts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-800">{stats.resolvedAlerts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Volunteers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalVolunteers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalAlerts || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="text-red-600" />
            Active Emergency Alerts
          </h2>
        </div>

        <div className="divide-y">
          {activeAlerts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="mx-auto mb-3 text-green-500" size={48} />
              <p>No active alerts. All clear!</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.emergencyType.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-800 font-medium mb-2">{alert.description || 'No description'}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {alert.userId?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {alert.userId?.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        Location shared
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => assignToAlert(alert._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Assign Me
                    </button>
                    <button
                      onClick={() => updateAlertStatus(alert._id, 'resolved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MyAlerts({ alerts }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">My Emergency Alerts</h2>
        <p className="text-sm text-gray-600 mt-1">You receive SMS and email notifications for updates</p>
      </div>

      <div className="divide-y">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertTriangle className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No alerts sent yet.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {alert.emergencyType.toUpperCase()}
                  </span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-800 mb-2">{alert.description || 'No description'}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  Location shared
                </span>
                {alert.assignedTo?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {alert.assignedTo.length} responders assigned
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

