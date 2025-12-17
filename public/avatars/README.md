# User Avatars

Place user avatar images in this folder.

## File Naming

Images should be named to match the email mapping in `src/lib/userAvatars.ts`.

For example, if the mapping is:
```typescript
'alice.johnson@company.com': 'alice.johnson.jpg'
```

Then place the image file as:
```
public/avatars/alice.johnson.jpg
```

## Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

## Image Recommendations

- **Size**: 200x200 pixels minimum (square ratio)
- **Format**: JPEG for photos, PNG for graphics with transparency
- **File Size**: Keep under 100KB for best performance

## Default Behavior

If no avatar image is found for a user, the system will display:
- A colored circle with the user's initials
- Color is automatically generated based on the user's email (consistent across sessions)

## Adding Avatars

1. Get the user's email address
2. Add an entry to `src/lib/userAvatars.ts`:
   ```typescript
   'user.email@company.com': 'user.email.jpg',
   ```
3. Place the image file in this folder with the matching filename

