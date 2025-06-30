// Sample data
const studentsData = [
    { id: 'S001', name: 'Alex Johnson', status: 'High Risk', aiUsage: 95, gpa: 2.1, risk: 'high' },
    { id: 'S002', name: 'Sarah Chen', status: 'Medium Risk', aiUsage: 78, gpa: 2.8, risk: 'medium' },
    { id: 'S003', name: 'Mike Rodriguez', status: 'High Risk', aiUsage: 89, gpa: 2.3, risk: 'high' },
    { id: 'S004', name: 'Emma Davis', status: 'Low Risk', aiUsage: 45, gpa: 3.7, risk: 'low' },
    { id: 'S005', name: 'James Wilson', status: 'Medium Risk', aiUsage: 67, gpa: 3.1, risk: 'medium' }
];

const insights = [
    "Students with >85% AI tool dependency show 40% higher risk of performance decline",
    "Writing assistant usage correlates with improved essay scores but reduced critical thinking",
    "Math solver dependency increases by 25% before exam periods",
    "Students using multiple AI tools simultaneously show decreased retention rates"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    populateStudentList();
    populateInsights();
    setupEventListeners();
    updateMetrics();
});

function initializeCharts() {
    // Performance chart
    const canvas = document.getElementById('performanceChart');
    const ctx1 = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const gradient = ctx1.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');

    // Simulate performance trend data
    const performanceData = generatePerformanceData();
    drawLineChart(ctx1, performanceData, gradient);
    
    // Add interactivity to performance chart
    addChartInteractivity(canvas, ctx1, gradient);

    // Dependency chart for analytics tab
    const ctx2 = document.getElementById('dependencyChart').getContext('2d');
    const dependencyData = generateDependencyData();
    drawBarChart(ctx2, dependencyData);
}

