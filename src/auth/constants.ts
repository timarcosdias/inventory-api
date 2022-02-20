export const jwtConstants = {
  secret: process.env.SECRET,
  tokenExpiration: '60m',
  refreshTokenExpiration: 60 * 60 * 24 * 30,
};
