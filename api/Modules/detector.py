import re

# Suspicious Windows APIs
SUSPICIOUS_APIS = [
    "VirtualAlloc",
    "VirtualProtect",
    "WriteProcessMemory",
    "CreateRemoteThread",
    "LoadLibraryA",
    "GetProcAddress"
]

def detect_suspicious_apis(imports):
    findings = []

    for imp in imports:
        func = imp["function"]
        if func in SUSPICIOUS_APIS:
            findings.append(func)

    return list(set(findings))


TRUSTED_DOMAINS = [
    "microsoft.com",
    "windows.com",
    "google.com"
]

def detect_urls(strings):
    url_pattern = r"http[s]?://[^\s]{8,}"
    raw_urls = re.findall(url_pattern, " ".join(strings))

    filtered = []
    for url in raw_urls:
        # Remove very generic or short URLs
        if len(url) < 15:
            continue

        # Skip trusted/common domains
        if any(domain in url.lower() for domain in TRUSTED_DOMAINS):
            continue

        # Skip common installer/system URLs
        if "schemas." in url or "microsoft" in url.lower():
            continue

        filtered.append(url)

    return list(set(filtered))


import ipaddress

def detect_ips(strings):
    ip_pattern = r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b"
    raw_ips = re.findall(ip_pattern, " ".join(strings))

    valid_ips = []
    for ip in raw_ips:
        try:
            ipaddress.ip_address(ip)
            valid_ips.append(ip)
        except:
            pass

    return list(set(valid_ips))

def detect_packing(sections):
    packed = False
    for sec in sections:
        if "UPX" in sec["name"] and sec["size"] > 0:
            packed = True
    return packed

def calculate_risk_score(suspicious_apis, packed, urls, ips):
    score = 0

    # APIs (reduce weight)
    score += len(suspicious_apis) * 10

    # Packing (reduce weight)
    if packed:
        score += 15

    # URLs (more important)
    score += len(urls) * 10

    # IPs
    score += len(ips) * 10

    # Bonus: strong signal combination
    if packed and len(suspicious_apis) >= 3:
        score += 10

    return min(score, 100)