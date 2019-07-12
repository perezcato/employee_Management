const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    personal: {
      first_name: { type: String, required: true, max: 100 },
      last_name: { type: String, required: true, max: 100 },
      other_names: { type: String, required: false, max: 100 },
      email: { type: String, required: true, max: 100 },
      mobile_phone: { type: String, required: true, max: 15 },
      date_of_birth: { type: Date, required: true },
      gender: { type: String, required: true, enum: ['Male', 'Female'] },
      address: { type: String, required: true },
    },
    work: {
      date_of_joining: { type: Date, default: Date.now(), required: true },
      work_email: String,
      employee_status: { type: String, required: true },
      role: { type: String, required: true },
      emergency_contact: {
        full_name: String,
        contact: String,
        address: String,
      },
      job_description: String,
      expertise: String,
    },
    role: {
      type: String, required: true, enum: ['Admin', 'Employee'], default: 'Employee',
    },
    time_added: Date,
    added_by: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    date_of_exit: Date,
    salt: String,
  },
);

userSchema.virtual('name').get(() => `${this.first_name} ${this.last_name}`);

userSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePasswords = (password) => {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  this.hash = hash;
};

userSchema.virtual('age').get(() => {
  const diffMs = Date.now() - this.date_of_birth.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
});

module.exports = mongoose.model('user', userSchema);
