# SentinelStatic: Web Interface Upgrade

I have transformed your terminal-based malware analyzer into a premium, state-of-the-art web application.

## 🚀 Key Enhancements

### 1. Backend Transformation (`api.py`)
- Refactored the core logic into a **FastAPI** service.
- Added a `/analyze` endpoint that handles file uploads and returns structured JSON results.
- Implemented CORS for seamless frontend-to-backend communication.

### 2. Premium Design System (`frontend/`)
- **Aesthetics**: Implemented a "Sentinel" dark-mode theme with glassmorphism and glowing accents.
- **Animations**: Integrated **Framer Motion** for smooth transitions and real-time risk meter updates.
- **Micro-interactions**: Added glowing hover effects, loading spinners, and interactive badges.

### 3. Integrated Dashboard
- **Risk Assessment**: A prominent dial showing the threat level from 0-100.
- **File Metadata**: Detailed breakdown of hashes, entry points, and filenames.
- **Indicator Center**: Visual badges for YARA matches, UPX packing, and suspicious APIs.
- **Network Intel**: Automated extraction of URLs and IP addresses found in the binary.

## 🛠️ How to Run

1.  **Start the Backend**:
    ```bash
    python api.py
    ```
    *The API will be available at `http://localhost:8000`*

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Open the URL provided (usually `http://localhost:5173`) in your browser.*

> [!TIP]
> I've created a `run_app.bat` file in the root directory. You can simply double-click it to start both the backend and frontend at once!

## 📂 Project Structure
- `api.py`: The new FastAPI backend.
- `requirements.txt`: Updated dependencies.
- `frontend/`: The React-based modern dashboard.
- `run_app.bat`: Quickstart script.
