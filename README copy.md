# Password Reset Backend

# Rendered Information

This document provides essential information about the Password Reset Flow project, including relevant URLs and the last committed hash ID.

## Render URL

- **URL:** https://password-reset-backend-main-oepf.onrender.com

## API Documentation

- **URL:** [POSTMAN Documentation] 

## API Endpoints

### Signup

This API endpoint allows you signup for new user

**URL:** https://password-reset-backend-main-oepf.onrender.com/api/signup

**Method:** POST

### Login

This API endpoint will manage login process with jwt token authoraization.

**URL:** https://password-reset-backend-main-oepf.onrender.com/api/login

**Method:** POST

### Forgot Password

This API endpoint will manage forgot password process, it will send password reset link to user with token for Authoraization.

**URL:** https://password-reset-backend-main-oepf.onrender.com/api/forgot-password

**Method:** POST

### Verifying Password Reset Link

This API endpoint will send the verification token to backend and verify its valid or not.

**URL:** https://password-reset-backend-main-oepf.onrender.com/api/verify-token/:token

**Method:** GET

### Reset Password

This API endpoint will allow user to set new password by verifying token which was generated.

**URL:** https://password-reset-backend-main-oepf.onrender.com/api/reset-password

**Method:** PUT

### Avatar List

This API endpoint will send all avatar list to consume on user end to set profile picture

**URL:** https://password-reset-backend-main-oepf.onrender.com/api/avatars

**Method:** GET

## GitHub Repository

- **URL:** [Git Repository](https://github.com/Shanmugamrskfamily/password-reset-backend.git)

## Last Committed Hash ID

- **Hash ID:**  

---
