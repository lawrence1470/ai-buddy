# Clerk Authentication Setup

This guide will help you set up Clerk authentication for the AI Buddy app with phone number + OTP authentication.

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application
3. Choose "React Native" as your platform

## 2. Configure Phone Authentication

1. In your Clerk dashboard, go to **User & Authentication** → **Email, Phone, Username**
2. **Disable** Email authentication (we only want phone)
3. **Enable** Phone number authentication
4. Set Phone number as **Required**
5. Enable **SMS verification code** strategy

## 3. Get Your Publishable Key

1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

## 4. Add Environment Variable

Create a `.env` file in your project root and add:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
```

Replace `your_publishable_key_here` with your actual publishable key from step 3.

## 5. Test the Authentication

1. Start your Expo development server: `npm start`
2. Open the app on your device or simulator
3. Tap "Sign In" on the home screen
4. Enter a valid phone number (use your real phone number for testing)
5. You should receive an SMS with a 6-digit code
6. Enter the code to complete sign in

## Features

- **Phone + OTP Authentication**: Users sign in with their phone number and receive an SMS code
- **Automatic Account Creation**: No separate signup flow - accounts are created automatically on first sign in
- **Session Management**: Clerk handles session persistence across app restarts
- **Sign Out**: Users can sign out from the home screen

## Troubleshooting

### "Missing Publishable Key" Error

- Make sure your `.env` file is in the project root
- Restart your Expo development server after adding the environment variable
- Verify the key starts with `pk_test_` or `pk_live_`

### SMS Not Received

- Check that phone authentication is enabled in your Clerk dashboard
- Verify you're using a valid phone number format (e.g., +1234567890)
- Check your phone's spam/blocked messages folder
- For testing, Clerk provides test phone numbers in development mode

### "Phone authentication is not enabled" Error

- Go to your Clerk dashboard → User & Authentication → Email, Phone, Username
- Make sure Phone number authentication is enabled
- Save the settings and try again

## Development vs Production

- **Development**: Clerk provides test phone numbers and doesn't send real SMS
- **Production**: Real SMS messages are sent to users' phones
- Make sure to test thoroughly before deploying to production

## Next Steps

Once authentication is working, you can:

- Customize the phone auth modal styling
- Add user profile management
- Implement protected routes
- Add additional authentication methods if needed
