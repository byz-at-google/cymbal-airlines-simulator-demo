#!/bin/bash
source util/shell/gbash/gbash.sh || exit 1
gbash::init_google "$@"
export PATH=$PATH:/google/data/ro/teams/cloud-sdk

PROJECT="apigee-ux-standard-testing"
REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/apigee-ux-standard-testing/cr-images/default-svc:latest"
SERVICE="cymbal-airline-sim"

echo "Deploying $SERVICE to Cloud Run..."
gcloud run deploy "$SERVICE" \
  --project="$PROJECT" \
  --region="$REGION" \
  --image="$IMAGE" \
  --platform=managed \
  --allow-unauthenticated \
  --quiet
