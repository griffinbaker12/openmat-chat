const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const decodeToken = asyncHandler(async (req, res, next) => {
  let token;

  // Need to add authorization header to our request which will hold the users JWT
  // Not sure what bearer means but assume it might have to do with the fact that the user "bears" the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Returns back the user id!
      // This is also what we used to sign the token so makes sense that this is attached to the body
      // This is also pretty cool, although the token will be created at different times so the string will differ, you will always be able to decode the userId across "logins", so that accounts for the discrepancy and how you can get back the same user id everytime you login even if the token differs
      const { id: decodedId } = jwt.verify(token, process.env.JWT_SECRET);

      // Add a user property onto the request object
      req.user = await User.findById(decodedId).select('-hash');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  }

  if (!token) {
    // This means that the user is not authorized, they have not received a JWT so should not be able to access resources
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

module.exports = { decodeToken };
