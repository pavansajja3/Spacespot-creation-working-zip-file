// Validation configurations
module.exports = {
  validation: {
    options: {
      abortEarly: false, // Fail on first error by default
      stripUnknown: false, // Remove unknown keys by default
      language: {
        labels: {
          email: 'Email',
          phone: 'Phone Number',
          password: 'Password',
          companyName: 'Company Name',
          contactPerson: 'Contact Person',
          customerName: 'Customer Name'
        }
      }
    },
    customRules: {
      isNotEmpty: (value) => {
        if (typeof value !== 'string') return false;
        return value.trim().length > 0;
      }
    }
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: {
      regex: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
    },
    password: {
      minLength: 8,
      maxLength: 100,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialCharacters: true
    },
    name: {
      minLength: 2,
      maxLength: 255
    },
    company: {
      minLength: 2,
      maxLength: 255
    }
  }
};
