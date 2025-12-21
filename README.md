# Insightt Frontend (Task Management)

This is the frontend application for the **Insightt Task Management System**, built as part of a Technical Test for a Full Stack JavaScript Programmer position.

It connects to a NestJS backend services and AWS Cloud resources to provide a secure and robust task management experience.

## 🚀 Features

- **Task CRUD**: Create, Read, Update, and Delete tasks.
- **Mark as Done**: Dedicated functionality to mark tasks as completed (Integrated with AWS Lambda).
- **Authentication**: Secure login and session management using **AWS Cognito** (via AWS Amplify).
- **Clean UI**: Specific Material UI components for a modern, responsive interface.
- **Feedback**: Loaders and Toast notifications (Snackbars) for optimal User Experience.
- **Validation**: Robust form validation using **Zod**.
- **Testing**: E2E testing configured with **Cypress**.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Material UI (MUI)](https://mui.com/)
- **Auth**: AWS Amplify / AWS Cognito
- **Validation**: Zod
- **HTTP Client**: Axios
- **Testing**: Cypress

## 📦 Project Structure

```bash
app/
├── components/          # Reusable UI components
│   ├── CreateTaskForm.tsx
│   ├── EditTaskDialog.tsx
│   └── TaskTable.tsx
├── page.tsx            # Main View (Controller & State container)
└── layout.tsx          # Root layout
lib/
├── api.ts              # Axios instance with Auth Interceptor
└── validation.ts       # Shared Zod schemas and helpers
types/
└── task.ts             # TypeScript interfaces and Enums
cypress/                # E2E Tests
└── e2e/
    └── app.cy.ts
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- NPM or Yarn
- A running instance of the Backend API (NestJS).
- `.env.local` file configured.

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd frontent-insightt
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    NEXT_PUBLIC_LAMBDA_DONE_URL=https://your-aws-lambda-url.com/prod/done
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxxx
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxx
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Running Tests

### E2E Tests (Cypress)

We use Cypress for End-to-End testing.

1.  Ensure the dev server is running (`npm run dev`).
2.  Run the tests:
    ```bash
    npm run test:e2e
    ```

## 📝 Code Overview

- **Modular Architecture**: The code is separated into Types, Logic (`lib`), and UI (`components`), avoiding monolithic files.
- **Secure API**: `lib/api.ts` automatically attaches the Cognito ID Token to every request using Axios interceptors.
- **Type Safety**: TypeScript is used strictly throughout the project to ensure reliability.

## 📄 License

This project is for evaluation purposes.
