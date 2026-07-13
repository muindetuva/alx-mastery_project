#!/usr/bin/env bash

PROJECT_NAME="$1"

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: ./setup.sh <project-name>"
  exit 1
fi

if [ -d "$PROJECT_NAME" ]; then
  echo "Error: project folder '$PROJECT_NAME' already exists."
  exit 1
fi

echo "Creating workspace '$PROJECT_NAME'..."

mkdir "$PROJECT_NAME"
mkdir "$PROJECT_NAME/src" "$PROJECT_NAME/docs" "$PROJECT_NAME/tests" "$PROJECT_NAME/data"

cat > "$PROJECT_NAME/README.md" <<README
# $PROJECT_NAME

Created on: $(date +"%Y-%m-%d")

## Description

TODO: Add a short description of this project.

## Usage

TODO: Add usage instructions.

## Contributing

TODO: Add contribution guidelines.
README

chmod +x "$0"

cd "$PROJECT_NAME" || exit 1
git init > /dev/null
