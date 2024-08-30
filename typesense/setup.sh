#!/bin/bash

# Source the .env file from the parent directory if it exists
if [[ -f "../.env" ]]; then
    set -a
    source "../.env"
    set +a
fi

# Check for required environment variables
if [ -z "$TYPESENSE_HOST" ]; then
    echo "Error: TYPESENSE_HOST environment variable is not set."
    exit 1
fi

if [ -z "$TYPESENSE_API_KEY" ]; then
    echo "Error: TYPESENSE_API_KEY environment variable is not set."
    exit 1
fi

if [ -z "$OPEN_AI_API_KEY" ]; then
    echo "Error: OPEN_AI_API_KEY environment variable is not set."
    exit 1
fi

# Read the JSON file
json_file="./collections/annotation.json"
json_content=$(cat "$json_file")

# Replace the placeholder API key with the actual OpenAI API key
updated_json=$(echo "$json_content" | sed "s/{{OPEN_AI_API_KEY}}/$OPEN_AI_API_KEY/g")

# Create collection
response=$(curl -s -w "%{http_code}" -X POST "${TYPESENSE_HOST}/collections" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$updated_json")

# Extract the HTTP status code
http_status="${response: -3}"
# Extract the response body
body="${response:0:${#response}-3}"

# Check if collection was created successfully
if [ "$http_status" -eq 201 ]; then
  echo "Collection created successfully"
  echo "Response: $body"
else
  echo "Failed to create collection. Status code: $http_status"
  echo "Error response: $body"
  exit 1
fi

echo "Typesense setup complete"
