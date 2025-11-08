#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p assets/images

# Create a 1024x1024 transparent PNG for adaptive-icon.png
convert -size 1024x1024 xc:transparent assets/images/adaptive-icon.png

# Create a 1024x1024 transparent PNG for icon.png
convert -size 1024x1024 xc:transparent assets/images/icon.png

# Create a 1024x1024 transparent PNG for splash-icon.png
convert -size 1024x1024 xc:transparent assets/images/splash-icon.png

# Create a 1024x1024 transparent PNG for notification-icon.png
convert -size 1024x1024 xc:transparent assets/images/notification-icon.png

echo "Placeholder images created in assets/images/"
