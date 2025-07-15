# IntelliGrade: Multi-Model AI Dashboard for Forecasting Academic Performance

IntelliGrade is a web application that provides a comprehensive dashboard for forecasting student academic performance based on patterns of AI tool dependency. It features a modern, responsive frontend and a Python Flask backend, offering real-time analytics, predictions, and actionable insights for educators and administrators.

## Features

- **Student Performance Forecasting:** Predicts student grades and risk levels based on AI tool usage and academic data.
- **AI Tool Dependency Analytics:** Visualizes and analyzes student reliance on various AI tools (e.g., writing assistants, math solvers).
- **Interactive Dashboard:** Real-time metrics, charts, and student lists with risk assessments.
- **Prediction Analysis:** Detailed recommendations and insights after each prediction.
- **Responsive UI:** Black and white themed, cross-platform, and mobile-friendly.
- **Frontend-Backend Integration:** Fast, reliable communication between the Flask backend and HTML/CSS/JS frontend.

## Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Node.js (for advanced frontend development, optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ELCRISHT/IntelliGrade.git
   cd IntelliGrade
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
   The backend will start on `http://127.0.0.1:5000` by default.

3. **Open the frontend:**
   - Open `frontend/index.html` in your web browser.
   - For full API integration, ensure the backend is running.

### Folder Structure
```
IntelliGrade/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── styles.css
    └── script.js
```

## Usage
- Enter a Student ID and select a prediction horizon to generate forecasts.
- View analytics, risk levels, and AI tool dependency in the dashboard.
- Access detailed prediction analysis and recommendations in the Analytics tab.

## Developers
- **Mj Valdez**
- **Karell Balan**
- **Reed Lajom**

## License
**Proprietary & Academic Use Only**

This software is a thesis web application developed for academic purposes only. 

**Unauthorized use, distribution, reproduction, or modification of this application or any part thereof is strictly prohibited.**

No part of this application may be used for commercial, educational, or research purposes outside the original thesis project without explicit written permission from the developers.

---
For questions or contributions, please contact the developers or open an issue on the [GitHub repository](https://github.com/ELCRISHT/IntelliGrade).
