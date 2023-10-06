#!/bin/bash

# URL of the CSS file to fetch
CSS_URL="https://cdn.hello.coop/css/hello-btn.css"

# Destination file path
DEST_FILE="src/frontend/buttons.module.css"

# Comment to add to the top of the CSS file
COMMENT="/* $CSS_URL */"

# Use curl to fetch the CSS and write it to the destination file, overwriting it
curl -s "$CSS_URL" > "$DEST_FILE"

# Add the comment to the top of the destination file
echo "$COMMENT" | cat - "$DEST_FILE" > temp && mv temp "$DEST_FILE"

echo "CSS from $CSS_URL has been saved to $DEST_FILE with the comment, overwriting any existing content."
