/**
 * Mock Data for Testing
 * 
 * This file contains mock user data for testing the app with ~30 users.
 * 
 * TO REMOVE: Simply delete this file and remove the import/usage in App.tsx
 */

import type { Profile, Message, DecorationType } from '@/types/database'

// 30 Mock Users
export const MOCK_USERS: Profile[] = [
  { id: 'u1', email: 'alice.johnson@company.com', full_name: 'Alice Johnson', display_name: 'Alice', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u2', email: 'bob.smith@company.com', full_name: 'Bob Smith', display_name: 'Bob', avatar_url: null, tree_color: '#228b22', star_color: '#ffeb3b', sky_color: '#0a1628', created_at: '', updated_at: '' },
  { id: 'u3', email: 'carol.williams@company.com', full_name: 'Carol Williams', display_name: 'Carol', avatar_url: null, tree_color: '#01796f', star_color: '#ffffff', sky_color: '#1a0a2e', created_at: '', updated_at: '' },
  { id: 'u4', email: 'david.brown@company.com', full_name: 'David Brown', display_name: 'David', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u5', email: 'emma.davis@company.com', full_name: 'Emma Davis', display_name: 'Emma', avatar_url: null, tree_color: '#2e5a5a', star_color: '#ff6b9d', sky_color: '#0d2818', created_at: '', updated_at: '' },
  { id: 'u6', email: 'frank.miller@company.com', full_name: 'Frank Miller', display_name: 'Frank', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u7', email: 'grace.wilson@company.com', full_name: 'Grace Wilson', display_name: 'Grace', avatar_url: null, tree_color: '#4a7c8c', star_color: '#87ceeb', sky_color: '#0a1a2a', created_at: '', updated_at: '' },
  { id: 'u8', email: 'henry.taylor@company.com', full_name: 'Henry Taylor', display_name: 'Henry', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u9', email: 'ivy.anderson@company.com', full_name: 'Ivy Anderson', display_name: 'Ivy', avatar_url: null, tree_color: '#228b22', star_color: '#e31c3d', sky_color: '#1a0f1a', created_at: '', updated_at: '' },
  { id: 'u10', email: 'jack.thomas@company.com', full_name: 'Jack Thomas', display_name: 'Jack', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u11', email: 'kate.jackson@company.com', full_name: 'Kate Jackson', display_name: 'Kate', avatar_url: null, tree_color: '#b76e79', star_color: '#ff6b9d', sky_color: '#0f0f1a', created_at: '', updated_at: '' },
  { id: 'u12', email: 'liam.white@company.com', full_name: 'Liam White', display_name: 'Liam', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u13', email: 'mia.harris@company.com', full_name: 'Mia Harris', display_name: 'Mia', avatar_url: null, tree_color: '#e8e8e8', star_color: '#c0c0c0', sky_color: '#0a1f1f', created_at: '', updated_at: '' },
  { id: 'u14', email: 'noah.martin@company.com', full_name: 'Noah Martin', display_name: 'Noah', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u15', email: 'olivia.garcia@company.com', full_name: 'Olivia Garcia', display_name: 'Olivia', avatar_url: null, tree_color: '#01796f', star_color: '#9966cc', sky_color: '#1a0a2e', created_at: '', updated_at: '' },
  { id: 'u16', email: 'peter.martinez@company.com', full_name: 'Peter Martinez', display_name: 'Peter', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u17', email: 'quinn.robinson@company.com', full_name: 'Quinn Robinson', display_name: 'Quinn', avatar_url: null, tree_color: '#228b22', star_color: '#ffeb3b', sky_color: '#0a1628', created_at: '', updated_at: '' },
  { id: 'u18', email: 'rachel.clark@company.com', full_name: 'Rachel Clark', display_name: 'Rachel', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u19', email: 'sam.rodriguez@company.com', full_name: 'Sam Rodriguez', display_name: 'Sam', avatar_url: null, tree_color: '#2e5a5a', star_color: '#87ceeb', sky_color: '#0a1a2a', created_at: '', updated_at: '' },
  { id: 'u20', email: 'tina.lewis@company.com', full_name: 'Tina Lewis', display_name: 'Tina', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u21', email: 'uma.lee@company.com', full_name: 'Uma Lee', display_name: 'Uma', avatar_url: null, tree_color: '#4a7c8c', star_color: '#ffffff', sky_color: '#0d2818', created_at: '', updated_at: '' },
  { id: 'u22', email: 'victor.walker@company.com', full_name: 'Victor Walker', display_name: 'Victor', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u23', email: 'wendy.hall@company.com', full_name: 'Wendy Hall', display_name: 'Wendy', avatar_url: null, tree_color: '#a0a0a0', star_color: '#c0c0c0', sky_color: '#1a0f1a', created_at: '', updated_at: '' },
  { id: 'u24', email: 'xavier.allen@company.com', full_name: 'Xavier Allen', display_name: 'Xavier', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u25', email: 'yara.young@company.com', full_name: 'Yara Young', display_name: 'Yara', avatar_url: null, tree_color: '#b76e79', star_color: '#ff6b9d', sky_color: '#0f0f1a', created_at: '', updated_at: '' },
  { id: 'u26', email: 'zack.king@company.com', full_name: 'Zack King', display_name: 'Zack', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u27', email: 'anna.wright@company.com', full_name: 'Anna Wright', display_name: 'Anna', avatar_url: null, tree_color: '#228b22', star_color: '#e31c3d', sky_color: '#1a0a2e', created_at: '', updated_at: '' },
  { id: 'u28', email: 'ben.scott@company.com', full_name: 'Ben Scott', display_name: 'Ben', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
  { id: 'u29', email: 'chloe.green@company.com', full_name: 'Chloe Green', display_name: 'Chloe', avatar_url: null, tree_color: '#01796f', star_color: '#9966cc', sky_color: '#0a1f1f', created_at: '', updated_at: '' },
  { id: 'u30', email: 'dan.adams@company.com', full_name: 'Dan Adams', display_name: 'Dan', avatar_url: null, tree_color: '#0d5c0d', star_color: '#ffd700', sky_color: '#090A0F', created_at: '', updated_at: '' },
]

// Generate mock messages for a user
export function generateMockMessages(recipientId: string, count: number = 8): Message[] {
  const types: DecorationType[] = ['card', 'gift', 'ornament']
  const colors = ['#c41e3a', '#228b22', '#1e90ff', '#9932cc', '#daa520', '#ff69b4', '#20b2aa', '#ff8c00']
  const wishes = [
    'Wishing you a magical holiday season! ✨',
    'May your days be merry and bright! 🎄',
    'Happy Holidays from our team!',
    'Warmest wishes for a wonderful year ahead!',
    'Cheers to a festive and joyful season! 🥂',
    'Sending you love and holiday cheer! 💝',
    'May all your holiday dreams come true!',
    'Have a cozy and peaceful holiday! ☃️',
    'Wishing you joy, peace, and happiness!',
    'Happy Holidays! You\'re amazing! 🌟',
  ]

  const messages: Message[] = []
  const senders = MOCK_USERS.filter(u => u.id !== recipientId)
  
  for (let i = 0; i < count && i < senders.length; i++) {
    messages.push({
      id: `msg-${recipientId}-${i}`,
      recipient_id: recipientId,
      sender_id: senders[i].id,
      content: wishes[i % wishes.length],
      decoration_type: types[i % types.length],
      decoration_style: colors[i % colors.length],
      position_data: null,
      position_index: i,
      is_private: i === 2, // Make one message private for testing
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
    })
  }

  return messages
}

// Demo user for mock login
export const DEMO_USER: Profile = {
  id: 'demo-user',
  email: 'demo@christmas-hq.com',
  full_name: 'Demo User',
  display_name: 'Demo',
  avatar_url: null,
  tree_color: '#0d5c0d',
  star_color: '#ffd700',
  sky_color: '#090A0F',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

