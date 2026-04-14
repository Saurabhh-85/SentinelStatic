🛡️ SentinelStatic
SentinelStatic is a premium, state-of-the-art malware static analysis platform. It transforms deep binary inspection into a visual, high-fidelity experience, allowing security researchers and analysts to quickly assess threats through a modern, glassmorphism-styled dashboard.

License Python FastAPI React

✨ Key Features
🚀 Premium Web Dashboard: A "Sentinel" dark-mode theme featuring glassmorphism, glowing accents, and smooth Framer Motion animations.
🔍 Deep PE Inspection: Automated analysis of Portable Executable (PE) headers, entry points, sections, and import/export tables.
⚠️ Intelligent Risk Scoring: A dynamic 0-100 threat meter based on suspicious API calls, UPX packing, and network indicators.
🔏 YARA Integration: Confidence-based pattern matching using advanced YARA rules to identify malware families and behaviors.
🌐 Network Intel: Automated extraction of embedded URLs and IP addresses directly from binary strings.
📊 Indicator Center: Visual badges for quickly identifying packer signatures, suspicious capabilities, and anomaly detections.
🛠️ Technology Stack
Layer	Technologies
Backend	Python, FastAPI, Pefile, Yara-Python
Frontend	React, Vite, Framer Motion, Vanilla CSS (Glassmorphism)
DevOps	Vercel (Frontend), FastAPI (API)
🚦 Quick Start
1. Prerequisites
Python 3.8+
Node.js (v18+)
2. Setup & Execution
The easiest way to start both the backend and frontend is to use the included batch file (Windows):

./run_app.bat
Manual Start:

Backend:
pip install -r requirements.txt
python api.py
Frontend:
cd frontend
npm install
npm run dev
📂 Project Structure
/api.py: FastAPI backend orchestrating the analysis engine.
/Modules/: Core analysis logic (PE analysis, hash calculation, YARA scanning).
/frontend/: React-based modern dashboard.
/Rules/: Custom YARA rules for threat classification.
🛡️ Responsible Use
This tool is intended for educational and security research purposes only. Always analyze potentially malicious files in a secure, isolated sandbox environment.
