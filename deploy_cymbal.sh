#!/bin/bash
source util/shell/gbash/gbash.sh || exit 1
gbash::init_google "$@"
export PATH=$PATH:/google/data/ro/teams/cloud-sdk

PROJECT="apigee-ux-standard-testing"
REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/apigee-ux-standard-testing/cr-images/default-svc:latest"
SERVICE="cymbal-airline-sim"
echo "Building and Pushing new image..."
blaze run //devtools/ai/agents/airline_customer_sim/web:push || exit 1

echo "Deploying $SERVICE to Cloud Run..."
gcloud run deploy "$SERVICE" \
  --project="$PROJECT" \
  --region="$REGION" \
  --image="$IMAGE" \
  --platform=managed \
  --allow-unauthenticated \
  --quiet

if [ $? -eq 0 ]; then
  echo "Deployment successful. Syncing with GitHub..."
  if [ -n "$GITHUB_TOKEN" ]; then
    # Ensure we are in the script's directory for git commands
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    
    git add .
    git commit -m "Auto-deploy update: $(date +'%Y-%m-%d %H:%M:%S') TAG=agy"
    git push "https://$GITHUB_TOKEN@github.com/byz-at-google/cymbal-airlines-simulator" main:main
  else
    echo "Warning: GITHUB_TOKEN not set. Skipping GitHub sync."
  fi
else
  echo "Error: Deployment failed. Skipping GitHub sync."
fi
