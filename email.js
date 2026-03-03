import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { email: userEmail }, 
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

const magicLink = `https://yolopadel.com/api/verify?token=${token}`;