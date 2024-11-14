# Onboarding Process with Firebase and Google Maps Integration

This project implements a robust, step-by-step onboarding process for users, integrating cryptocurrency wallet connectivity, business search via Google Maps API, and phone verification. The system tracks user progress, stores data in Firebase Firestore, and provides a seamless user experience.


## Note

Before proceeding with the onboarding process, if you want to run the code locally, you must have the **MetaMask extension** installed in your browser. You can download and install it from [here](https://metamask.io/).

---


## Onboarding Process Overview

### 1. **Firebase and Firestore Setup for Data Persistence**
   - **Firebase Initialization**: Configure Firebase in your application, integrating Firestore for persistent data storage.
   - **Data Structure**: The following collections are used:
     - `user_wallet`: Stores wallet address and connection status.
     - `business`: Stores business details (name, location, contact information).
     - `verification`: Tracks the status of phone call verification and security code entry.
   - **Utility Functions**: Implement utility functions for saving, retrieving, and updating user and business data within Firestore.

### 2. **Crypto Wallet Integration**
   - **Library Integration**: Use `ethers.js` or `web3.js` for integrating users' crypto wallets.
   - **Wallet Connection UI**: Build an intuitive interface allowing users to connect their crypto wallet.
   - **Data Storage**: Once the wallet is connected, store the wallet address and connection status in Firestore for tracking user onboarding progress.

### 3. **Business Search via Google Maps API**
   - **API Integration**: Register for and integrate Google Maps API to enable business location search.
   - **Business Search Interface**: Implement a search bar allowing users to search for businesses by name or type (e.g., "restaurant").
   - **Map Display**: Display search results on an interactive map and allow users to select a business.
   - **Data Storage**: When a business is selected, save the business's details (name, location, contact information) to Firestore.

### 4. **Business Information Display and Next Steps**
   - **Business Details Screen**: Show the selected business's information in a well-organized layout.
   - **Actionable Buttons**: Provide options for the user to either go back to the search step or proceed to business verification.
   - **Firestore Update**: Store the user’s choice (whether to continue with verification or search for another business).

### 5. **Phone Call Verification and Security Code Entry**
   - **Phone Number Display**: Display the business's phone number and provide a "Call Now" button.
   - **Security Code Field**: Prompt users to enter a 4-digit verification code sent via phone.
   - **Code Validation**: Validate the code entered by the user against a predefined value stored in Firestore. If the code is correct, update the verification status in Firestore.

### 6. **Completion and Confirmation**
   - **Verification Success Message**: Once the verification step is complete, display a confirmation message to the user.
   - **Final Firestore Update**: Update the user's onboarding status in Firestore to mark the process as complete.

---

## Core Code Tasks

- **Firestore CRUD Operations**: Implement robust CRUD operations for interacting with Firestore to manage user and business data.
- **React State Management**: Leverage React state and context to handle the progression of each step in the onboarding flow.
- **Component Development**: Create modular React components for each step (e.g., Wallet Connect, Business Search, Business Info, Security Code Verification).
- **Error Handling**: Implement comprehensive error handling for common issues such as wallet disconnection, incorrect code entries, and incomplete steps.

---

## Setting Up the Application

### Prerequisites

Ensure the following dependencies are installed before starting the project:
- **Node.js**: Download and install the latest version of [Node.js](https://nodejs.org/).
- **npm**: Node package manager (comes with Node.js).

### Installation Steps

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-repository-name
   cd your-repository-name


2. Install project dependencies:

```bash
   npm install
   npm start

 