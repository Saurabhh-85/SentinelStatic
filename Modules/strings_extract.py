import re

def extract_strings(file_path, min_length=4):
    strings = []

    try:
        with open(file_path, "rb") as f:
            data = f.read()

        pattern = rb"[ -~]{" + str(min_length).encode() + rb",}"
        matches = re.findall(pattern, data)

        strings = [s.decode(errors="ignore") for s in matches]

        return strings[:50]  # limit output
    except Exception as e:
        return ["Error: " + str(e)]