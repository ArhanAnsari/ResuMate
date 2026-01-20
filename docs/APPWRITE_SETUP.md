# Appwrite Backend Setup for ResuMate

This guide details how to set up the Appwrite backend for the ResuMate application.

## 1. Create Project

1. Log in to your Appwrite Console.
2. Click **Create Project**.
3. Name: `ResuMate`.
4. Region: Choose the one closest to you (e.g., `New York`, `Frankfurt`).

## 2. Add Platform (Mobile)

1. On the Dashboard, verify that your project is selected.
2. Click **Add key** (API Key) is NOT needed for Client SDKs in most cases, but we need to add a Platform.
3. Scroll down to "Add a platform".
4. Select **Android App** (for development).
   - Name: `ResuMate`
   - Package Name: `com.anonymous.ResuMate` (or your specific bundle ID from `app.json`)
5. Select **Apple App** (iOS).
   - Name: `ResuMate`
   - Bundle ID: `com.anonymous.ResuMate`
6. _Note_: If you are running on Web, add a **Web App** with hostname `localhost`.

## 3. Database Setup

1. Go to **Databases** in the left sidebar.
2. Click **Create Database**.
   - Name: `resumate_db`
   - ID: `unique()` or custom string `resumate_db`.
3. Click on the new database to enter it.

### Collection: `resumes`

1. Click **Create Collection**.
   - Name: `Resumes`
   - ID: `resumes`
2. Go to **Attributes** tab and add the following:
   - `userId` (String, Size: 36, Required: Yes) -> Index this for searching!
   - `title` (String, Size: 255, Required: Yes)
   - `data` (String, Size: 100000, Required: Yes) -> Stores the simplified JSON structure of the resume.
   - `templateId` (String, Size: 50, Required: No, Default: 'modern')
   - `isPublic` (Boolean, Required: No, Default: false)
3. Go to **Indexes** tab:
   - Key: `idx_user`, Type: `Key`, Attribute: `userId` (ASC).
4. Go to **Settings** (Permissions):
   - **Role**: `Any` -> Read, Create, Update, Delete (For dev).
   - _Production_: Role `Users` -> Create. Role `User:{id}` -> Read/Update/Delete (Document Security). Use Document Level Security for `userId`.

### Collection: `profiles` (Optional, if extending User prefs)

- `userId` (String, 36, Required)
- `themePreference` (String, 20)

## 4. Storage Setup

1. Go to **Storage**.
2. Click **Create Bucket**.
   - Name: `exports`
   - ID: `exports`
3. Permissions:
   - `Any` -> Read.
   - `Users` -> Create.

## 5. Environment Configuration

Copy your Project ID and Database IDs into your code constants.

```typescript
export const APPWRITE_CONFIG = {
  ENDPOINT: "https://cloud.appwrite.io/v1",
  PROJECT_ID: "YOUR_PROJECT_ID",
  DATABASE_ID: "resumate_db",
  COLLECTION_RESUMES: "resumes",
  BUCKET_EXPORTS: "exports",
};
```
