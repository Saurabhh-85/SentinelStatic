import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
from typing import List, Dict, Any

# Import existing modules
from Modules.file_info import get_file_info
from Modules.hash_calc import calculate_hashes
from Modules.strings_extract import extract_strings
from Modules.pe_analysis import analyze_pe
from Modules.detector import (detect_suspicious_apis, detect_urls, detect_ips, detect_packing, calculate_risk_score)
from Modules.yara_scan import scan_with_yara

app = FastAPI(title="Malware Static Analysis API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    # Create a unique filename to avoid collisions
    file_id = str(uuid.uuid4())
    temp_file_path = os.path.join(TEMP_DIR, f"{file_id}_{file.filename}")
    
    try:
        # Save the uploaded file temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. File Info
        info = get_file_info(temp_file_path)
        
        # 2. Hashes
        hashes = calculate_hashes(temp_file_path)
        
        # 3. Strings
        strings = extract_strings(temp_file_path)
        
        # 4. PE Analysis
        pe_data = analyze_pe(temp_file_path)
        
        # 5. Malware Indicators
        suspicious_apis = []
        packed = False
        if "error" not in pe_data:
            suspicious_apis = detect_suspicious_apis(pe_data["imports"])
            packed = detect_packing(pe_data["sections"])
            
        urls = detect_urls(strings)
        ips = detect_ips(strings)
        
        # 6. Risk Score
        risk_score = calculate_risk_score(suspicious_apis, packed, urls, ips)
        
        # Risk Level
        if risk_score >= 70:
            risk_level = "HIGH RISK"
        elif risk_score >= 40:
            risk_level = "MEDIUM RISK"
        else:
            risk_level = "LOW RISK"
            
        # 7. YARA Scan
        yara_matches = scan_with_yara(temp_file_path)
        
        # Prepare final response
        results = {
            "filename": file.filename,
            "file_info": info,
            "hashes": hashes,
            "strings": strings[:50],  # Limit strings for API performance
            "pe_analysis": pe_data,
            "indicators": {
                "suspicious_apis": suspicious_apis,
                "is_packed": packed,
                "urls_found": urls,
                "ips_found": ips
            },
            "risk_assessment": {
                "score": risk_score,
                "level": risk_level
            },
            "yara_results": yara_matches
        }
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup: Remove the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
