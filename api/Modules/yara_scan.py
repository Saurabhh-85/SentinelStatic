import yara

def scan_with_yara(file_path, rule_path="Rules/malware_rules.yar"):
    try:
        rules = yara.compile(filepath=rule_path)
        matches = rules.match(file_path)

        results = []

        for match in matches:
            # Assign confidence levels
            if match.rule == "Suspicious_URL":
                confidence = "LOW"
            elif match.rule == "UPX_Packed":
                confidence = "MEDIUM"
            else:
                confidence = "HIGH"

            results.append({
                "rule": match.rule,
                "confidence": confidence
            })

        return results

    except Exception as e:
        return [{"error": str(e)}]