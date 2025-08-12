import os

def print_tree(root_dir):
    def walk(dir_path, prefix=""):
        entries = sorted(os.listdir(dir_path))
        entries = [e for e in entries if not e.startswith('.') and e != '__pycache__']
        for index, entry in enumerate(entries):
            path = os.path.join(dir_path, entry)
            connector = "├── " if index < len(entries) - 1 else "└── "
            print(prefix + connector + entry)
            if os.path.isdir(path) and entry != '__pycache__':
                extension = "│   " if index < len(entries) - 1 else "    "
                walk(path, prefix + extension)

    print(os.path.basename(os.path.abspath(root_dir)) + "/")
    walk(root_dir)

# Example usage:
print_tree("backend\\app")
