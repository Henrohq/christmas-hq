# Mobile Message Sending - Debug Guide

## Issue
Messages getting stuck in "Sending..." state on mobile devices but working fine on desktop.

## Root Cause
Mobile browsers (Safari iOS, Chrome Android) handle network requests differently than desktop:
- Slower mobile network connections
- Stricter timeout policies
- Background tab throttling
- Service worker interference

## Fix Applied

### 1. Timeout Mechanism
Added a `withTimeout()` wrapper that will fail the request after:
- **10 seconds** for the main message insert
- **5 seconds** for missions update (non-blocking)
- **15 seconds** safety timeout that always resets the UI

### 2. Duplicate Submission Prevention
Added `isSubmittingRef` to prevent double-clicks causing multiple submissions.

### 3. Enhanced Error Display
- Shows timeout errors clearly
- Provides a "Close and check" button if timeout occurs
- Explains to user that message might have been sent

### 4. Better Logging
Console logs now include:
- Device detection (mobile vs desktop)
- Timestamp for each step
- Timeout indicators

## How to Debug on Mobile

### iOS Safari
1. On Mac: Safari → Develop → [Your iPhone] → [Your Page]
2. Look for console logs starting with `[ComposeModal]`
3. Watch for timeout messages

### Android Chrome
1. On Desktop Chrome: `chrome://inspect`
2. Find your device and click "Inspect"
3. Look for console logs starting with `[ComposeModal]`
4. Watch for timeout messages

## Expected Console Output

### Successful Send
```
[ComposeModal] Starting message send... {recipientId: "...", userId: "...", isMobile: true}
[ComposeModal] Supabase configured, inserting message with 10s timeout...
[ComposeModal] Insert result: {data: {...}, error: null}
[ComposeModal] Message inserted successfully, adding to store
[ComposeModal] Updating missions progress...
[ComposeModal] Missions updated: 3
[ComposeModal] Message sent successfully, closing modal
```

### Timeout (mobile network slow)
```
[ComposeModal] Starting message send... {recipientId: "...", userId: "...", isMobile: true}
[ComposeModal] Supabase configured, inserting message with 10s timeout...
[ComposeModal] Error in handleSubmit: Error: Request timeout - please check your connection and try again
[ComposeModal] Error message: Request timeout - please check your connection and try again
```

### Safety Timeout (15s)
```
[ComposeModal] Starting message send...
[ComposeModal] Supabase configured, inserting message with 10s timeout...
(... no response for 15 seconds ...)
[ComposeModal] Safety timeout triggered after 15s
```

## Testing Checklist

### On Mobile Device
- [ ] Open Chrome DevTools (see above)
- [ ] Navigate to a user's tree
- [ ] Click "Leave a Message"
- [ ] Fill out the form
- [ ] Click "Send Holiday Wishes"
- [ ] Watch console logs in real-time
- [ ] Verify modal closes after send
- [ ] Refresh page and check if message appears

### Network Conditions to Test
1. **Good WiFi** - should work instantly (< 2s)
2. **4G/LTE** - should work within 3-5s
3. **3G/Slow** - may timeout after 10s, but message might still send
4. **Airplane Mode** - should timeout immediately

## If Timeouts Still Occur

### Check these:
1. **Supabase Project Status**
   - Is your Supabase project paused?
   - Check dashboard.supabase.com

2. **RLS Policies**
   - Do messages have proper INSERT policies?
   - Run this SQL to check:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'messages';
   ```

3. **Mobile Network**
   - Try on WiFi vs cellular
   - Check if firewall/VPN is blocking

4. **Browser Cache**
   - Clear site data in mobile browser
   - Hard refresh the page

## Manual Database Check

If timeout occurs but you want to verify message was sent:

1. Open Supabase dashboard
2. Go to Table Editor → messages
3. Sort by `created_at` descending
4. Look for recent messages from your user

## Adjusting Timeouts

If 10 seconds is too short for your mobile network:

In `ComposeModal.tsx`, line 76:
```typescript
const { data: insertedMessage, error: insertError } = await withTimeout(insertPromise, 10000)
//                                                                                      ^^^^^ 
//                                                                                      Change to 15000 or 20000
```

## Alternative: Optimistic UI

If timeouts persist, consider implementing optimistic updates:
1. Show message immediately in UI
2. Send to server in background
3. Mark as "pending" until confirmed
4. Retry automatically on failure

This would require changes to:
- `useStore.ts` - add message status field
- `UserTreeScene.tsx` - show pending messages with indicator
- `ComposeModal.tsx` - implement retry logic

---

**Last Updated:** December 16, 2025  
**Version:** 2.0.2

