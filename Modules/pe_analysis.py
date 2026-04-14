import pefile

def analyze_pe(file_path):
    try:
        pe = pefile.PE(file_path)

        result = {}

        # Entry Point
        result["entry_point"] = hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint)

        # Sections
        sections = []
        for section in pe.sections:
            sections.append({
                "name": section.Name.decode().strip('\x00'),
                "virtual_address": hex(section.VirtualAddress),
                "size": section.SizeOfRawData
            })
        result["sections"] = sections

        # Imports (VERY IMPORTANT)
        imports = []
        if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
            for entry in pe.DIRECTORY_ENTRY_IMPORT:
                dll_name = entry.dll.decode()
                for imp in entry.imports:
                    imports.append({
                        "dll": dll_name,
                        "function": imp.name.decode() if imp.name else "None"
                    })
        result["imports"] = imports

        return result

    except Exception as e:
        return {"error": str(e)}