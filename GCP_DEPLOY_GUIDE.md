# GCP Deployment Guide for TerraTrace

This guide details how to build and deploy the TerraTrace Carbon Footprint Tracker app to **Google Cloud Run** using **Google Cloud Build**.

---

## Prerequisites

1. A **Google Cloud Platform (GCP)** account. If you don't have one, create it and set up billing (GCP provides a generous free tier for Cloud Run and Cloud Build).
2. The **gcloud CLI** installed on your local machine.
   - [Download and install Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
3. Ensure Docker is running if you want to test the container locally first (optional).

---

## Step 1: Authenticate CLI with GCP

Open your terminal (PowerShell, Command Prompt, or bash) and log in to your Google Cloud account:

```bash
gcloud auth login
```

This will open a browser window for authentication.

---

## Step 2: Create or Set Your GCP Project

Choose a project name (referred here as `YOUR_PROJECT_ID`). If you already have a project, configure `gcloud` to use it:

```bash
gcloud config set project YOUR_PROJECT_ID
```

*(If creating a new project via CLI: `gcloud projects create YOUR_PROJECT_ID` and link billing in the GCP Console).*

---

## Step 3: Enable Cloud Build & Cloud Run APIs

Ensure the necessary APIs are enabled for compiling the Docker container and serving it dynamically:

```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

---

## Step 4: Deploy Using Google Cloud Build

You do not need Node.js or Docker installed locally to deploy! The `cloudbuild.yaml` script compiles the TypeScript frontend inside GCP's secure servers, builds the Docker image, pushes it to GCR, and updates Cloud Run.

From the root directory (`c:\Users\HP\javed pro`), execute:

```bash
gcloud builds submit --config cloudbuild.yaml
```

*This command uploads your source code files to Cloud Build, which automates the steps defined in `cloudbuild.yaml`.*

---

## Step 5: Retrieve Your App URL

Once the command finishes running (takes 1-3 minutes), the CLI output will print a secure URL, e.g.:

```text
Service [carbon-tracker] revision [carbon-tracker-00001-abc] has been deployed and is serving 100% of traffic.
Service URL: https://carbon-tracker-wxy123z-uc.a.run.app
```

Click the URL to open your premium Carbon Footprint Tracker app!

---

## Alternative: Local Docker Testing

If you have Docker installed locally and want to test the container beforehand:

1. **Build the image locally:**
   ```bash
   docker build -t carbon-tracker .
   ```

2. **Run the container locally:**
   ```bash
   docker run -p 8080:8080 carbon-tracker
   ```
   Open `http://localhost:8080` in your browser.
