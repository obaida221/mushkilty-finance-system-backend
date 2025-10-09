# Dashboard API Documentation

## Overview

The Dashboard API provides comprehensive analytics and statistics for the Mushkilty Finance System. It includes data for charts, financial summaries, and real-time metrics that power the dashboard interface.

## Base Configuration

- **Base URL**: `http://localhost:3001`
- **Authentication**: Bearer Token (JWT) required for all endpoints
- **Required Header**: `Authorization: Bearer <token>`
- **Required Permission**: `dashboard:read`

---

## Dashboard Endpoints

### 1. Get Dashboard Statistics

**Endpoint**: `GET /dashboard/stats`

**Description**: Get key performance indicators and statistics for dashboard cards.

**Required Permission**: `dashboard:read`

**Success Response** (200):
```json
{
  "totalIncome": 67000,
  "totalExpenses": 38000,
  "activeStudents": 67,
  "netProfit": 29000,
  "incomeChange": "+12.5%",
  "expensesChange": "+8.2%",
  "studentsChange": "+15.8%",
  "profitChange": "+18.3%"
}
```

**Response Fields**:
- `totalIncome`: Current month's total income
- `totalExpenses`: Current month's total expenses  
- `activeStudents`: Number of active students (pending/accepted enrollments)
- `netProfit`: Current month's profit (income - expenses)
- `*Change`: Percentage change compared to last month

---

### 2. Get Revenue Chart Data

**Endpoint**: `GET /dashboard/revenue-chart`

**Description**: Get monthly income and expenses data for revenue charts.

**Query Parameters**:
- `months` (optional): Number of months to include (default: 6)

**Example**: `GET /dashboard/revenue-chart?months=12`

**Success Response** (200):
```json
[
  {
    "month": "يناير",
    "income": 45000,
    "expenses": 28000
  },
  {
    "month": "فبراير", 
    "income": 52000,
    "expenses": 31000
  },
  {
    "month": "مارس",
    "income": 48000,
    "expenses": 29000
  },
  {
    "month": "أبريل",
    "income": 61000,
    "expenses": 34000
  },
  {
    "month": "مايو",
    "income": 55000,
    "expenses": 32000
  },
  {
    "month": "يونيو",
    "income": 67000,
    "expenses": 38000
  }
]
```

---

### 3. Get Student Enrollment Chart Data

**Endpoint**: `GET /dashboard/student-enrollment-chart`

**Description**: Get monthly student enrollment data for enrollment trends chart.

**Query Parameters**:
- `months` (optional): Number of months to include (default: 6)

**Success Response** (200):
```json
[
  {
    "month": "يناير",
    "students": 45
  },
  {
    "month": "فبراير",
    "students": 52
  },
  {
    "month": "مارس",
    "students": 48
  },
  {
    "month": "أبريل",
    "students": 61
  },
  {
    "month": "مايو",
    "students": 58
  },
  {
    "month": "يونيو",
    "students": 67
  }
]
```

---

### 4. Get Course Distribution Chart Data

**Endpoint**: `GET /dashboard/course-distribution-chart`

**Description**: Get distribution of courses by project type for pie chart.

**Success Response** (200):
```json
[
  {
    "name": "أونلاين",
    "value": 40,
    "color": "#DC2626"
  },
  {
    "name": "حضوري",
    "value": 30,
    "color": "#F59E0B"
  },
  {
    "name": "كيدز",
    "value": 25,
    "color": "#10B981"
  },
  {
    "name": "آيلتس",
    "value": 5,
    "color": "#3B82F6"
  }
]
```

**Course Types**:
- **أونلاين** (online): Online courses
- **حضوري** (onsite): In-person courses
- **كيدز** (kids): Kids courses
- **آيلتس** (ielts): IELTS courses

---

### 5. Get Payment Method Chart Data

**Endpoint**: `GET /dashboard/payment-method-chart`

**Description**: Get payment amounts grouped by payment method for horizontal bar chart.

**Query Parameters**:
- `months` (optional): Number of months to include (default: 6)

**Success Response** (200):
```json
[
  {
    "method": "نقدي",
    "amount": 45000
  },
  {
    "method": "ماستر",
    "amount": 32000
  },
  {
    "method": "زين كاش",
    "amount": 28000
  },
  {
    "method": "آسيا حوالة",
    "amount": 15000
  }
]
```

