# Payment Methods Status System - Frontend Implementation

## Overview

The frontend has been updated to support the new payment method status system with soft delete functionality. This document explains the changes made and how to use the new features.

## Changes Summary

### 1. New Type Definitions

**Location:** `src/features/subscriptions/types/index.ts`

Added new `PaymentMethodStatus` type:

```typescript
export type PaymentMethodStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'FAILED' | 'REPLACED';
```

Updated `PaymentMethodResponse` interface:

```typescript
export interface PaymentMethodResponse {
  // ... existing fields ...
  /** @deprecated Use status field instead. Kept for backward compatibility. */
  isActive: boolean;
  status: PaymentMethodStatus;        // NEW
  deletedAt: string | null;           // NEW
  // ... rest of fields ...
}
```

### 2. New Utility Functions

**Location:** `src/lib/utils/payment-methods.ts`

Added three new utility functions for handling payment method statuses:

#### `isPaymentMethodUsable(status: PaymentMethodStatus): boolean`

Checks if a payment method can be used for transactions.

```typescript
isPaymentMethodUsable('ACTIVE')   // true
isPaymentMethodUsable('INACTIVE') // false
isPaymentMethodUsable('EXPIRED')  // false
```

#### `getStatusLabel(status: PaymentMethodStatus): string`

Returns human-readable label for display.

```typescript
getStatusLabel('ACTIVE')    // 'Active'
getStatusLabel('INACTIVE')  // 'Inactive'
getStatusLabel('EXPIRED')   // 'Expired'
getStatusLabel('FAILED')    // 'Failed'
getStatusLabel('REPLACED')  // 'Replaced'
```

#### `getStatusBadgeVariant(status: PaymentMethodStatus): BadgeVariant`

Returns appropriate badge color variant.

```typescript
getStatusBadgeVariant('ACTIVE')    // 'success' (green)
getStatusBadgeVariant('INACTIVE')  // 'secondary' (gray)
getStatusBadgeVariant('EXPIRED')   // 'warning' (yellow)
getStatusBadgeVariant('FAILED')    // 'destructive' (red)
getStatusBadgeVariant('REPLACED')  // 'secondary' (gray)
```

### 3. Updated Components

#### `PaymentMethodCard`

**Location:** `src/features/subscriptions/components/payment-method-card.tsx`

Changes:
- Now displays status badge with appropriate color
- Card appears semi-transparent (60% opacity) when not usable
- Action buttons (Set Default, Remove) only shown for ACTIVE cards
- Shows both status badge AND card expiration warning if both apply

Visual indicators:
- **ACTIVE**: Green badge, full opacity, actions enabled
- **INACTIVE**: Gray badge, 60% opacity, actions hidden
- **EXPIRED**: Yellow badge, 60% opacity, actions hidden
- **FAILED**: Red badge, 60% opacity, actions hidden
- **REPLACED**: Gray badge, 60% opacity, actions hidden

#### `PaymentMethodsSection`

**Location:** `src/features/subscriptions/components/payment-methods-section.tsx`

Changes:
- Filters payment methods to show only ACTIVE status by default
- Inactive cards are automatically hidden from the list
- Empty state shows when no active cards exist

#### `DeletePaymentMethodDialog`

**Location:** `src/features/subscriptions/components/delete-payment-method-dialog.tsx`

Changes:
- Updated title: "Delete payment method?" → "Remove payment method?"
- Updated description to clarify soft delete behavior
- Updated button text: "Delete" → "Remove"
- Explains that card will be deactivated but can be re-added later

### 4. Updated Hooks

#### `useDeletePaymentMethod`

**Location:** `src/features/subscriptions/hooks/use-payment-methods.ts`

Changes:
- Updated JSDoc to explain soft delete behavior
- Success toast: "Payment method deleted" → "Payment method removed"
- Description: "removed successfully" → "deactivated successfully"
- Error toast: "Error deleting" → "Error removing"

### 5. Updated Tests

**Location:** `src/lib/utils/payment-methods.test.ts`

Added comprehensive tests for new utility functions:
- `isPaymentMethodUsable()` - 5 test cases
- `getStatusLabel()` - 6 test cases
- `getStatusBadgeVariant()` - 6 test cases
- Integration tests for status handling

## Status Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    ACTIVE                           │
│  - Shown in payment methods list                   │
│  - Can be used for transactions                    │
│  - Can be set as default                           │
│  - Can be removed (soft delete)                    │
└──────────────┬──────────────────────────────────────┘
               │
               │ User clicks "Remove"
               │ Backend sets status = INACTIVE
               │ Backend sets deletedAt = NOW
               ▼
