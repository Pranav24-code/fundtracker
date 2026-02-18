import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { IconPieChart, IconTrendingUp, IconActivity } from '../common/Icons';

const deptColors = {
    'Roads & Infrastructure': '#3B82F6', 'Healthcare': '#EF4444', 'Education': '#8B5CF6',
    'Smart City': '#06B6D4', 'Water Supply': '#0EA5E9', 'Rural Development': '#F59E0B',
    'Energy': '#10B981', 'Sanitation': '#D946EF', 'Others': '#6B7280',
};

const AnalyticsCharts = ({ projects = [] }) => {
    // Calculate department allocation from real data
    const deptMap = {};
    let grandTotal = 0;
    projects.forEach((p) => {
        if (!deptMap[p.department]) deptMap[p.department] = { budget: 0, spent: 0 };
        deptMap[p.department].budget += p.totalBudget || 0;
        deptMap[p.department].spent += p.amountSpent || 0;
        grandTotal += p.totalBudget || 0;
    });

    const departments = Object.keys(deptMap).map((name) => ({
        name,
        percentage: grandTotal > 0 ? Math.round((deptMap[name].budget / grandTotal) * 100) : 0,
        color: deptColors[name] || '#6B7280',
        amount: formatCurrency(deptMap[name].budget),
    })).sort((a, b) => b.percentage - a.percentage);

    // Top projects by spending
    const topProjects = [...projects]
        .sort((a, b) => (b.amountSpent || 0) - (a.amountSpent || 0))
        .slice(0, 5)
        .map((p) => ({ name: p.title.length > 20 ? p.title.slice(0, 20) + '...' : p.title, spent: p.amountSpent || 0, budget: p.totalBudget || 0 }));

    const maxBudget = topProjects.length > 0 ? Math.max(...topProjects.map(p => p.budget)) : 1;

    // Monthly trends (calculated from real data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    // Show last 6 months
    const trendMonths = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonth - i);
        trendMonths.push({
            month: months[d.getMonth()],
            year: d.getFullYear(),
            allocated: 0,
            spent: 0
        });
    }

    projects.forEach(p => {
        const date = new Date(p.createdAt || p.startDate);
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        const trend = trendMonths.find(t => t.month === month && t.year === year);
        if (trend) {
            trend.allocated += p.totalBudget || 0;
            trend.spent += p.amountSpent || 0;
        }
    });

    const monthlyTrends = trendMonths; // No fallback
    const maxTrend = Math.max(...monthlyTrends.map(t => Math.max(t.allocated, t.spent))) || 1;

    return (
        <div className="row g-4">
            {/* Pie Chart - Department Allocation */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconPieChart size={16} color="#3B82F6" /> Budget by Department</h6>
                        <div className="d-flex justify-content-center mb-3">
                            <div className="position-relative" style={{ width: 160, height: 160 }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                    {(() => {
                                        let offset = 0;
                                        return departments.map((dept, i) => {
                                            const segment = (
                                                <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={dept.color} strokeWidth="5"
                                                    strokeDasharray={`${dept.percentage * 0.88} 100`}
                                                    strokeDashoffset={`-${offset * 0.88}`} opacity={0.85} />
                                            );
                                            offset += dept.percentage;
                                            return segment;
                                        });
                                    })()}
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                    <div className="fw-bold" style={{ fontSize: 16 }}>{formatCurrency(grandTotal)}</div>
                                    <div className="text-muted" style={{ fontSize: 10 }}>Total</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {departments.map((dept, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between py-1" style={{ fontSize: 12 }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dept.color }} />
                                        <span>{dept.name}</span>
                                    </div>
                                    <span className="text-muted">{dept.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bar Chart - Top Projects */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconTrendingUp size={16} color="#10B981" /> Top Projects by Spending</h6>
                        <div className="d-flex flex-column gap-3">
                            {topProjects.map((project, i) => (
                                <div key={i}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small className="fw-medium" style={{ fontSize: 11 }}>{project.name}</small>
                                        <small className="text-muted" style={{ fontSize: 11 }}>{formatCurrency(project.spent)}</small>
                                    </div>
                                    <div className="position-relative" style={{ height: 20, backgroundColor: '#F3F4F6', borderRadius: 4 }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(project.budget / maxBudget) * 100}%`, backgroundColor: '#DBEAFE', borderRadius: 4 }} />
                                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(project.spent / maxBudget) * 100}%`, backgroundColor: project.spent / project.budget > 0.9 ? '#FCA5A5' : '#93C5FD', borderRadius: 4 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex gap-3 mt-3 justify-content-center" style={{ fontSize: 11 }}>
                            <span><span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#93C5FD', borderRadius: 2, marginRight: 4 }}></span>Spent</span>
                            <span><span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#DBEAFE', borderRadius: 2, marginRight: 4 }}></span>Budget</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Chart - Monthly Trends */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconActivity size={16} color="#8B5CF6" /> Monthly Spending Trends</h6>
                        <div className="position-relative" style={{ height: 180 }}>
                            <svg viewBox="0 0 300 180" style={{ width: '100%', height: '100%' }}>
                                {[0, 45, 90, 135].map((y, i) => (
                                    <line key={i} x1="40" y1={y + 10} x2="290" y2={y + 10} stroke="#F3F4F6" strokeWidth="1" />
                                ))}
                                <polyline fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 3"
                                    points={monthlyTrends.map((d, i) => `${40 + i * 50},${160 - (d.allocated / maxTrend) * 140}`).join(' ')} />
                                <polyline fill="none" stroke="#10B981" strokeWidth="2.5"
                                    points={monthlyTrends.map((d, i) => `${40 + i * 50},${160 - (d.spent / maxTrend) * 140}`).join(' ')} />
                                {monthlyTrends.map((d, i) => (
                                    <React.Fragment key={i}>
                                        <circle cx={40 + i * 50} cy={160 - (d.allocated / maxTrend) * 140} r="3" fill="#3B82F6" />
                                        <circle cx={40 + i * 50} cy={160 - (d.spent / maxTrend) * 140} r="3" fill="#10B981" />
                                        <text x={40 + i * 50} y="175" textAnchor="middle" fontSize="9" fill="#9CA3AF">{d.month}</text>
                                    </React.Fragment>
                                ))}
                            </svg>
                        </div>
                        <div className="d-flex gap-3 mt-2 justify-content-center" style={{ fontSize: 11 }}>
                            <span><span style={{ display: 'inline-block', width: 14, height: 2, backgroundColor: '#3B82F6', marginRight: 4, verticalAlign: 'middle', borderTop: '2px dashed #3B82F6' }}></span>Allocated</span>
                            <span><span style={{ display: 'inline-block', width: 14, height: 2, backgroundColor: '#10B981', marginRight: 4, verticalAlign: 'middle' }}></span>Spent</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
