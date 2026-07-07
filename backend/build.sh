#!/usr/bin/env bash
# Exit immediately if any command exits with a non-zero status
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate