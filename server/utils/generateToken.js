import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // We can also set the token in an HTTP-Only cookie for better security
  // but for a simple API, returning it in the body is fine to start.
  return token;
};

export default generateToken;