**Payment Methods**:
- **نقدي** (cash): Cash payments
- **ماستر** (card): Card/Master payments
- **زين كاش** (transfer): Zain Cash transfers
- **آسيا حوالة** (bank): Asia Bank transfers

---

### 6. Get Financial Summary

**Endpoint**: `GET /dashboard/financial-summary`

**Description**: Get comprehensive financial breakdown and analysis.

**Query Parameters**:
- `year` (optional): Year for the summary (default: current year)

**Example**: `GET /dashboard/financial-summary?year=2025`

**Success Response** (200):
```json
{
  "year": 2025,
  "totalIncome": 450000,
  "totalExpenses": 280000,
  "netProfit": 170000,
  "monthlyBreakdown": [
    {
      "month": 1,
      "income": 45000,
      "expenses": 28000,
      "profit": 17000
    },
    {
      "month": 2,
      "income": 52000,
      "expenses": 31000,
      "profit": 21000
    }
  ],
  "expenseCategories": [
    {
      "category": "salary",
      "amount": 150000
    },
    {
      "category": "marketing",
      "amount": 80000
    },
    {
      "category": "equipment",
      "amount": 50000
    }
  ]
}
```

---

### 7. Get Recent Activities

**Endpoint**: `GET /dashboard/recent-activities`

**Description**: Get recent payments, enrollments, and expenses for activity feed.

**Query Parameters**:
- `limit` (optional): Number of activities to return (default: 10)

**Success Response** (200):
```json
[
  {
    "type": "payment",
    "id": 123,
    "date": "2025-10-09T14:30:00.000Z",
    "description": "دفعة من أحمد محمد",
    "amount": 250000,
    "currency": "IQD",
    "method": "نقدي"
  },
  {
    "type": "enrollment",
    "id": 456,
    "date": "2025-10-09T13:15:00.000Z",
    "description": "تسجيل سارة علي في English Conversation",
    "status": "pending",
    "batch": "Morning Batch A1"
  },
  {
    "type": "expense",
    "id": 789,
    "date": "2025-10-09T11:00:00.000Z",
    "description": "مصروف لـ شركة الكهرباء",
    "amount": 150000,
    "currency": "IQD", 
    "category": "utilities"
  }
]
```

**Activity Types**:
- **payment**: Payment received
- **enrollment**: New student enrollment
- **expense**: Expense recorded

---

## Frontend Integration

### 1. Dashboard Service Implementation

```javascript
class DashboardService {
  constructor(apiService) {
    this.api = apiService;
  }

  // Get dashboard statistics
  async getStats() {
    return await this.api.request('/dashboard/stats');
  }

  // Get revenue chart data
  async getRevenueChart(months = 6) {
    return await this.api.request(`/dashboard/revenue-chart?months=${months}`);
  }

  // Get student enrollment chart data
  async getStudentEnrollmentChart(months = 6) {
    return await this.api.request(`/dashboard/student-enrollment-chart?months=${months}`);
  }

  // Get course distribution data
  async getCourseDistribution() {
    return await this.api.request('/dashboard/course-distribution-chart');
  }

  // Get payment method chart data
  async getPaymentMethodChart(months = 6) {
    return await this.api.request(`/dashboard/payment-method-chart?months=${months}`);
  }

  // Get financial summary
  async getFinancialSummary(year) {
    const yearParam = year ? `?year=${year}` : '';
    return await this.api.request(`/dashboard/financial-summary${yearParam}`);
  }

  // Get recent activities
  async getRecentActivities(limit = 10) {
    return await this.api.request(`/dashboard/recent-activities?limit=${limit}`);
  }
}
```

### 2. React Dashboard Implementation

