# Credit Check & Background Verification Integration

## Overview
WohnAgent includes a comprehensive verification system for rental applications, allowing landlords to request credit checks, background checks, employment verification, and rental history checks with tenant consent.

## Features

### For Landlords
- **Request Verifications**: Request multiple verification types from applicants
- **View Results**: Access detailed verification reports and risk assessments
- **Automated Workflow**: Streamlined process from request to results
- **Secure Data**: All verification data is encrypted and securely stored

### For Tenants
- **Consent Management**: Review and approve verification requests
- **Verification Badges**: Earn badges for completed verifications
- **Profile Enhancement**: Verified profiles are more attractive to landlords
- **Transparency**: Full visibility into what's being verified

## Verification Types

### 1. Credit Check ($29.99)
- Credit score
- Credit utilization
- Payment history
- Delinquencies
- Credit accounts

### 2. Background Check ($39.99)
- Criminal records
- Eviction history
- Court judgments
- Identity verification

### 3. Employment Verification ($19.99)
- Current employer
- Job title
- Income verification
- Employment duration

### 4. Rental History ($24.99)
- Previous landlord references
- Payment history
- Lease violations
- Eviction records

## Integration with Credit Bureaus

### Supported Providers
The system is designed to integrate with:
- **Experian**: Credit reporting
- **TransUnion**: Credit reporting
- **Equifax**: Credit reporting
- **Checkr**: Background checks
- **Plaid**: Employment/income verification

### Setup Instructions

1. **Obtain API Credentials**
   - Sign up for business accounts with verification providers
   - Obtain API keys and configure webhooks

2. **Configure Environment Variables**
   ```bash
   # Add to Supabase Edge Function secrets
   EXPERIAN_API_KEY=your_key
   TRANSUNION_API_KEY=your_key
   CHECKR_API_KEY=your_key
   PLAID_CLIENT_ID=your_id
   PLAID_SECRET=your_secret
   ```

3. **Update Edge Function**
   - Edit `process-verification` function
   - Replace mock data with actual API calls
   - Implement error handling and retries

### Example Integration (Checkr)
```typescript
// In process-verification edge function
const checkrApiKey = Deno.env.get('CHECKR_API_KEY');

const response = await fetch('https://api.checkr.com/v1/reports', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${checkrApiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    candidate_id: tenantId,
    package: 'driver_pro'
  })
});

const result = await response.json();
```

## Database Schema

### verification_requests
- Request tracking and status
- Consent management
- Cost tracking

### verification_results
- Detailed verification data
- Risk assessments
- Provider information

### tenant_verifications
- Verification badge status
- Verification dates
- Overall verification score

### consent_records
- Legal consent tracking
- IP address logging
- Audit trail

## Workflow

### 1. Landlord Requests Verification
```typescript
await supabase.functions.invoke('request-verification', {
  body: {
    applicationId: 'uuid',
    tenantId: 'uuid',
    verificationType: 'credit_check',
    paidBy: 'landlord'
  }
});
```

### 2. Tenant Receives Notification
- Push notification sent
- Email notification sent
- In-app notification displayed

### 3. Tenant Provides Consent
```typescript
await supabase.functions.invoke('process-verification-consent', {
  body: {
    requestId: 'uuid',
    consentGiven: true,
    tenantId: 'uuid'
  }
});
```

### 4. Verification Processing
- API call to verification provider
- Results stored in database
- Landlord notified of completion
- Tenant badge updated

### 5. Results Available
- Landlord views detailed report
- Tenant receives verification badge
- Results cached for future applications

## Security & Compliance

### Data Protection
- All PII encrypted at rest
- TLS encryption in transit
- Access logging and audit trails
- Automatic data retention policies

### Legal Compliance
- FCRA (Fair Credit Reporting Act) compliant
- GDPR compliant for EU users
- Explicit consent required
- Right to dispute results

### Privacy
- Tenants control their data
- Verification results expire after 30 days
- Option to revoke consent
- Data deletion on request

## UI Components

### VerificationRequestModal
Landlord interface to request verifications from tenants.

### VerificationConsentModal
Tenant interface to review and provide consent.

### VerificationBadge
Display verification status on tenant profiles.

### VerificationResults
Detailed results viewer for landlords.

## Testing

### Test Mode
The system includes mock verification data for testing:
- Credit scores: 650-800
- Background checks: Clean records
- Employment: Verified positions
- Rental history: Positive references

### Production Mode
Replace mock data with actual API calls to verification providers.

## Cost Management

### Payment Options
- Landlord pays (default)
- Tenant pays (optional)
- Split payment (configurable)

### Billing
- Charges processed through Stripe
- Automatic invoicing
- Payment history tracking

## Support

For integration support:
- Email: support@wohnagent.com
- Documentation: https://docs.wohnagent.com/verifications
- API Reference: https://api.wohnagent.com/docs
