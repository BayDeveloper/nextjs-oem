import os
import sys

# Directories and files to exclude from processing
exclude_dirs = {
    ".git",
    ".next",
    "node_modules",
    "public",
    "combined",
}

exclude_files = {
    "codegen.py",
    "package-lock.json",
    "README.md",
    "favicon.ico",
    "globals.css",
    "setuppem.txt",
}


def print_tree(file_paths, base_dir=""):
    """
    Prints the directory structure of the provided file paths.
    """
    if not file_paths:
        print("No files to print in the directory tree.")
        return

    dir_tree = {}
    for path in file_paths:
        relative_path = os.path.relpath(path, base_dir)
        directory = os.path.dirname(relative_path)

        if directory not in dir_tree:
            dir_tree[directory] = []
        dir_tree[directory].append(relative_path)

    sorted_directories = sorted(dir_tree.keys())
    for directory in sorted_directories:
        print(f"Directory: {directory}/")
        sys.stdout.flush()
        sorted_files = sorted(dir_tree[directory])
        for file in sorted_files:
            print(f"    File: {file.replace(directory + '/', '')}")
            sys.stdout.flush()


def get_all_files(directory_to_scan):
    """
    Retrieves all the files in the given directory,
    excluding specified directories and files.
    """
    print(f"Scanning directory: {directory_to_scan}")
    file_paths = []

    for root, dirs, files in os.walk(directory_to_scan):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and "copy" not in d]  # NOQA
        files = [f for f in files if f not in exclude_files and "copy" not in f]  # NOQA

        for file in files:
            file_paths.append(os.path.join(root, file))

    print(f"Files found: {len(file_paths)}")
    return file_paths


def write_files_to_single_file(
    file_paths, location_directory, output_dir, max_chars=4000, prefix=""
):
    """
    Writes all the files' contents into a single file
    or splits into multiple files if necessary.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print("Directory tree of files to be written:")
    sys.stdout.flush()

    print(f"file_paths contains: {file_paths[:10]}")
    print_tree(file_paths, location_directory)

    full_output_path = os.path.join(output_dir, f"{prefix}.txt")
    content_buffer = ""
    total_size = 0

    for path in file_paths:
        relative_path = os.path.relpath(path, location_directory)
        corrected_path = f"/{prefix}/" + relative_path.replace(os.sep, "/")
        content_buffer += f"\n-- {corrected_path} --\n"

        try:
            with open(path, "r", encoding="utf-8") as f_in:
                content = f_in.read()
                content_buffer += content
                content_buffer += "\n\n" + "-" * 40 + "\n\n"
            total_size += os.path.getsize(path)
        except Exception as e:
            print(f"Error reading file {path}: {e}")
            sys.stdout.flush()

    with open(full_output_path, "w", encoding="utf-8") as f_out:
        f_out.write(content_buffer)

    print(f"All file contents have been written to {full_output_path}")
    sys.stdout.flush()

    print(f"\nSummary:")  # NOQA
    print(f"Total files processed: {len(file_paths)}")
    print(f"Total content size: {total_size / 1024:.2f} KB")
    sys.stdout.flush()

    if len(content_buffer) > max_chars:
        file_count = 1
        content_buffer = ""

        for path in file_paths:
            relative_path = os.path.relpath(path, location_directory)
            corrected_path = f"/{prefix}/" + relative_path.replace(os.sep, "/")
            content_buffer += f"\n-- {corrected_path} --\n"

            try:
                with open(path, "r", encoding="utf-8") as f_in:
                    content = f_in.read()
                    content_buffer += content
                    content_buffer += "\n\n" + "-" * 40 + "\n\n"
            except Exception as e:
                print(f"Error reading file {path}: {e}")
                sys.stdout.flush()

            if len(content_buffer) > max_chars:
                output_file = os.path.join(
                    output_dir, f"combined_output_{file_count}.txt"
                )
                with open(output_file, "w", encoding="utf-8") as f_out:
                    f_out.write(content_buffer)
                print(f"Written {output_file}")
                sys.stdout.flush()
                file_count += 1
                content_buffer = ""

        if content_buffer:
            output_file = os.path.join(
                output_dir, f"combined_output_{file_count}.txt"
            )  # NOQA
            with open(output_file, "w", encoding="utf-8") as f_out:
                f_out.write(content_buffer)
            print(f"Written {output_file}")
            sys.stdout.flush()


def create_directory_files(file_paths, base_dir, output_dir, prefix=""):
    """
    Creates a single file per top-level directory
    and writes combined content to it.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    dir_tree = {}

    for path in file_paths:
        relative_path = os.path.relpath(path, base_dir)
        directory = os.path.dirname(relative_path)
        top_level_dir = directory.split(os.sep)[0]

        if top_level_dir not in dir_tree:
            dir_tree[top_level_dir] = []

        dir_tree[top_level_dir].append(path)

    for top_level_dir, paths in dir_tree.items():
        output_file = os.path.join(output_dir, f"{prefix}_{top_level_dir}.txt")
        content_buffer = ""

        for path in paths:
            relative_path = os.path.relpath(path, base_dir)
            corrected_path = f"/{prefix}/" + relative_path.replace(os.sep, "/")
            content_buffer += f"\n-- {corrected_path} --\n"

            try:
                with open(path, "r", encoding="utf-8") as f_in:
                    content = f_in.read()
                    content_buffer += content
                    content_buffer += "\n\n" + "-" * 40 + "\n\n"
            except Exception as e:
                print(f"Error reading file {path}: {e}")
                sys.stdout.flush()

        with open(output_file, "w", encoding="utf-8") as f_out:
            f_out.write(content_buffer)
        print(f"Written {output_file}")
        sys.stdout.flush()


def main(directory_to_scan, combined_text, combined_dir, prefix="backend"):
    """
    Main function to scan the directory,
    write content to single files or directory-based files.
    """
    print("Starting to scan files")
    file_paths = get_all_files(directory_to_scan)

    print(f"Found {len(file_paths)} files.")

    if file_paths:
        write_files_to_single_file(
            file_paths, directory_to_scan, combined_text, prefix=prefix
        )
        create_directory_files(
            file_paths, directory_to_scan, combined_dir, prefix=prefix
        )
        print("All files have been processed.")
        sys.stdout.flush()
    else:
        print("No files found to process.")
        sys.stdout.flush()


# Example usage
directory_to_scan = "/home/devx/project/exportimport/nextjs-oem"
combined_text = "/home/devx/project/exportimport/nextjs-oem/combined/combined_text"
combined_dir = "/home/devx/project/exportimport/nextjs-oem/combined/combined_dir"
prefix = "nextjs_oem_frontend"

main(directory_to_scan, combined_text, combined_dir, prefix)
