import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Context for authentication
const AuthContext = createContext();

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, [token]);

  const login = (tokenData) => {
    setToken(tokenData.access_token);
    setUser(tokenData.user);
    localStorage.setItem('token', tokenData.access_token);
    localStorage.setItem('user', JSON.stringify(tokenData.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  return (
    <ThemeContext.Provider value={{ isDark, language, toggleTheme, toggleLanguage }}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Translation helper
const translations = {
  en: {
    appName: "Kesharwani Kirana Store Telecom",
    tagline: "Trusted telecom distributor for over 20 years",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
    role: "Role",
    distributor: "Distributor",
    agent: "Field Agent",
    retailer: "Retailer/POS",
    dashboard: "Dashboard",
    products: "Products",
    requests: "Requests",
    logout: "Logout",
    darkMode: "Dark Mode",
    language: "Language",
    totalProducts: "Total Products",
    pendingRequests: "Pending Requests",
    approvedRequests: "Approved Requests",
    fulfilledRequests: "Fulfilled Requests",
    createProduct: "Create Product",
    requestProduct: "Request Product",
    type: "Type",
    code: "Code",
    serialNumber: "Serial Number",
    price: "Price",
    status: "Status",
    sim: "SIM",
    mobile: "Mobile",
    fiber: "Fiber",
    quantity: "Quantity",
    reason: "Reason",
    submit: "Submit",
    orderId: "Order ID",
    date: "Date",
    stock: "Stock",
    currentStock: "Current Stock",
    stockTransactions: "Stock Transactions",
    resetStock: "Reset All Stock",
    selectAgent: "Select Agent",
    myRequests: "My Requests",
    retailerRequests: "Retailer Requests",
    totalAgents: "Total Agents",
    totalRetailers: "Total Retailers",
    totalStockAllocated: "Total Stock Allocated",
    approve: "Approve",
    fulfill: "Fulfill",
    pending: "Pending",
    approved: "Approved",
    fulfilled: "Fulfilled",
    rejected: "Rejected",
    requestFrom: "Request From",
    manageStock: "Manage Stock"
  },
  hi: {
    appName: "केशरवानी किराना स्टोर टेलिकॉम",
    tagline: "20 से अधिक वर्षों से भरोसेमंद टेलिकॉम वितरक",
    login: "लॉगिन",
    register: "पंजीकरण",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "नाम",
    phone: "फोन",
    role: "भूमिका",
    distributor: "वितरक",
    agent: "फील्ड एजेंट",
    retailer: "रिटेलर/पीओएस",
    dashboard: "डैशबोर्ड",
    products: "उत्पाद",
    requests: "अनुरोध",
    logout: "लॉगआउट",
    darkMode: "डार्क मोड",
    language: "भाषा",
    totalProducts: "कुल उत्पाद",
    pendingRequests: "लंबित अनुरोध",
    approvedRequests: "अनुमोदित अनुरोध",
    fulfilledRequests: "पूर्ण अनुरोध",
    createProduct: "उत्पाद बनाएं",
    requestProduct: "उत्पाद का अनुरोध",
    type: "प्रकार",
    code: "कोड",
    serialNumber: "सीरियल नंबर",
    price: "मूल्य",
    status: "स्थिति",
    sim: "सिम",
    mobile: "मोबाइल",
    fiber: "फाइबर",
    quantity: "मात्रा",
    reason: "कारण",
    submit: "जमा करें",
    orderId: "ऑर्डर आईडी",
    date: "दिनांक",
    stock: "स्टॉक",
    currentStock: "वर्तमान स्टॉक",
    stockTransactions: "स्टॉक लेनदेन",
    resetStock: "सभी स्टॉक रीसेट करें",
    selectAgent: "एजेंट चुनें",
    myRequests: "मेरे अनुरोध",
    retailerRequests: "रिटेलर अनुरोध",
    totalAgents: "कुल एजेंट",
    totalRetailers: "कुल रिटेलर",
    totalStockAllocated: "कुल स्टॉक आवंटित",
    approve: "अनुमोदित करें",
    fulfill: "पूर्ण करें",
    pending: "लंबित",
    approved: "अनुमोदित",
    fulfilled: "पूर्ण",
    rejected: "अस्वीकृत",
    requestFrom: "से अनुरोध करें",
    manageStock: "स्टॉक प्रबंधन"
  }
};

const t = (key, language) => translations[language][key] || key;

// Modal Components
const CreateProductModal = ({ onClose, onSuccess, language }) => {
  const [formData, setFormData] = useState({
    type: 'SIM',
    code: '',
    serial_number: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/products`, {
        ...formData,
        price: parseFloat(formData.price)
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('createProduct', language)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('type', language)}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="SIM">{t('sim', language)}</option>
              <option value="Mobile">{t('mobile', language)}</option>
              <option value="Fiber">{t('fiber', language)}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('code', language)}
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('serialNumber', language)}
            </label>
            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('price', language)} (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : t('submit', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateRequestModal = ({ onClose, onSuccess, language }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    product_type: 'SIM',
    quantity: '',
    reason: '',
    target_id: ''
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is retailer, fetch available agents
    if (user.role === 'retailer') {
      fetchAgents();
    }
  }, [user.role]);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API}/users/agents`);
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        quantity: parseInt(formData.quantity)
      };

      // Remove target_id if not retailer (agents don't specify target)
      if (user.role !== 'retailer') {
        delete requestData.target_id;
      }

      await axios.post(`${API}/product-requests`, requestData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('requestProduct', language)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {user.role === 'retailer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('selectAgent', language)}
              </label>
              <select
                value={formData.target_id}
                onChange={(e) => setFormData({...formData, target_id: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select an agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('type', language)}
            </label>
            <select
              value={formData.product_type}
              onChange={(e) => setFormData({...formData, product_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="SIM">{t('sim', language)}</option>
              <option value="Mobile">{t('mobile', language)}</option>
              <option value="Fiber">{t('fiber', language)}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('quantity', language)}
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('reason', language)}
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={language === 'en' ? 'Why do you need these products?' : 'आपको इन उत्पादों की आवश्यकता क्यों है?'}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Submitting...' : t('submit', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateUserModal = ({ onClose, onSuccess, language }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'agent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/users/create`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'en' ? 'Create User' : 'उपयोगकर्ता बनाएं'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('name', language)}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email', language)}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('phone', language)}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password', language)}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('role', language)}
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="distributor">{t('distributor', language)}</option>
              <option value="agent">{t('agent', language)}</option>
              <option value="retailer">{t('retailer', language)}</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : t('submit', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Login/Register Component
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'agent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { language } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, formData);
      login(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 dark:from-orange-800 dark:via-orange-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('appName', language)}
          </h1>
          <p className="text-orange-600 dark:text-orange-400 text-sm">
            {t('tagline', language)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name', language)}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('phone', language)}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('role', language)}
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="agent">{t('agent', language)}</option>
                  <option value="retailer">{t('retailer', language)}</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'en' 
                    ? "Distributor accounts can only be created by existing distributors" 
                    : "वितरक खाते केवल मौजूदा वितरकों द्वारा बनाए जा सकते हैं"}
                </p>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email', language)}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password', language)}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Loading...' : t(isLogin ? 'login' : 'register', language)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 dark:text-orange-400 hover:underline"
          >
            {isLogin ? `Don't have an account? ${t('register', language)}` : `Already have an account? ${t('login', language)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, language, toggleTheme, toggleLanguage } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-orange-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {t('appName', language)}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name} ({t(user?.role, language)})
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                {t('logout', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useTheme();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promises = [
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/products`),
        axios.get(`${API}/product-requests`)
      ];

      // Add stock data for agents and distributors
      if (user.role !== 'retailer') {
        promises.push(axios.get(`${API}/stock`));
      }

      const responses = await Promise.all(promises);
      setStats(responses[0].data);
      setProducts(responses[1].data);
      setRequests(responses[2].data);
      
      if (responses[3]) {
        setStock(responses[3].data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.put(`${API}/product-requests/${requestId}/approve`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleFulfillRequest = async (requestId) => {
    try {
      await axios.put(`${API}/product-requests/${requestId}/fulfill`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error fulfilling request:', error);
    }
  };

  const handleResetStock = async () => {
    if (window.confirm('Are you sure you want to reset all stock to 0?')) {
      try {
        await axios.post(`${API}/stock/reset`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error resetting stock:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard', language)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user.name}!
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {user.role === 'distributor' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('totalProducts', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total_products}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('pendingRequests', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.pending_requests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('totalAgents', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total_agents}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {user.role === 'agent' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('currentStock', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Object.values(stats.current_stock || {}).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('myRequests', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.my_requests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('retailerRequests', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.retailer_requests}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {user.role === 'retailer' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Requests
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total_requests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('pendingRequests', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.pending_requests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('fulfilledRequests', language)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.fulfilled_requests}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {user.role === 'distributor' && (
            <>
              <button 
                onClick={() => setShowCreateProduct(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                {t('createProduct', language)}
              </button>
              <button 
                onClick={() => setShowCreateUser(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {language === 'en' ? 'Create User' : 'उपयोगकर्ता बनाएं'}
              </button>
              <button 
                onClick={handleResetStock}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                {t('resetStock', language)}
              </button>
            </>
          )}
          {(user.role === 'agent' || user.role === 'retailer') && (
            <button 
              onClick={() => setShowCreateRequest(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              {t('requestProduct', language)}
            </button>
          )}
        </div>
      </div>

      {/* Stock Section - For Agents */}
      {user.role === 'agent' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('currentStock', language)}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['SIM', 'Mobile', 'Fiber'].map((type) => {
              const stockItem = stock.find(s => s.product_type === type);
              const quantity = stockItem ? stockItem.quantity : 0;
              
              return (
                <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {t(type.toLowerCase(), language)}
                    </span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {quantity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Requests Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-orange-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('requests', language)}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">{t('orderId', language)}</th>
                <th className="px-6 py-3">{t('type', language)}</th>
                <th className="px-6 py-3">{t('quantity', language)}</th>
                <th className="px-6 py-3">{t('reason', language)}</th>
                <th className="px-6 py-3">{t('status', language)}</th>
                <th className="px-6 py-3">{t('date', language)}</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-mono text-xs">
                    {request.order_id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {t(request.product_type.toLowerCase(), language)}
                  </td>
                  <td className="px-6 py-4">{request.quantity}</td>
                  <td className="px-6 py-4">{request.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {t(request.status, language)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {request.target_id === user.id && request.status === 'pending' && (
                        <button 
                          onClick={() => handleApproveRequest(request.id)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors"
                        >
                          {t('approve', language)}
                        </button>
                      )}
                      {request.target_id === user.id && request.status === 'approved' && (
                        <button 
                          onClick={() => handleFulfillRequest(request.id)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                        >
                          {t('fulfill', language)}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showCreateProduct && (
        <CreateProductModal 
          onClose={() => setShowCreateProduct(false)} 
          onSuccess={fetchData}
          language={language}
        />
      )}
      
      {showCreateRequest && (
        <CreateRequestModal 
          onClose={() => setShowCreateRequest(false)} 
          onSuccess={fetchData}
          language={language}
        />
      )}

      {showCreateUser && (
        <CreateUserModal 
          onClose={() => setShowCreateUser(false)} 
          onSuccess={fetchData}
          language={language}
        />
      )}
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;