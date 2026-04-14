import os

def get_file_info(file_path):
    try:
        size = os.path.getsize(file_path)
        return {
            "file_name": os.path.basename(file_path),
            "file_size": size
        }
    except Exception as e:
        return {"error": str(e)}