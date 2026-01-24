# Appwrite Functions Setup for AI

This guide explains how to deploy the secure Serverless Function for Gemini AI.

## 1. Create the Function

1. Log in to your Appwrite Console.
2. Go to **Functions** in the sidebar.
3. Click **Create Function**.
   - **Name**: `AI Generate`
   - **Runtime**: `Node.js (18.0 or newer)`
   - **Function ID**: `ai_generate` (Must match `APP_CONFIG.FUNCTIONS.AI_GENERATE` in `src/core/config/app.ts`)

## 2. Environment Variables

In the **Settings** tab of your new function:

1. Scroll to **Environment Variables**.
2. Add Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `YOUR_GOOGLE_AI_STUDIO_Key` (Get it from [aistudio.google.com](https://aistudio.google.com/))

## 3. Deployment

You have two options to deploy the code provided in `functions/ai_generate`.

### Option A: Appwrite CLI (Recommended)

1. Install CLI: `npm install -g appwrite-cli`
2. Login: `appwrite login`
3. Initialize: `appwrite init function` (Select existing function `ai_generate`)
4. Deploy: `appwrite deploy function`

### Option B: Manual Upload (Tarball)

1. Navigate to the function folder: `cd functions/ai_generate`
2. Zip the contents (src folder, package.json).
3. In Appwrite Console > Function > **Deployment** tab.
4. Click **Create Deployment** > Upload the zip file.
5. In **Execute** entrypoint, enter: `src/main.js`.
6. Click **Activate**.

## 4. Permissions

In the **Settings** tab of the function:

1. Scroll to **Execute Access**.
2. Add Role: `Any` (if you want public access) OR `Users` (recommended, requires login).
   - _Note_: Since the app checks `isAuthenticated`, `Users` is the safe choice.

## 5. Usage

The app is already configured to use verify this.

- Go to any resume.
- Click "AI Enhance".
- It will trigger this function securely.

### 5. Usage
The app is configured with a **Hybrid Strategy**:
1. It checks if the user has provided a custom GEMINI_API_KEY in Settings.
- If YES: It calls Google Gemini API directly from the client.
- If NO: It calls this secure Appwrite Function.