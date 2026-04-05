#!/usr/bin/env python3
"""Generate favicon files from logo.png"""

from PIL import Image
import os

# Paths
logo_path = "apps/web/public/logo.png"
public_dir = "apps/web/public"

# Open the logo
logo = Image.open(logo_path).convert("RGBA")

# Create a white background for ICO and PNG files
def add_white_background(img, size):
    """Add white background to image"""
    bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    # Center the logo
    offset = (size - img.size[0]) // 2
    bg.paste(img, (offset, offset), img)
    return bg

# Generate favicon files
favicon_sizes = {
    "favicon.ico": 32,
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "favicon-192x192.png": 192,
    "favicon-512x512.png": 512,
}

for filename, size in favicon_sizes.items():
    img = logo.copy()
    img.thumbnail((size - 8, size - 8), Image.Resampling.LANCZOS)
    
    resized = add_white_background(img, size)
    
    output_path = os.path.join(public_dir, filename)
    
    if filename.endswith(".ico"):
        resized.save(output_path)
    else:
        resized.save(output_path, "PNG")
    
    print(f"✓ Generated {filename} ({size}x{size})")

print("\nAll favicon files generated successfully!")
