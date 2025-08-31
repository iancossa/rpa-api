import os
import shutil
import json
import logging
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

def process_file_operation(json_input):
    """
    Process file operations from JSON input
    
    JSON Format:
    {
        "operation": "move|copy|rename|delete|organize",
        "source": "path/to/source",
        "destination": "path/to/destination",
        "organize_by": "extension|date",
        "base_path": "path/to/organize"
    }
    """
    try:
        data = json.loads(json_input) if isinstance(json_input, str) else json_input
        operation = data.get('operation')
        
        if operation == 'move':
            return move_file(data['source'], data['destination'])
        elif operation == 'copy':
            return copy_file(data['source'], data['destination'])
        elif operation == 'rename':
            return rename_file(data['source'], data['destination'])
        elif operation == 'delete':
            return delete_file(data['source'])
        elif operation == 'organize':
            return organize_files(data['base_path'], data.get('organize_by', 'extension'))
        else:
            logger.error("Invalid operation: %s", operation)
            return {"success": False, "error": "Invalid operation"}
            
    except Exception as e:
        logger.error("Error processing file operation: %s", str(e))
        return {"success": False, "error": str(e)}

def move_file(source, destination):
    """Move file from source to destination"""
    try:
        source_path = Path(source)
        dest_path = Path(destination)
        
        if not source_path.exists():
            logger.error("Source file not found: %s", source)
            return {"success": False, "error": "Source file not found"}
        
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source_path), str(dest_path))
        
        logger.info("File moved: %s -> %s", source, destination)
        return {"success": True, "action": "moved", "source": source, "destination": destination}
        
    except Exception as e:
        logger.error("Failed to move file %s: %s", source, str(e))
        return {"success": False, "error": str(e)}

def copy_file(source, destination):
    """Copy file from source to destination"""
    try:
        source_path = Path(source)
        dest_path = Path(destination)
        
        if not source_path.exists():
            logger.error("Source file not found: %s", source)
            return {"success": False, "error": "Source file not found"}
        
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(source_path), str(dest_path))
        
        logger.info("File copied: %s -> %s", source, destination)
        return {"success": True, "action": "copied", "source": source, "destination": destination}
        
    except Exception as e:
        logger.error("Failed to copy file %s: %s", source, str(e))
        return {"success": False, "error": str(e)}

def rename_file(source, new_name):
    """Rename file"""
    try:
        source_path = Path(source)
        
        if not source_path.exists():
            logger.error("Source file not found: %s", source)
            return {"success": False, "error": "Source file not found"}
        
        new_path = source_path.parent / new_name
        source_path.rename(new_path)
        
        logger.info("File renamed: %s -> %s", source, str(new_path))
        return {"success": True, "action": "renamed", "source": source, "destination": str(new_path)}
        
    except Exception as e:
        logger.error("Failed to rename file %s: %s", source, str(e))
        return {"success": False, "error": str(e)}

def delete_file(source):
    """Delete file"""
    try:
        source_path = Path(source)
        
        if not source_path.exists():
            logger.error("Source file not found: %s", source)
            return {"success": False, "error": "Source file not found"}
        
        source_path.unlink()
        
        logger.info("File deleted: %s", source)
        return {"success": True, "action": "deleted", "source": source}
        
    except Exception as e:
        logger.error("Failed to delete file %s: %s", source, str(e))
        return {"success": False, "error": str(e)}

def organize_files(base_path, organize_by="extension"):
    """Organize files by extension or creation date"""
    try:
        base_dir = Path(base_path)
        if not base_dir.exists():
            logger.error("Base path not found: %s", base_path)
            return {"success": False, "error": "Base path not found"}
        
        results = []
        
        for file_path in base_dir.iterdir():
            if file_path.is_file():
                if organize_by == "extension":
                    folder_name = file_path.suffix[1:] if file_path.suffix else "no_extension"
                elif organize_by == "date":
                    creation_time = datetime.fromtimestamp(file_path.stat().st_ctime)
                    folder_name = creation_time.strftime("%Y-%m")
                else:
                    logger.error("Invalid organize_by option: %s", organize_by)
                    return {"success": False, "error": "Invalid organize_by option"}
                
                dest_folder = base_dir / folder_name
                dest_folder.mkdir(exist_ok=True)
                dest_path = dest_folder / file_path.name
                
                shutil.move(str(file_path), str(dest_path))
                results.append({"file": str(file_path), "moved_to": str(dest_path)})
                logger.info("File organized: %s -> %s", str(file_path), str(dest_path))
        
        logger.info("Organization complete. %d files processed", len(results))
        return {"success": True, "action": "organized", "files_processed": len(results), "results": results}
        
    except Exception as e:
        logger.error("Failed to organize files in %s: %s", base_path, str(e))
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Example usage
    operations = [
        {"operation": "copy", "source": "test.txt", "destination": "backup/test.txt"},
        {"operation": "organize", "base_path": "downloads", "organize_by": "extension"},
        {"operation": "move", "source": "old_file.pdf", "destination": "archive/old_file.pdf"}
    ]
    
    for op in operations:
        result = process_file_operation(op)
        print(f"Result: {result}")