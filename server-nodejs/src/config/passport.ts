import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@/models/User.js';

export default passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    const newName = profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`;
                    if (user.name !== newName) {
                        user.name = newName;
                        await user.save();
                    }
                    return done(null, user);
                }

                user = await User.findOne({ email: profile.emails?.[0]?.value });

                if (user) {
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
                    email: profile.emails?.[0]?.value || '',
                    phone: '', 
                    password: '', 
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);