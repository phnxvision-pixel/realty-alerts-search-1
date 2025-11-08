# Admin Control Panels Documentation

This app has three separate control panels for different user roles:

## 1. Super Admin Panel (`app/(tabs)/admin.tsx`)

**Access**: Platform administrators only

**Features**:
- **Overview Tab**: System-wide statistics
  - Total users count
  - Total landlords count
  - Total listings count
  - Pending landlords awaiting approval
  - Pending listings awaiting verification

- **Landlords Tab**: Manage landlord accounts
  - View all landlord registrations
  - Approve landlord accounts
  - Reject landlord applications
  - View landlord details (company name, email, status)

- **Listings Tab**: Moderate property listings
  - View all property listings
  - Approve new listings
  - Delete inappropriate listings
  - Monitor listing quality

**Database Tables Used**:
- `admin_users` - Admin user roles and permissions
- `moderation_logs` - Track all admin actions
- `system_analytics` - Daily system statistics

**Edge Functions**:
- `admin-manage-users` - Handle admin operations

## 2. Landlord Control Panel (`app/landlord/dashboard.tsx`)

**Access**: Verified landlords only

**Features**:
- **Analytics Dashboard**: Key performance metrics
  - Total views on listings
  - Total applications received
  - Conversion rate (applications/views)
  - Average response time
  - Active listings count
  - Total revenue estimate

- **Quick Actions**:
  - Post new listing
  - View applications

- **Recent Listings**: Last 3 posted properties
  - Title, price, rooms
  - Verification status

- **Recent Applications**: Last 5 applications
  - Applicant name
  - Property applied for
  - Application status

**Navigation**:
- `/landlord/dashboard` - Main dashboard
- `/landlord/post-listing` - Create new listing
- `/landlord/applications` - View all applications
- `/landlord/subscription` - Upgrade plan

## 3. Tenant Control Panel (`app/(tabs)/tenant-dashboard.tsx`)

**Access**: All registered users/tenants

**Features**:
- **Statistics Overview**:
  - Total applications submitted
  - Saved favorites count
  - Saved searches count
  - Active message conversations

- **Quick Actions**:
  - View my applications
  - Browse favorites
  - Check messages
  - Edit profile

- **Premium Upgrade Prompt**: For non-premium users
  - Highlights premium benefits
  - Direct link to subscription page

**Navigation**:
- `/applications/my-applications` - View application status
- `/(tabs)/favorites` - Saved properties
- `/messages` - Chat with landlords
- `/profile` - Update personal information
- `/(tabs)/subscription` - Upgrade to premium

## Access Control

**Super Admin Access**:
- Requires entry in `admin_users` table
- Role-based permissions (super_admin, admin, moderator)
- All actions logged in `moderation_logs`

**Landlord Access**:
- Requires landlord registration
- Must be verified by admin
- Context: `LandlordContext` manages state

**Tenant Access**:
- Any authenticated user
- Context: `AuthContext` manages state

## Security

All panels use Row Level Security (RLS) policies:
- Admins can only access admin tables if verified
- Landlords can only view/edit their own listings
- Tenants can only view/edit their own data

## Future Enhancements

Potential additions:
- Financial reports for landlords
- Bulk actions for admins
- Advanced analytics with charts
- Export functionality
- Email notifications for status changes
- Activity logs for all users
