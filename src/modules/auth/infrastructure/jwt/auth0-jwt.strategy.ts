// // src/auth/strategies/auth0-jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import * as jwksRsa from 'jwks-rsa';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class Auth0JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
//   constructor(private readonly usersService: UsersService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       // Auth0 JWKS URL
//       secretOrKeyProvider: jwksRsa.passportJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`,
//       }),
//       audience: 'YOUR_API_IDENTIFIER', // your API identifier in Auth0
//       issuer: `https://YOUR_DOMAIN/`,
//       algorithms: ['RS256'],
//     });
//   }

//   async validate(payload: any) {
//     // Only link if email_verified
//     if (!payload.email_verified) {
//       throw new Error('Email not verified');
//     }

//     return this.usersService.findOrCreateSocialUser({
//       email: payload.email,
//       auth0Id: payload.sub,
//       name: payload.name,
//       picture: payload.picture,
//       provider: payload?.iss?.includes('google') ? 'google' : 'auth0',
//     });
//   }
// }