┌─────────────────────────────────────────────────────┐
│                  INACTIVE                           │
│  - Hidden from payment methods list                │
│  - Cannot be used for transactions                 │
│  - Cannot be set as default                        │
│  - Semi-transparent if shown                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   EXPIRED                           │
│  - Backend sets when card expiration date passes   │
│  - Hidden from payment methods list                │
│  - Cannot be used for transactions                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   FAILED                            │
│  - Backend sets when payment processing fails      │
│  - Hidden from payment methods list                │
│  - Cannot be used for transactions                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  REPLACED                           │
│  - Backend sets when user adds updated card        │
│  - Hidden from payment methods list                │
│  - Cannot be used for transactions                 │
└─────────────────────────────────────────────────────┘
```

## User Experience

### From User Perspective

1. **Normal Usage (ACTIVE cards)**
   - User sees only active cards in their payment methods list
   - Cards display with green "Active" badge
   - Full functionality available (set default, remove)

2. **Removing a Card**
   - User clicks "Remove" button on a card
   - Confirmation dialog appears:
     - Title: "Remove payment method?"
     - Message: "This card will be deactivated and will no longer be available for transactions. You can add it again later if needed."
   - After confirmation:
     - Card immediately disappears from list
     - Toast notification: "Payment method removed - Your payment method has been deactivated successfully."

3. **No Active Cards**
   - Empty state displays: "No payment methods added yet"
   - "Add Your First Card" button shown

### Edge Cases Handled

1. **Card Expires While Active**
   - Card shows both status badges:
     - "Active" (green)
     - "Card Expired" (yellow)
   - Backend should set status to EXPIRED via scheduled job

2. **Default Card Removed**
   - Backend prevents deletion of default card (validation)
   - User must set another card as default first

3. **Last Card Removed**
   - User can remove their last card
   - Empty state appears
   - User must add new card for future transactions

## API Contract

### Response DTO (from backend)

```json
{
  "id": 1,
  "userId": 123,
  "methodType": "CREDIT_CARD",
  "cardBrand": "visa",
  "cardLastFour": "4242",
  "cardExpMonth": 12,
  "cardExpYear": 2025,
  "billingEmail": "user@example.com",
  "isDefault": true,
  "isActive": true,           // DEPRECATED - use status
  "status": "ACTIVE",         // NEW
  "deletedAt": null,          // NEW - ISO 8601 timestamp or null
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Possible Status Values

| Status | Meaning | Frontend Behavior |
|--------|---------|-------------------|
| `ACTIVE` | Card is active and usable | Shown in list, all actions enabled |
| `INACTIVE` | Card was removed by user | Hidden from list |
| `EXPIRED` | Card expiration date passed | Hidden from list |
| `FAILED` | Payment processing failed | Hidden from list |
| `REPLACED` | Card was replaced with updated version | Hidden from list |

## Migration Notes

### Backward Compatibility

The `isActive` field is maintained for backward compatibility but marked as `@deprecated`.

Existing code using `isActive` will continue to work:

```typescript
// Old code (still works)
if (paymentMethod.isActive) {
  // ...
}

// New code (recommended)
if (isPaymentMethodUsable(paymentMethod.status)) {
  // ...
}
```

### Required Backend Updates

For this frontend update to work correctly, the backend must:

1. Return `status` and `deletedAt` fields in `PaymentMethodResponse`
2. Implement soft delete logic (set status to INACTIVE instead of DELETE)
3. Filter out non-ACTIVE cards in GET endpoints (optional, frontend also filters)
4. Update card status to EXPIRED via scheduled job when expiration date passes

## Testing

### Unit Tests

Run payment methods utility tests:

```bash
npm test -- payment-methods.test.ts
```

Expected output: All tests pass, 100% coverage for new utility functions.

### Manual Testing Checklist

- [ ] View payment methods page - only active cards shown
- [ ] Add new card - appears in list with "Active" badge
- [ ] Remove card - confirmation dialog appears
- [ ] Confirm removal - card disappears, success toast shown
- [ ] Remove last card - empty state appears
- [ ] Card with expired date - shows "Card Expired" badge if status is still ACTIVE
- [ ] Set default on active card - works correctly
- [ ] Try to set default on inactive card - button not visible

### E2E Tests (TODO)

E2E tests for this feature should be added to:
`tests/e2e/payment-methods-status.spec.ts`

Test scenarios:
1. User can view active payment methods
2. User can remove a payment method
3. Removed card disappears from list
4. Inactive cards are not shown
5. Status badges display correctly

## Future Enhancements (Optional)

1. **Payment History View**
   - Show all cards (including inactive) in a separate "History" tab
   - Allow viewing past transactions per card

2. **Reactivate Card**
   - Add "Reactivate" button for INACTIVE cards in history view
   - Backend endpoint: `PUT /api/payment-methods/{id}/reactivate`

3. **Status Change Notifications**
   - Email user when card status changes to EXPIRED
   - Show in-app notification for FAILED status

4. **Batch Operations**
   - Allow removing multiple cards at once
   - Archive/unarchive functionality

## Support

For questions or issues:
- Check backend API documentation: http://localhost:8080/swagger-ui.html
- Review main project docs: `/CLAUDE.md`
- Review architecture docs: `/GydiFront/ARCHITECTURE.md`

---

**Last Updated:** 2026-01-15
**Version:** 1.0
**Author:** Frontend AI (Claude Code)
