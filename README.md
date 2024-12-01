# Banking Application Backend (RBAC)

This backend application is built entirely on a **Role-Based Access Control (RBAC)** system. It supports three major roles: **Customer**, **Teller**, and **Manager**, each with specific permissions.

---

## Roles and Permissions

### 1. **Customer**
Customers are the primary users of the application. They can perform the following actions:
- **Create Account**: Sign up and create a new bank account.
- **Login**: Log in to access their account.
- **Get Account Info**: Fetch their account balance and other basic details.
- **Apply for Loan**: Submit a loan application for processing.
- **Do Transaction**: Perform transactions like fund transfers.

---

### 2. **Teller**
Tellers handle the operational aspects of customer transactions. They can perform the following actions:
- **Login/Signup**: Register or log in to their teller account.
- **Process Deposits and Withdrawals**: Approve and manage customer deposits and withdrawal requests.

---

### 3. **Manager**
Managers oversee higher-level operations and loan management. They can perform the following actions:
- **Login/Signup**: Register or log in to their manager account.
- **Process Loans**: Approve or reject loan applications submitted by customers.

---

## Features
- **Role-Based Access Control (RBAC)**: Ensures each role has access only to permitted actions.
- **Authentication and Authorization**: Secures endpoints for role-based functionality.
- **Scalable Design**: Easy to extend with new roles or permissions.

## Postman Collection Link 
https://drive.google.com/file/d/1z3AfLFZwalMiOVOp7PcWLKH1uYA-cZop/view?usp=sharing
