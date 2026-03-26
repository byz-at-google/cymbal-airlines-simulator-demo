#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../../../../util/shell/gbash/gbash.sh" || exit 1
gbash::init_google "$@"
export PATH=$PATH:/google/data/ro/teams/cloud-sdk

ENV="${ENV:-dev}" # Default to 'dev' if not set in environment

PROJECT="apigee-ux-standard-testing"
REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/apigee-ux-standard-testing/cr-images/default-svc:latest"

if [ "$ENV" == "live" ]; then
  SERVICE="cymbal-airline-sim"
  BRANCH="main"
elif [ "$ENV" == "dev" ]; then
  SERVICE="cymbal-airline-sim-dev"
  BRANCH="dev"
else
  echo "Unknown environment: $ENV. Use 'dev' or 'live'."
  exit 1
fi

echo "Building and Pushing new image..."
blaze run //devtools/ai/agents/airline_customer_sim/web:push || exit 1

echo "Deploying $SERVICE to Cloud Run ($ENV)..."
gcloud run deploy "$SERVICE" \
  --project="$PROJECT" \
  --region="$REGION" \
  --image="$IMAGE" \
  --platform=managed \
  --allow-unauthenticated \
  --quiet

if [ $? -eq 0 ]; then
  echo "Deployment to $ENV successful. Syncing with GitHub..."
  if [ -n "$GITHUB_TOKEN" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    
    git add .
    git commit -m "Auto-deploy update ($ENV): $(date +'%Y-%m-%d %H:%M:%S') TAG=agy"
    
    if [ "$ENV" == "live" ]; then
      CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
      if [ "$CURRENT_BRANCH" == "dev" ]; then
        echo "Merging dev into main for live release..."
        git checkout main
        git merge dev -m "Merge dev into main for live release TAG=agy"
        git push "https://$GITHUB_TOKEN@github.com/byz-at-google/cymbal-airlines-simulator" main:main
        git checkout dev
      else
        git push "https://$GITHUB_TOKEN@github.com/byz-at-google/cymbal-airlines-simulator" main:main
      fi
    else
      git push "https://$GITHUB_TOKEN@github.com/byz-at-google/cymbal-airlines-simulator" dev:dev
    fi
  else
    echo "Warning: GITHUB_TOKEN not set. Skipping GitHub sync."
  fi
else
  echo "Error: Deployment failed. Skipping GitHub sync."
fi
