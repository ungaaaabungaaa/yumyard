# Kitchen Authentication Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# Kitchen Authentication
KITCHEN_NAME=your_kitchen_chef_name
KITCHEN_NUMBER=your_kitchen_chef_number
KITCHEN_PIN=your_kitchen_pin
KITCHEN_SECRET=your_kitchen_jwt_secret
```

## API Endpoints

### Kitchen Login
- **POST** `/api/kitchen-auth`
- **Body**: `{ "name": "chef_name", "number": "chef_number", "pin": "chef_pin" }`
- **Response**: Sets `kitchen_token` cookie on success

### Kitchen Logout
- **DELETE** `/api/kitchen-auth`
- **Response**: Clears `kitchen_token` cookie

## Protected Routes

All routes starting with `/kitchen` are now protected by middleware and require:
1. Valid `kitchen_token` cookie
2. Token must have `role: "kitchen"`
3. Token must not be expired

## Usage Example

```javascript
// Login
const response = await fetch('/api/kitchen-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Chef John',
    number: '1234567890',
    pin: '1234'
  })
});

// Logout
await fetch('/api/kitchen-auth', { method: 'DELETE' });
```

## Security Notes

- All tokens are HTTP-only cookies
- Tokens expire after 24 hours
- Invalid/expired tokens are automatically cleared
- Middleware redirects to `/login` for authentication failures