function addChartInteractivity(canvas, ctx, gradient) {
    // Create tooltip element
    if (!chartTooltip) {
        chartTooltip = document.createElement('div');
        chartTooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(chartTooltip);
    }

    canvas.addEventListener('mousemove', (e) => {
        if (!currentChartData) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const padding = 50;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;
        
        // Check if mouse is within chart area
        if (x < padding || x > padding + width || y < padding || y > padding + height) {
            hoveredPoint = null;
            chartTooltip.style.opacity = '0';
            canvas.style.cursor = 'default';
            drawLineChart(ctx, currentChartData, gradient);
            return;
        }
        
        // Find closest data point
        let closestIndex = -1;
        let closestDistance = Infinity;
        
        currentChartData.data.forEach((value, index) => {
            const pointX = padding + (width * index) / (currentChartData.data.length - 1);
            const distance = Math.abs(x - pointX);
            
            if (distance < closestDistance && distance < 20) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        if (closestIndex !== -1 && closestIndex !== hoveredPoint) {
            hoveredPoint = closestIndex;
            canvas.style.cursor = 'pointer';
            
            // Show tooltip
            const value = currentChartData.data[closestIndex];
            const label = currentChartData.labels[closestIndex];
            
            chartTooltip.innerHTML = `
                <strong>${label}</strong><br>
                Performance: ${value.toFixed(1)}%<br>
                <small>Click for details</small>
            `;
            
            chartTooltip.style.left = (e.clientX + 10) + 'px';
            chartTooltip.style.top = (e.clientY - 40) + 'px';
            chartTooltip.style.opacity = '1';
            
            drawLineChart(ctx, currentChartData, gradient);
        } else if (closestIndex === -1) {
            hoveredPoint = null;
            chartTooltip.style.opacity = '0';
            canvas.style.cursor = 'default';
            drawLineChart(ctx, currentChartData, gradient);
        }
    });

    canvas.addEventListener('mouseleave', () => {
        hoveredPoint = null;
        chartTooltip.style.opacity = '0';
        canvas.style.cursor = 'default';
        if (currentChartData) {
            drawLineChart(ctx, currentChartData, gradient);
        }
    });

    canvas.addEventListener('click', (e) => {
        if (hoveredPoint !== null) {
            showDataPointDetails(hoveredPoint);
        }
    });
}

function showDataPointDetails(pointIndex) {
    if (!currentChartData || pointIndex < 0 || pointIndex >= currentChartData.data.length) return;
    
    const value = currentChartData.data[pointIndex];
    const label = currentChartData.labels[pointIndex];
    const trend = pointIndex > 0 ? 
        (value - currentChartData.data[pointIndex - 1]).toFixed(1) : '0.0';
    
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = `Performance Details - ${label}`;
    
    modalContent.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Performance Score</h3>
                    <div class="card-icon"></div>
                </div>
                <div class="metric-value">${value.toFixed(1)}%</div>
                <div class="metric-label">Overall class average</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Daily Change</h3>
                    <div class="card-icon">${trend > 0 ? '' : trend < 0 ? '' : '➡'}</div>
                </div>
                <div class="metric-value" style="color: ${trend > 0 ? '#38a169' : trend < 0 ? '#c53030' : '#666'}">${trend > 0 ? '+' : ''}${trend}%</div>
                <div class="metric-label">From previous day</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Students Analyzed</h3>
                    <div class="card-icon">👥</div>
                </div>
                <div class="metric-value">${Math.floor(Math.random() * 50 + 200)}</div>
                <div class="metric-label">Active on this date</div>
            </div>
        </div>
        
        <div class="ai-insights">
            <h3 class="chart-title">Daily Insights for ${label}</h3>
            <div class="insight-item">
                <strong>AI Tool Usage:</strong> ${Math.floor(Math.random() * 30 + 50)}% of students used AI tools on this day
            </div>
            <div class="insight-item">
                <strong>Most Used Tool:</strong> ${['Writing Assistant', 'Math Solver', 'Research Helper', 'Code Generator'][Math.floor(Math.random() * 4)]}
            </div>
            <div class="insight-item">
                <strong>Risk Assessment:</strong> ${Math.floor(Math.random() * 10 + 15)} students flagged for high AI dependency
            </div>
            <div class="insight-item">
                <strong>Recommendation:</strong> ${trend < -2 ? 
                    'Implement immediate intervention strategies for declining performance' :
                    trend > 2 ?
                    'Continue current successful learning approaches' :
                    'Monitor trends and maintain current support levels'
                }
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: right;">
            <button class="btn btn-secondary" onclick="exportDayReport('${label}')">Export Day Report</button>
            <button class="btn btn-primary" onclick="viewTrendAnalysis()">View Trend Analysis</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function exportDayReport(date) {
    showNotification(`Daily report for ${date} exported successfully!`);
    closeModal();
}

function viewTrendAnalysis() {
    showNotification('Opening trend analysis view...');
    closeModal();
    // Switch to analytics tab
    switchTab('analytics');
}

function generatePerformanceData() {
    const data = [];
    const labels = [];
    const basePerformance = 75;
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const variation = (Math.random() - 0.5) * 10;
        const trend = -0.2 * i; // Slight declining trend
        data.push(Math.max(0, Math.min(100, basePerformance + variation + trend)));
    }
    
    return { labels, data };
}

function generateDependencyData() {
    return {
        labels: ['Writing', 'Math', 'Research', 'Coding', 'Translation'],
        data: [85, 72, 56, 91, 38]
    };
}

let currentChartData = null;
let hoveredPoint = null;
let chartTooltip = null;

function drawLineChart(ctx, chartData, gradient) {
    currentChartData = chartData;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const padding = 50;
    const width = ctx.canvas.width - 2 * padding;
    const height = ctx.canvas.height - 2 * padding;
    const maxValue = Math.max(...chartData.data);
    const minValue = Math.min(...chartData.data);
    const valueRange = maxValue - minValue || 1;

    // Draw grid lines
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height * i) / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + width, y);
        ctx.stroke();
        
        // Vertical grid lines
        if (i < 5) {
            const x = padding + (width * i) / 4;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + height);
            ctx.stroke();
        }
    }

    // Draw area under the line
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, padding + height);
    
    chartData.data.forEach((value, index) => {
        const x = padding + (width * index) / (chartData.data.length - 1);
        const y = padding + height - ((value - minValue) / valueRange) * height;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(padding + width, padding + height);
    ctx.closePath();
    ctx.fill();

    // Draw the main line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    chartData.data.forEach((value, index) => {
        const x = padding + (width * index) / (chartData.data.length - 1);
        const y = padding + height - ((value - minValue) / valueRange) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();

    // Draw data points
    chartData.data.forEach((value, index) => {
        const x = padding + (width * index) / (chartData.data.length - 1);
        const y = padding + height - ((value - minValue) / valueRange) * height;
        
        // Highlight hovered point
        if (hoveredPoint === index) {
            ctx.fillStyle = '#666666';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add white border for better visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });

    // Draw labels
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (valueRange * (5 - i)) / 5;
        const y = padding + (height * i) / 5;
        ctx.fillText(Math.round(value) + '%', padding - 10, y + 4);
    }
    
    // X-axis labels (show every 5th label to avoid crowding)
    ctx.textAlign = 'center';
    chartData.labels.forEach((label, index) => {
        if (index % 5 === 0 || index === chartData.labels.length - 1) {
            const x = padding + (width * index) / (chartData.data.length - 1);
            ctx.fillText(label, x, padding + height + 25);
        }
    });
}

function drawBarChart(ctx, chartData) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const padding = 50;
    const width = ctx.canvas.width - 2 * padding;
    const height = ctx.canvas.height - 2 * padding;
    const maxValue = Math.max(...chartData.data);
    const barWidth = width / chartData.data.length * 0.6;
    const barSpacing = width / chartData.data.length * 0.4;

    chartData.data.forEach((value, index) => {
        const barHeight = (value / maxValue) * height;
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
        const y = padding + height - barHeight;

        // Draw bar
        ctx.fillStyle = index % 2 === 0 ? '#000000' : '#666666';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value label
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value + '%', x + barWidth / 2, y - 10);

        // Draw category label
        ctx.fillText(chartData.labels[index], x + barWidth / 2, padding + height + 20);
    });
}

function populateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    studentsData.filter(student => student.risk === 'high' || student.risk === 'medium')
               .forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.className = 'student-item';
        studentElement.onclick = () => showStudentDetails(student);
        
        studentElement.innerHTML = `
            <div class="student-avatar">${student.name.charAt(0)}</div>
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-status">AI Usage: ${student.aiUsage}% | GPA: ${student.gpa}</div>
            </div>
            <div class="risk-badge risk-${student.risk}">${student.status}</div>
        `;
        
        studentList.appendChild(studentElement);
    });
}

function populateInsights() {
    const insightsList = document.getElementById('insightsList');
    insightsList.innerHTML = '';

    insights.forEach(insight => {
        const insightElement = document.createElement('div');
        insightElement.className = 'insight-item';
        insightElement.textContent = insight;
        insightsList.appendChild(insightElement);
    });
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });

    // Settings threshold slider
    const thresholdSlider = document.getElementById('alertThreshold');
    if (thresholdSlider) {
        thresholdSlider.addEventListener('input', (e) => {
            document.getElementById('thresholdValue').textContent = e.target.value + '%';
        });
    }
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').style.display = 'block';

    // Add active class to clicked nav item
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function updateMetrics() {
    // Simulate real-time updates
    setInterval(() => {
        const totalStudents = 247 + Math.floor(Math.random() * 10 - 5);
        const aiUsage = 73 + Math.floor(Math.random() * 6 - 3);
        const atRisk = 18 + Math.floor(Math.random() * 4 - 2);

        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('aiUsage').textContent = aiUsage + '%';
        document.getElementById('atRiskStudents').textContent = Math.max(0, atRisk);
    }, 30000); // Update every 30 seconds
}

function updateAnalytics() {
    // Simulate analytics update
    const ctx = document.getElementById('dependencyChart').getContext('2d');
    const newData = generateDependencyData();
    
    // Add some randomization to simulate different filters
    newData.data = newData.data.map(value => 
        Math.max(0, Math.min(100, value + Math.floor(Math.random() * 20 - 10)))
    );
    
    drawBarChart(ctx, newData);
    
    // Show success message
    showNotification('Analytics updated successfully!');
}

