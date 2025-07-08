# 🔧 Authentication Troubleshooting Guide

## Issue: No SMS Code Received During Signup

### ✅ Quick Checks

1. **Check Console Logs**: Open React Native debugger and look for authentication logs
2. **Phone Number Format**: Try these formats:
   - `+1234567890` (recommended)
   - `1234567890` 
   - `(123) 456-7890`

### 🔍 Clerk Dashboard Settings

**Go to your Clerk Dashboard:**

1. **Navigate to**: User & Authentication → Email, Phone, Username
2. **Verify these settings**:
   ```
   ✅ Phone number: ENABLED & REQUIRED
   ✅ SMS verification code: ENABLED
   ❌ Email: DISABLED (for phone-only auth)
   ❌ Password: DISABLED (for passwordless auth)
   ```

3. **Phone Number Configuration**:
   - Click on "Phone number" settings
   - Ensure "SMS verification code" is the primary strategy
   - Check that "Required for sign-up" is enabled

### 📱 Development vs Production

**Development Mode:**
- Clerk may use test phone numbers
- Check if you're using a real phone number
- Look for test phone numbers in Clerk docs

**Production Mode:**
- Real SMS messages are sent
- May have rate limiting
- Check SMS delivery logs in Clerk dashboard

### 🚨 Common Issues & Solutions

#### 1. "Phone authentication is not enabled"
```bash
Solution: Enable phone auth in Clerk dashboard
Location: User & Authentication → Email, Phone, Username
```

#### 2. "Couldn't find your account" 
```bash
This is normal for new users - the app should auto-create accounts
Check: The signup flow should trigger automatically
```

#### 3. SMS Delivery Issues
```bash
- Try a different phone number
- Check spam/blocked messages
- Verify phone number format
- Wait 1-2 minutes for delivery
```

#### 4. Rate Limiting
```bash
- Wait 5-10 minutes between attempts
- Try different phone number
- Check Clerk dashboard for limits
```

### 🔧 Debug Mode

The app now includes comprehensive debug logging. When you try to sign up:

1. **Open React Native Debugger**
2. **Look for these log messages**:
   ```
   🔍 DEBUG: Phone Authentication Start
   📞 Attempting sign in with: +1234567890
   ✅ Sign in attempt created
   📲 Preparing phone code strategy...
   🎉 SMS should be sent! Moving to verification step
   ```

3. **If you see errors**, check the detailed error logs for specific issues

### 📞 Test Phone Numbers

For development, Clerk provides test phone numbers:
- `+15005550006` - Always succeeds
- `+15005550007` - Always fails
- Check Clerk documentation for updated test numbers

### 🆘 Still Not Working?

1. **Check Environment Variables**:
   ```bash
   # In your .env file
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Restart Development Server**:
   ```bash
   npm start
   # Then reload your app
   ```

3. **Verify API Key**:
   - Ensure the key starts with `pk_test_` or `pk_live_`
   - Copy fresh key from Clerk dashboard

4. **Contact Support**:
   - Check Clerk community forums
   - Submit ticket to Clerk support
   - Include console logs and error messages

### 📋 Debugging Checklist

- [ ] Phone authentication enabled in Clerk dashboard
- [ ] Correct phone number format (+1234567890)
- [ ] Environment variable set correctly
- [ ] Development server restarted
- [ ] Console logs checked for errors
- [ ] Different phone number tested
- [ ] Spam folder checked
- [ ] Wait time between attempts (1-2 minutes)

### 🎯 Next Steps

Once SMS is working:
1. Test the complete auth flow
2. Verify user profile creation
3. Test sign out and sign back in
4. Test on different devices