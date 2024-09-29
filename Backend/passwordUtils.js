const bcrypt = require('bcrypt');

// Generalized method to hash the password before saving it to the database
const hashPassword = async function(next) {
  const user = this; // 'this' refers to the document being saved or the query being executed

  // Check if the context is a document or a query 
  if (user.isModified && user.isModified('pass')) { //check if a particular field is modified (isModified method exists on the user object) && check if this field is the password field
    // Document context (pre-save)      (POST request)
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      const hash = await bcrypt.hash(user.pass, salt); // Hash the password using the salt
      user.pass = hash; // Replace the plain text password with the hashed password
      next(); // Move to the next middleware
    } catch (err) {
      next(err);
    }
  } else if (user.getUpdate && user.getUpdate().pass) {  //check if a particular field is updated (getUpdate method exists on the user object) && check if this field is the password field
    // Query context (pre-findOneAndUpdate)     (PATCH request)
    try {
      const update = user.getUpdate();
      if (update.pass) { // Check if the password is present in the update object (Not null or undefined) --> indicates password is being updated
        const salt = await bcrypt.genSalt(10); // Generate a salt
        update.pass = await bcrypt.hash(update.pass, salt); // Hash the password using the salt
        user.setUpdate(update); // Update the query with the hashed password
      }
      next(); // Move to the next middleware
    } catch (err) {
      next(err);
    }
  } else {
    next(); // If the password is not modified, move to the next middleware
  }
};

// Method to compare plain text password with hashed password
const comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.pass);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  hashPassword,
  comparePassword
};