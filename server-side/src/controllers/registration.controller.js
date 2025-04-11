const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const transporter = require('../utils/emailTransporter');
const userValidation = require('../utils/userValidation');
const asyncWrapper = require('../middlewares/asyncWrapper.middleware');
const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const { tokenBlacklist } = require('../middlewares/checkBlacklist.middleware');

// Helper: Token Generator
const generateToken = (payload, expiresIn = null) => {
  const options = expiresIn ? { expiresIn } : undefined;
  console.log(`[TOKEN] Generating token for user: ${payload.email}`);
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// POST /signup
const signup = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  console.log('[SIGNUP] Received signup data:', userData.email);

  if (!userValidation(userData)) {
    console.warn('[SIGNUP] Invalid user data');
    return next(new AppError('Invalid user data.', 400, httpStatusText.FAIL));
  }

  const existingUser = await userModel.findOne({ email: userData.email });
  if (existingUser) {
    console.warn('[SIGNUP] Email already exists:', userData.email);
    return next(
      new AppError(
        'User with this email already exists.',
        400,
        httpStatusText.FAIL
      )
    );
  }

  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  await userModel.create(userData);
  console.log('[SIGNUP] User created successfully:', userData.email);

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: 'User signed up successfully',
  });
});

// POST /login
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('[LOGIN] Attempted login with email:', email);

  const user = await userModel.findOne({ email });
  if (!user) {
    console.warn('[LOGIN] Email not found:', email);
    return next(
      new AppError('Invalid email or password.', 400, httpStatusText.FAIL)
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.warn('[LOGIN] Invalid password for:', email);
    return next(
      new AppError('Invalid email or password.', 400, httpStatusText.FAIL)
    );
  }

  const token = generateToken({
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    thumbnail: user.thumbnail,
  });

  console.log('[LOGIN] User logged in:', email);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Logged in successfully',
    data: { token },
  });
});

// GET /auth/google/callback
const google = (req, res) => {
  console.log('[GOOGLE AUTH] Google login callback for:', req.user.email);

const google = (req, res, next) => {
  const token = jwt.sign(
    {
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      _id: req.user._id,
      thumbnail: req.user.thumbnail,
    },
    process.env.JWT_SECRET
  );
  res.redirect(`http://localhost:4200/auth/login?token=${token}`);
};
// const code = req.query.code;
// const { tokens } = await googleAuth.verifyIdToken(code);
// const payload = jwt.decode(tokens.id_token);
// let user;
// let foundedUser = await userModel.findOne({ email: payload.email });
// if (!foundedUser) {
//   user = await userModel.create({
//     email: payload.email,
//     username: payload.name,
//     role: "user",
//   });
// }
// const token = jwt.sign(
//   {
//     email: user.email,
//     username: user.username,
//     _id: user._id,
//     role: user.role,
//   },
//   process.env.JWT_SECRET
// );
// res.status(201).json({
//   status: httpStatusText.SUCCESS,
//   message: "Logged in successfully",
//   data: { token },
// });

// const google = asyncWrapper(async (req, res, next) => {
//   const code = req.query.code;
//   const { tokens } = await googleAuth.verifyIdToken(code);
//   const payload = jwt.decode(tokens.id_token);
//   let user = await userModel.findOne({ email: payload.email });
//   if (!user) {
//     user = await userModel.create({
//       email: payload.email,
//       username: payload.name,
//       role: "user",
//     });
//   }
//   const token = jwt.sign(
//     {
//       email: user.email,
//       username: user.username,
//       _id: user._id,
//       role: user.role,
//     },
//     process.env.JWT_SECRET
//   );
//   res.status(201).json({
//     status: httpStatusText.SUCCESS,
//     message: "Logged in successfully",
//     data: { token },
//   });
const logout = asyncWrapper(async (req, res, next) => {});
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  console.log('[FORGOT PASSWORD] Request for:', email);

  const user = await userModel.findOne({ email });
  if (!user) {
    console.warn('[FORGOT PASSWORD] Email not found:', email);
    return next(
      new AppError(
        "User with this email doesn't exist.",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const resetToken = generateToken({ email: user.email }, '10m');
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();
  const resetLink = `http://localhost:4200/auth/reset-password?token=${user.resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reset Password',
    text: `Dear ${user.username},\n\nClick the link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('[EMAIL] Failed to send reset email:', error);
      return next(
        new AppError('Error sending email.', 500, httpStatusText.ERROR)
      );
    }

    console.log('[EMAIL] Reset email sent to:', user.email);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: 'Email sent successfully.',
    });
  });
});

// POST /reset-password
const resetPassword = asyncWrapper(async (req, res, next) => {
  const { token, password } = req.body;
  console.log('[RESET PASSWORD] Token received:', token);

  const user = await userModel.findOne({ resetToken: token });
  if (!user || user.resetTokenExpiry < Date.now()) {
    console.warn('[RESET PASSWORD] Invalid or expired token.');
    return next(
      new AppError('Invalid or expired token.', 400, httpStatusText.FAIL)
    );
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  console.log('[RESET PASSWORD] Password reset for:', user.email);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Password reset successfully.',
  });
});

// POST /logout
const logout = asyncWrapper(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('[LOGOUT] Token to blacklist:', token);

  if (!token) {
    console.warn('[LOGOUT] No token provided');
    return next(new AppError('Token is required', 400, httpStatusText.FAIL));
  }

  tokenBlacklist.add(token);
  console.log('[LOGOUT] Token blacklisted successfully');

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Logged out successfully.',
  });
});

module.exports = {
  signup,
  login,
  google,
  forgotPassword,
  resetPassword,
  logout,
};
