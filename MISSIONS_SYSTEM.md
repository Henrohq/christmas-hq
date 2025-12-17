# Missions System Documentation

## Overview
The missions system gamifies the Christmas HQ experience by encouraging users to interact with their colleagues' trees and unlocking customization options.

## Current Mission

### 🎁 Spread Holiday Cheer
**Objective**: Send messages to 3 different colleagues  
**Progress**: 0/3 messages sent  
**Reward**: Unlock all tree customization styles (locked tree colors, star colors, and sky themes including Aurora Borealis)

## How It Works

### 1. **Tracking Progress**
- The system counts unique messages sent by tracking `sender_id` and counting distinct `recipient_id` values
- Real-time updates via Supabase subscriptions
- Progress is displayed as "0/3", "1/3", "2/3", "3/3"

### 2. **Quest Tracker UI**
- Toggle from main menu with 📜 icon
- WoW-style quest tracker panel in upper right
- Shows progress bar and completion status
- Displays unlock notification when mission is completed

### 3. **Locked Customization Options**
After the first 2 options in each category, all other customization options are locked until the mission is complete:

**Tree Colors** (Locked after 2):
- ✅ Classic Green
- ✅ Forest Green
- 🔒 Pine Green
- 🔒 Blue Spruce
- 🔒 Frost Blue
- 🔒 Snow White
- 🔒 Silver
- 🔒 Rose Gold

**Star Colors** (Locked after 2):
- ✅ Classic Gold
- ✅ Bright Yellow
- 🔒 White
- 🔒 Silver
- 🔒 Rose
- 🔒 Ice Blue
- 🔒 Ruby Red
- 🔒 Amethyst

**Sky Colors** (Locked after 2):
- ✅ Midnight
- ✅ Deep Blue
- 🔒 **Aurora Borealis** (Special gradient)
- 🔒 Night Purple
- 🔒 Northern Lights
- 🔒 Arctic Blue
- 🔒 Twilight
- 🔒 Starry Night
- 🔒 Aurora

### 4. **Aurora Borealis Sky**
Special gradient sky theme featuring:
- Deep blues transitioning to teals and forest greens
- Mimics the appearance of Northern Lights
- Gradient: `#001a33 → #003d5c → #005f73 → #2d6a4f`

## Implementation Details

### No Database Changes Required
The missions system uses existing data:
- Counts messages from `messages` table
- Filters by `sender_id` = current user
- Counts distinct `recipient_id` values
- No new tables or columns needed

### Components
- **`MissionsTracker.tsx`**: Main quest tracker UI
- **`TreeCustomizer.tsx`**: Updated with locked states
- **`useStore.ts`**: Added missions state management

### Store State
```typescript
showMissions: boolean          // Toggle tracker visibility
messagesCompleted: number     // Count of messages sent (0-3+)
```

## Future Missions (Planned)
- 🎄 "Tree Decorator": Customize all 3 aspects of your tree
- 🌟 "Social Butterfly": Receive messages from 5 different colleagues
- 🎁 "Gift Giver Elite": Send 10 total messages
- 🔥 "Holiday Spirit": Log in 7 days in a row

## User Experience Flow

1. **New User** → Opens missions tracker → Sees 0/3 progress
2. **Sends first message** → Progress updates to 1/3
3. **Sends to 2 more unique colleagues** → Progress reaches 3/3
4. **Mission Complete!** → Unlock notification appears
5. **Opens Customize menu** → All options now available
6. **Tries Aurora Borealis** → Beautiful gradient sky appears

## Testing the System

### Demo Mode
In demo mode (no Supabase), missions progress is stored in local state and doesn't persist.

### Production Mode
With Supabase connected:
1. Send a message to User A → 1/3
2. Send another message to User A → Still 1/3 (same recipient)
3. Send a message to User B → 2/3
4. Send a message to User C → 3/3 ✅ Mission Complete!

## Customization Tooltip
When hovering over locked options:
```
🔒
Complete missions to unlock!
```

## Completion Notification
Full-screen notification appears for 5 seconds:
```
🎉 Mission Complete!
You've unlocked all tree customization styles!
Visit the customize menu to try them out.
```

