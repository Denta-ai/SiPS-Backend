import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../lib/prisma';
import { BASE_URL, CLIENT_ID, CLIENT_SECRET } from '../env';

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const userGoogleEmail = profile.emails?.[0].value;
      try {
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
        if (!user) {
          user = await prisma.user.findUnique({ where: { email: userGoogleEmail } });
          if (user) {
            user = await prisma.user.update({
              where: { email: userGoogleEmail },
              data: { googleId: profile.id },
            });
          } else {
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                email: userGoogleEmail as string,
                username: profile.displayName,
                phoneNumber: '',
                password: '',
                profilePicture: profile.photos?.[0].value,
              },
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
