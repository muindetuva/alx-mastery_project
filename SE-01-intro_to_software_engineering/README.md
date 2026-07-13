# Intro to Software Engineering Workspace Setup

This task contains a Bash script that creates a starter workspace for a new project.

## Usage

Run the script with one project name:

```bash
./setup.sh my-project
```

The script creates:

- `src/`
- `docs/`
- `tests/`
- `data/`
- `README.md`
- `.git/`

The generated `README.md` includes the project name, creation date, placeholder sections, and a project structure summary.

If the requested project directory already exists, the script prints an error and exits without overwriting it.

## Verification

After running the script, check the generated project:

```bash
ls my-project
ls -a my-project | grep .git
```
