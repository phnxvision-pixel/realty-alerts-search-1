# Message Templates Feature

## Overview
The message templates feature allows landlords to create, save, and reuse common message responses with placeholder support for dynamic content.

## Features

### 1. Template Management
- **Create Templates**: Save frequently used messages
- **Edit Templates**: Update existing templates
- **Delete Templates**: Remove unused templates
- **Categorize**: Organize templates by category (General, Viewing, Application, Maintenance, Payment)
- **Favorites**: Mark frequently used templates as favorites
- **Usage Tracking**: Track how many times each template has been used

### 2. Quick Insert in Chat
- **Template Button**: Landlords see a template icon in the chat interface
- **Search & Filter**: Find templates by title, content, or category
- **One-Click Insert**: Select a template to insert into message input
- **Placeholder Replacement**: Automatically replace placeholders with real data

### 3. Placeholder System
Available placeholders:
- `{tenant_name}` - Name of the tenant
- `{property_address}` - Property address/title
- `{viewing_date}` - Current date

## Database Schema

```sql
CREATE TABLE message_templates (
  id UUID PRIMARY KEY,
  landlord_id UUID REFERENCES landlords(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Usage

### For Landlords

#### Creating a Template
1. Navigate to Templates screen (app/landlord/templates.tsx)
2. Click the "+" button
3. Enter template title and content
4. Select a category
5. Use placeholders like {tenant_name} in your content
6. Save the template

#### Using Templates in Chat
1. Open a conversation with a tenant
2. Click the document icon next to the message input
3. Search or browse templates
4. Click a template to insert it
5. Placeholders are automatically replaced with real data
6. Edit if needed and send

### Example Templates

**Viewing Confirmation**
```
Hi {tenant_name}, I'd be happy to schedule a viewing of {property_address}. 
Are you available this week?
```

**Application Received**
```
Hi {tenant_name}, I've received your application for {property_address}. 
I'll review it and get back to you within 48 hours.
```

**Maintenance Follow-up**
```
Hi {tenant_name}, just following up on the maintenance request for {property_address}. 
Has the issue been resolved?
```

## Components

### MessageTemplateManager
Full template management UI with CRUD operations
- Location: `components/MessageTemplateManager.tsx`
- Used in: `app/landlord/templates.tsx`

### TemplateQuickInsert
Modal for quick template insertion in chat
- Location: `components/TemplateQuickInsert.tsx`
- Used in: `app/messages/[id].tsx`

## Benefits

1. **Time Saving**: Respond faster to common inquiries
2. **Consistency**: Maintain professional tone across all communications
3. **Personalization**: Placeholders ensure messages feel personal
4. **Organization**: Categories keep templates organized
5. **Analytics**: Usage tracking shows which templates are most effective

## Future Enhancements

- Team templates (shared across multiple landlords)
- Template variables for more dynamic content
- Template analytics and performance metrics
- AI-powered template suggestions
- Template versioning and history
