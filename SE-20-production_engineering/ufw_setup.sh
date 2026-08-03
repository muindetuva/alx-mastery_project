#!/bin/bash

set -e

sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow administration before enabling the firewall to avoid an SSH lockout.
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw enable
sudo ufw status verbose
