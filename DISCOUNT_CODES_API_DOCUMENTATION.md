# Discount Codes API Documentation

This document provides comprehensive API documentation for the discount code management system, designed for frontend developers to integrate discount code functionality into their applications.

## Table of Contents
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Endpoints Overview](#endpoints-overview)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Frontend Integration Examples](#frontend-integration-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Authentication

All discount code endpoints require JWT authentication. Include the authorization header in all requests:

```http
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
http://localhost:3001
```

## Endpoints Overview

| Method | Endpoint | Purpose | Required Permission |
|--------|----------|---------|-------------------|
| POST | `/discount-codes` | Create new discount code | `discount-codes:create` |
| GET | `/discount-codes` | Get all discount codes | `discount-codes:read` |
| GET | `/discount-codes/:id` | Get specific discount code | `discount-codes:read` |
| PATCH | `/discount-codes/:id` | Update discount code | `discount-codes:update` |
| DELETE | `/discount-codes/:id` | Delete discount code | `discount-codes:delete` |
| POST | `/discount-codes/validate` | Validate discount code | `discount-codes:read` |
| PATCH | `/discount-codes/:id/increment-usage` | Increment usage count | `discount-codes:update` |

## API Endpoints

### 1. Create Discount Code

Create a new discount code with specified parameters.

**Endpoint:** `POST /discount-codes`

**Request Body:**
```json
{
  "code": "STUDENT2024",
  "user_id": 1,
  "name": "Student Discount 2024",
  "purpose": "Special discount for new students",
  "amount": 50000,
  "percent": 10,
  "usage_limit": 100,
  "used_count": 0,
  "valid_from": "2024-01-01",
  "valid_to": "2024-12-31",
  "active": true
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "code": "STUDENT2024",
  "user_id": 1,
  "name": "Student Discount 2024",
  "purpose": "Special discount for new students",
  "amount": "50000.00",
  "percent": 10,
  "usage_limit": 100,
  "used_count": 0,
  "valid_from": "2024-01-01",
  "valid_to": "2024-12-31",
  "active": true,
  "created_at": "2024-10-11T12:00:00.000Z",
  "updated_at": "2024-10-11T12:00:00.000Z",
  "user": {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### 2. Get All Discount Codes

Retrieve all discount codes with pagination and filtering options.

**Endpoint:** `GET /discount-codes`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "code": "STUDENT2024",
    "user_id": 1,
    "name": "Student Discount 2024",
    "purpose": "Special discount for new students",
    "amount": "50000.00",
    "percent": 10,
    "usage_limit": 100,
    "used_count": 25,
    "valid_from": "2024-01-01",
    "valid_to": "2024-12-31",
    "active": true,
    "created_at": "2024-10-11T12:00:00.000Z",
    "updated_at": "2024-10-11T12:00:00.000Z",
    "user": {
      "id": 1,
      "full_name": "Admin User",
      "email": "admin@example.com"
    }
  }
]
```

### 3. Get Discount Code by ID

Retrieve a specific discount code by its ID.

**Endpoint:** `GET /discount-codes/:id`

**Parameters:**
- `id` (number): The discount code ID

**Success Response (200):**
```json
{
  "id": 1,
  "code": "STUDENT2024",
  "user_id": 1,
  "name": "Student Discount 2024",
  "purpose": "Special discount for new students",
  "amount": "50000.00",
  "percent": 10,
  "usage_limit": 100,
  "used_count": 25,
  "valid_from": "2024-01-01",
  "valid_to": "2024-12-31",
  "active": true,
  "created_at": "2024-10-11T12:00:00.000Z",
  "updated_at": "2024-10-11T12:00:00.000Z",
  "user": {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### 4. Update Discount Code

Update an existing discount code.

**Endpoint:** `PATCH /discount-codes/:id`

**Parameters:**
- `id` (number): The discount code ID

**Request Body (all fields optional):**
```json
{
  "name": "Updated Student Discount 2024",
  "purpose": "Updated purpose",
  "amount": 75000,
  "percent": 15,
  "usage_limit": 200,
  "valid_to": "2025-01-31",
  "active": true
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "code": "STUDENT2024",
  "user_id": 1,
  "name": "Updated Student Discount 2024",
  "purpose": "Updated purpose",
  "amount": "75000.00",
  "percent": 15,
  "usage_limit": 200,
  "used_count": 25,
  "valid_from": "2024-01-01",
  "valid_to": "2025-01-31",
  "active": true,
  "created_at": "2024-10-11T12:00:00.000Z",
  "updated_at": "2024-10-11T12:30:00.000Z",
  "user": {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### 5. Delete Discount Code

Delete a discount code permanently.

**Endpoint:** `DELETE /discount-codes/:id`

**Parameters:**
- `id` (number): The discount code ID

**Success Response (200):**
```json
{
  "message": "Discount code deleted successfully",
  "id": 1
}
```

### 6. Validate Discount Code

Validate if a discount code is valid and can be used.

**Endpoint:** `POST /discount-codes/validate`

**Request Body:**
```json
{
  "code": "STUDENT2024"
}
```

**Success Response (200) - Valid Code:**
```json
{
  "valid": true,
  "discountCode": {
    "id": 1,
    "code": "STUDENT2024",
    "name": "Student Discount 2024",
    "purpose": "Special discount for new students",
    "amount": "50000.00",
    "percent": 10,
    "usage_limit": 100,
    "used_count": 25,
    "valid_from": "2024-01-01",
    "valid_to": "2024-12-31",
    "active": true
  },
  "message": "Discount code is valid"
}
```

**Error Response (400) - Invalid Code:**
```json
{
  "valid": false,
  "message": "Discount code is expired",
  "error": "EXPIRED"
}
```

**Error Response (404) - Code Not Found:**
```json
{
  "valid": false,
  "message": "Discount code not found",
  "error": "NOT_FOUND"
}
```

### 7. Increment Usage Count

Increment the usage count of a discount code when it's applied.

**Endpoint:** `PATCH /discount-codes/:id/increment-usage`

**Parameters:**
- `id` (number): The discount code ID

**Success Response (200):**
```json
{
  "id": 1,
  "code": "STUDENT2024",
  "used_count": 26,
  "message": "Usage count incremented successfully"
}
```

## Data Models

### Discount Code Model

```typescript
interface DiscountCode {
  id: number;
  code: string;                    // Unique discount code
  user_id: number;                 // Creator user ID
  name: string;                    // Display name
  purpose: string;                 // Purpose/description
  amount?: number;                 // Fixed discount amount
  percent?: number;                // Percentage discount
  usage_limit?: number;            // Maximum number of uses
  used_count: number;              // Current usage count
  valid_from?: Date;               // Start date
  valid_to?: Date;                 // Expiry date
  active: boolean;                 // Active status
  created_at: Date;                // Creation timestamp
  updated_at: Date;                // Last update timestamp
  user?: User;                     // Creator user details
}
```

### Create Discount Code DTO

```typescript
interface CreateDiscountCodeDto {
  code: string;                    // Required: Unique code (max 100 chars)
  user_id: number;                 // Required: Creator user ID
  name: string;                    // Required: Display name (max 255 chars)
  purpose: string;                 // Required: Purpose (max 255 chars)
  amount?: number;                 // Optional: Fixed discount amount
  percent?: number;                // Optional: Percentage discount (0-100)
  usage_limit?: number;            // Optional: Maximum uses
  used_count?: number;             // Optional: Initial usage count (default: 0)
  valid_from?: string;             // Optional: Start date (ISO string)
  valid_to?: string;               // Optional: End date (ISO string)
  active?: boolean;                // Optional: Active status (default: true)
}
```

## Frontend Integration Examples

### React Service Class

```typescript
class DiscountCodeService {
  private baseURL = 'http://localhost:3001';
  
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createDiscountCode(data: CreateDiscountCodeDto): Promise<DiscountCode> {
    const response = await fetch(`${this.baseURL}/discount-codes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create discount code: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllDiscountCodes(): Promise<DiscountCode[]> {
    const response = await fetch(`${this.baseURL}/discount-codes`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch discount codes: ${response.statusText}`);
    }

    return response.json();
  }

  async getDiscountCode(id: number): Promise<DiscountCode> {
    const response = await fetch(`${this.baseURL}/discount-codes/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch discount code: ${response.statusText}`);
    }

    return response.json();
  }

  async updateDiscountCode(id: number, data: Partial<CreateDiscountCodeDto>): Promise<DiscountCode> {
    const response = await fetch(`${this.baseURL}/discount-codes/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update discount code: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteDiscountCode(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/discount-codes/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete discount code: ${response.statusText}`);
    }
  }

  async validateDiscountCode(code: string): Promise<{valid: boolean; discountCode?: DiscountCode; message: string}> {
    const response = await fetch(`${this.baseURL}/discount-codes/validate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ code }),
    });

    return response.json();
  }

  async incrementUsage(id: number): Promise<{id: number; code: string; used_count: number; message: string}> {
    const response = await fetch(`${this.baseURL}/discount-codes/${id}/increment-usage`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to increment usage: ${response.statusText}`);
    }

    return response.json();
  }
}

export const discountCodeService = new DiscountCodeService();
```

### React Hook for Discount Codes

```typescript
import { useState, useEffect } from 'react';
import { discountCodeService } from './DiscountCodeService';

export function useDiscountCodes() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const codes = await discountCodeService.getAllDiscountCodes();
      setDiscountCodes(codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discount codes');
    } finally {
      setLoading(false);
    }
  };

  const createDiscountCode = async (data: CreateDiscountCodeDto) => {
    try {
      setLoading(true);
      setError(null);
      const newCode = await discountCodeService.createDiscountCode(data);
      setDiscountCodes(prev => [newCode, ...prev]);
      return newCode;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discount code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDiscountCode = async (id: number, data: Partial<CreateDiscountCodeDto>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCode = await discountCodeService.updateDiscountCode(id, data);
      setDiscountCodes(prev => prev.map(code => code.id === id ? updatedCode : code));
      return updatedCode;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update discount code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscountCode = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await discountCodeService.deleteDiscountCode(id);
      setDiscountCodes(prev => prev.filter(code => code.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete discount code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async (code: string) => {
    try {
      setError(null);
      return await discountCodeService.validateDiscountCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate discount code');
      throw err;
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  return {
    discountCodes,
    loading,
    error,
    fetchDiscountCodes,
    createDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    validateCode,
  };
}
```

### React Component Example

```typescript
import React, { useState } from 'react';
import { useDiscountCodes } from './useDiscountCodes';

export function DiscountCodeManager() {
  const {
    discountCodes,
    loading,
    error,
    createDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    validateCode,
  } = useDiscountCodes();

  const [validationCode, setValidationCode] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidateCode = async () => {
    try {
      const result = await validateCode(validationCode);
      setValidationResult(result);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const handleCreateCode = async (formData: CreateDiscountCodeDto) => {
    try {
      await createDiscountCode(formData);
      alert('Discount code created successfully!');
    } catch (err) {
      alert('Failed to create discount code');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="discount-code-manager">
      <h2>Discount Code Management</h2>
      
      {/* Validation Section */}
      <div className="validation-section">
        <h3>Validate Discount Code</h3>
        <input
          type="text"
          value={validationCode}
          onChange={(e) => setValidationCode(e.target.value)}
          placeholder="Enter discount code"
        />
        <button onClick={handleValidateCode}>Validate</button>
        
        {validationResult && (
          <div className={`validation-result ${validationResult.valid ? 'valid' : 'invalid'}`}>
            <p>{validationResult.message}</p>
            {validationResult.valid && validationResult.discountCode && (
              <div>
                <p>Code: {validationResult.discountCode.code}</p>
                <p>Name: {validationResult.discountCode.name}</p>
                <p>Discount: {validationResult.discountCode.percent}% or ${validationResult.discountCode.amount}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Discount Codes List */}
      <div className="discount-codes-list">
        <h3>All Discount Codes</h3>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Discount</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discountCodes.map((code) => (
              <tr key={code.id}>
                <td>{code.code}</td>
                <td>{code.name}</td>
                <td>
                  {code.percent ? `${code.percent}%` : `$${code.amount}`}
                </td>
                <td>
                  {code.used_count}/{code.usage_limit || '∞'}
                </td>
                <td>
                  <span className={code.active ? 'active' : 'inactive'}>
                    {code.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button onClick={() => updateDiscountCode(code.id, { active: !code.active })}>
                    {code.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deleteDiscountCode(code.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": ["code should not be empty", "name should not be empty"],
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Discount code not found",
  "error": "Not Found"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "Discount code already exists",
  "error": "Conflict"
}
```

### Validation Error Handling

```typescript
const handleApiError = (error: any) => {
  if (error.status === 400 && error.message) {
    // Handle validation errors
    const validationErrors = Array.isArray(error.message) ? error.message : [error.message];
    return `Validation failed: ${validationErrors.join(', ')}`;
  }
  
  if (error.status === 403) {
    return 'You do not have permission to perform this action';
  }
  
  if (error.status === 404) {
    return 'Discount code not found';
  }
  
  if (error.status === 409) {
    return 'Discount code already exists';
  }
  
  return 'An unexpected error occurred';
};
```

## Best Practices

### 1. Code Generation
- Use unique, easy-to-type codes
- Consider prefixes for different campaigns (e.g., STUDENT2024, EARLY2024)
- Avoid confusing characters (0, O, 1, l)

### 2. Validation Logic
- Always validate codes on the frontend before applying
- Handle expired codes gracefully
- Show clear error messages to users

### 3. Usage Tracking
- Increment usage count immediately when code is applied
- Consider implementing usage rollback for failed transactions

### 4. Security
- Implement rate limiting for validation requests
- Log discount code usage for audit trails
- Consider implementing code deactivation for suspicious activity

### 5. User Experience
- Provide real-time validation feedback
- Show discount amount clearly before applying
- Allow easy code input (auto-uppercase, trim whitespace)

### 6. Performance
- Cache frequently used discount codes
- Implement debounced validation for real-time checking
- Use optimistic updates for better UX

### 7. Business Logic
- Implement minimum order amount for percentage discounts
- Consider maximum discount amounts
- Handle expired codes gracefully
- Implement usage limits properly

This documentation provides a complete reference for integrating discount code functionality into your frontend application. For additional support or questions, please refer to the API's Swagger documentation at `http://localhost:3001/api`.