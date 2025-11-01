# Tables QR Code System

## How It Works

When users scan a QR code, they navigate to `/tables/[tableNumber]` (e.g., `/tables/1`, `/tables/2`, etc.).

1. **Table Page** (`/app/tables/[tableNumber]/page.tsx`):
   - Extracts the table number from the URL
   - Shows a welcome message with the table number
   - Provides a button to navigate to the menu

2. **Table Layout** (`/app/tables/[tableNumber]/layout.tsx`):
   - Displays "Table {tableNumber}" in the header
   - Table number is extracted directly from the URL using `useParams()`

## Using Table Number in Checkout

When creating an order, you can pass the table number from the URL. The table number is available in the URL path, so you can:
- Extract it from the current route using `useParams()` or `usePathname()`
- Pass it directly to `createOrder` when the user is on the table page

The table number will be stored in the order, allowing you to track which table each order came from.

## Setting Up QR Codes

To generate QR codes for your tables:

1. **Online QR Code Generator:**
   - Visit: https://www.qr-code-generator.com/ or https://qr.io/
   - Enter URL: `https://yourdomain.com/tables/1` (replace with your domain and table number)
   - Generate and download the QR code
   - Print and place on each table

2. **For multiple tables (1-15):**
   - Generate QR codes for each table number (1 through 15)
   - Each QR code should point to: `https://yourdomain.com/tables/{tableNumber}`

3. **Local Development:**
   - Use: `http://localhost:3000/tables/{tableNumber}` for testing

## Testing

To test the table system:
- Navigate to `/tables/1` in your browser
- Check localStorage in DevTools - you should see `tableNumber: "1"`
- The page should redirect to `/user/explore`
- When creating an order, the table number should be included

