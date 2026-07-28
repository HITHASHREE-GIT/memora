import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const AnalyticsDashboard = () => {
    // Memory Score Data
    const memoryData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Memory Score',
                data: [65, 70, 68, 75, 80, 78, 85],
                backgroundColor: 'rgba(124, 58, 237, 0.6)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    // Recognition Success Rate
    const recognitionData = {
        labels: ['Face Recognition', 'Object Detection', 'Voice Recognition'],
        datasets: [
            {
                label: 'Success Rate (%)',
                data: [92, 78, 85],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Weekly Activity
    const activityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Interactions',
                data: [12, 19, 15, 22, 18, 25, 30],
                fill: true,
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                borderColor: 'rgba(124, 58, 237, 1)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#94a3b8',
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        }
    };

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h2>📊 Analytics Dashboard</h2>
                <p>Track your memory and interaction patterns</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🧠</div>
                    <div>
                        <h3>85%</h3>
                        <p>Memory Score</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div>
                        <h3>24</h3>
                        <p>People Recognized</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div>
                        <h3>12</h3>
                        <p>Objects Tracked</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div>
                        <h3>156</h3>
                        <p>Interactions</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>📈 Memory Score Trend</h3>
                    <div className="chart-wrapper">
                        <Line data={memoryData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-card">
                    <h3>🎯 Recognition Success</h3>
                    <div className="chart-wrapper">
                        <Doughnut data={recognitionData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-card full-width">
                    <h3>📊 Weekly Activity</h3>
                    <div className="chart-wrapper">
                        <Bar data={activityData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <style>{`
                .analytics-container {
                    padding: 20px;
                    max-width: 1400px;
                    margin: 0 auto;
                    height: 100%;
                    overflow-y: auto;
                }
                .analytics-header {
                    margin-bottom: 30px;
                }
                .analytics-header h2 {
                    font-size: 2rem;
                    margin-bottom: 5px;
                    color: white;
                }
                .analytics-header p {
                    color: #94a3b8;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: #1e293b;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .stat-icon {
                    font-size: 2.5rem;
                }
                .stat-card h3 {
                    font-size: 1.5rem;
                    margin: 0;
                    color: white;
                }
                .stat-card p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 0.85rem;
                }
                .charts-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .chart-card {
                    background: #1e293b;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .chart-card h3 {
                    margin-bottom: 15px;
                    font-size: 1rem;
                    color: #94a3b8;
                }
                .chart-wrapper {
                    height: 250px;
                    position: relative;
                }
                .full-width {
                    grid-column: 1 / -1;
                }
                .chart-wrapper canvas {
                    max-height: 100% !important;
                    max-width: 100% !important;
                }
                .analytics-container::-webkit-scrollbar {
                    width: 4px;
                }
                .analytics-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .analytics-container::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
};

export default AnalyticsDashboard;