function generatePrediction() {
    const studentId = document.getElementById('studentId').value;
    const horizon = document.getElementById('predictionHorizon').value;
    
    if (!studentId) {
        showNotification('Please enter a student ID', 'error');
        return;
    }

    // Find student or simulate prediction
    const student = studentsData.find(s => s.id === studentId) || {
        id: studentId,
        name: 'Unknown Student',
        aiUsage: Math.floor(Math.random() * 100),
        gpa: (Math.random() * 2 + 2).toFixed(1),
        risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    };

    const predictionResults = document.getElementById('predictionResults');
    const predictionContent = document.getElementById('predictionContent');

    // Prepare data for backend
    const payload = {
        student_id: student.id,
        ai_tool_usage: student.aiUsage,
        gpa: student.gpa,
        horizon: horizon
    };

    fetch('/api/forecast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        predictionContent.innerHTML = `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Predicted Grade</h3>
                        <div class="card-icon"></div>
                    </div>
                    <div class="metric-value">${result.predicted_grade}</div>
                    <div class="metric-label">Confidence: ${(result.confidence * 100).toFixed(1)}%</div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">AI Tool Dependency</h3>
                        <div class="card-icon"></div>
                    </div>
                    <div class="metric-value">${result.ai_tool_dependency}%</div>
                    <div class="metric-label">Reported by backend</div>
                </div>
            </div>
            <div class="ai-insights">
                <h3 class="chart-title">Prediction Analysis</h3>
                <div class="insight-item">
                    <strong>Student:</strong> ${student.name} (${student.id})
                </div>
                <div class="insight-item">
                    <strong>AI Tool Dependency:</strong> ${result.ai_tool_dependency}%
                </div>
                <div class="insight-item">
                    <strong>Recommendation:</strong> ${result.ai_tool_dependency > 80 ? 
                        'Implement AI usage reduction strategy and increase hands-on learning activities' : 
                        result.ai_tool_dependency > 60 ? 
                        'Monitor AI tool usage and encourage independent problem-solving' : 
                        'Continue current learning approach with periodic AI tool integration'}
                </div>
            </div>
        `;
        predictionResults.style.display = 'block';
        showNotification('Prediction generated successfully!');
    })
    .catch(error => {
        showNotification('Prediction failed. Please try again.', 'error');
        predictionResults.style.display = 'none';
    });
}

function saveSettings() {
    const modelType = document.getElementById('modelType').value;
    const alertThreshold = document.getElementById('alertThreshold').value;
    const refreshRate = document.getElementById('refreshRate').value;
    
    // Simulate saving settings
    const settings = {
        modelType,
        alertThreshold,
        refreshRate,
        timestamp: new Date().toISOString()
    };
    
    console.log('Settings saved:', settings);
    showNotification('Settings saved successfully!');
}

function showStudentDetails(student) {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = `${student.name} - Detailed Analysis`;
    
    // Generate additional mock data for detailed view
    const weeklyUsage = Array.from({length: 7}, () => Math.floor(Math.random() * 100));
    const courses = ['Mathematics', 'Science', 'English', 'History'];
    const coursePerformance = courses.map(course => ({
        name: course,
        grade: (Math.random() * 2 + 2).toFixed(1),
        aiUsage: Math.floor(Math.random() * 100)
    }));
    
    modalContent.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Overall GPA</h3>
                </div>
                <div class="metric-value">${student.gpa}</div>
                <div class="metric-label">Current semester</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">AI Dependency</h3>
                </div>
                <div class="metric-value">${student.aiUsage}%</div>
                <div class="metric-label">Weekly average</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Risk Level</h3>
                </div>
                <div class="metric-value">${student.status}</div>
                <div class="metric-label">Current assessment</div>
            </div>
        </div>
        
        <div class="ai-insights">
            <h3 class="chart-title">Course Performance</h3>
            ${coursePerformance.map(course => `
                <div class="insight-item">
                    <strong>${course.name}:</strong> GPA ${course.grade} | AI Usage: ${course.aiUsage}%
                </div>
            `).join('')}
        </div>
        
        <div class="ai-insights">
            <h3 class="chart-title">Recommendations</h3>
            <div class="insight-item">
                ${student.aiUsage > 80 ? 
                    'Immediate intervention required: Implement structured reduction in AI tool dependency' :
                    student.aiUsage > 60 ?
                    'Monitor closely: Encourage balance between AI assistance and independent learning' :
                    'Good balance: Continue current approach with periodic assessment'
                }
            </div>
            <div class="insight-item">
                Suggested activities: ${student.aiUsage > 70 ? 
                    'Handwritten assignments, group discussions, oral presentations' :
                    'Maintain current study methods with gradual AI integration'
                }
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: right;">
            <button class="btn btn-secondary" onclick="exportStudentReport('${student.id}')">Export Report</button>
            <button class="btn btn-primary" onclick="scheduleIntervention('${student.id}')">Schedule Intervention</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
}

function exportStudentReport(studentId) {
    showNotification('Student report exported successfully!');
    closeModal();
}

function scheduleIntervention(studentId) {
    showNotification('Intervention scheduled for student ' + studentId);
    closeModal();
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'error' ? '#fee' : '#f0fff4'};
        color: ${type === 'error' ? '#c53030' : '#38a169'};
        border: 1px solid ${type === 'error' ? '#fed7d7' : '#9ae6b4'};
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Simulate real-time data updates
setInterval(() => {
    // Update some random metrics to show live data
    const cards = document.querySelectorAll('.progress-fill');
    cards.forEach(card => {
        const currentWidth = parseInt(card.style.width);
        const newWidth = Math.max(10, Math.min(100, currentWidth + (Math.random() * 6 - 3)));
        card.style.width = newWidth + '%';
    });
}, 45000); // Update every 45 seconds

// Auto-refresh insights
setInterval(() => {
    const newInsights = [
        "Real-time analysis shows 15% increase in AI tool usage during exam periods",
        "Students with balanced AI usage (40-60%) show optimal learning outcomes",
        "Early intervention reduces academic risk by up to 60% within 4 weeks",
        "Collaborative learning sessions reduce individual AI dependency by 25%"
    ];
    
    // Replace one random insight
    const insightElements = document.querySelectorAll('.insight-item');
    if (insightElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * insightElements.length);
        const randomInsight = newInsights[Math.floor(Math.random() * newInsights.length)];
        insightElements[randomIndex].textContent = randomInsight;
    }
}, 60000); // Update every minute