```jsx
import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all dashboard data in parallel
      const [
        statsData,
        revenueChartData,
        enrollmentChartData,
        courseDistData,
        paymentMethodData,
        activitiesData
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueChart(6),
        dashboardService.getStudentEnrollmentChart(6),
        dashboardService.getCourseDistribution(),
        dashboardService.getPaymentMethodChart(6),
        dashboardService.getRecentActivities(10)
      ]);

      setStats(statsData);
      setRevenueData(revenueChartData);
      setEnrollmentData(enrollmentChartData);
      setCourseDistribution(courseDistData);
      setPaymentMethods(paymentMethodData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="إجمالي الدخل"
          value={`${stats?.totalIncome?.toLocaleString()} د.ع`}
          change={stats?.incomeChange}
          isPositive={stats?.incomeChange?.includes('+')}
        />
        <StatCard
          title="إجمالي المصروفات"
          value={`${stats?.totalExpenses?.toLocaleString()} د.ع`}
          change={stats?.expensesChange}
          isPositive={stats?.expensesChange?.includes('+')}
        />
        <StatCard
          title="الطلاب النشطين"
          value={stats?.activeStudents}
          change={stats?.studentsChange}
          isPositive={stats?.studentsChange?.includes('+')}
        />
        <StatCard
          title="صافي الربح"
          value={`${stats?.netProfit?.toLocaleString()} د.ع`}
          change={stats?.profitChange}
          isPositive={stats?.profitChange?.includes('+')}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <RevenueChart data={revenueData} />
        <CourseDistributionChart data={courseDistribution} />
        <EnrollmentChart data={enrollmentData} />
        <PaymentMethodChart data={paymentMethods} />
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={recentActivities} />

      {/* Refresh Button */}
      <button onClick={refreshData}>
        تحديث البيانات
      </button>
    </div>
  );
};

export default DashboardPage;
```

### 3. Chart Components

```jsx
// Revenue Chart Component
const RevenueChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3>الدخل والمصروفات</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="الدخل" />
          <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="المصروفات" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Course Distribution Chart
const CourseDistributionChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3>توزيع الدورات</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### 4. Error Handling

```javascript
const DashboardErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
      console.error('Dashboard Error:', error);
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="error-container">
        <h2>خطأ في تحميل لوحة التحكم</h2>
        <p>حدث خطأ أثناء تحميل بيانات لوحة التحكم</p>
        <button onClick={() => window.location.reload()}>
          إعادة تحميل الصفحة
        </button>
      </div>
    );
  }

  return children;
};
```

## Data Refresh and Real-time Updates

### Auto Refresh Implementation

```javascript
const useDashboardData = (refreshInterval = 30000) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const dashboardData = await dashboardService.getStats();
      setData(dashboardData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    // Set up auto refresh
    const interval = setInterval(loadData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [loadData, refreshInterval]);

  return { data, loading, error, refresh: loadData };
};
```

## Performance Optimization

### 1. Data Caching

```javascript
class DashboardCache {
  constructor(ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

const dashboardCache = new DashboardCache();
```

### 2. Optimized API Calls

```javascript
const optimizedDashboardService = {
  async getStatsWithCache() {
    const cached = dashboardCache.get('stats');
    if (cached) return cached;
    
    const data = await dashboardService.getStats();
    dashboardCache.set('stats', data);
    return data;
  },

  async preloadChartData() {
    // Preload chart data in background
    Promise.all([
      dashboardService.getRevenueChart(),
      dashboardService.getStudentEnrollmentChart(),
      dashboardService.getCourseDistribution(),
    ]).then(([revenue, enrollment, courses]) => {
      dashboardCache.set('revenue', revenue);
      dashboardCache.set('enrollment', enrollment);
      dashboardCache.set('courses', courses);
    });
  }
};
```

## Testing the API

### cURL Examples

```bash
# Get dashboard stats
curl -X GET http://localhost:3001/dashboard/stats \
  -H "Authorization: Bearer <token>"

# Get revenue chart (last 12 months)
curl -X GET "http://localhost:3001/dashboard/revenue-chart?months=12" \
  -H "Authorization: Bearer <token>"

# Get course distribution
curl -X GET http://localhost:3001/dashboard/course-distribution-chart \
  -H "Authorization: Bearer <token>"

# Get financial summary for 2025
curl -X GET "http://localhost:3001/dashboard/financial-summary?year=2025" \
  -H "Authorization: Bearer <token>"

# Get recent activities (last 20)
curl -X GET "http://localhost:3001/dashboard/recent-activities?limit=20" \
  -H "Authorization: Bearer <token>"
```

### Postman Collection

Create a Postman collection with:

1. **Environment Variables**:
   - `baseUrl`: `http://localhost:3001`
   - `token`: `{{authToken}}`

2. **Pre-request Script** (for auth):
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

3. **Test Scripts**:
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });

   pm.test("Response has required fields", function () {
       const jsonData = pm.response.json();
       pm.expect(jsonData).to.have.property('totalIncome');
       pm.expect(jsonData).to.have.property('totalExpenses');
   });
   ```

---

*Last updated: October 9, 2025*
*Version: 1.0.0*