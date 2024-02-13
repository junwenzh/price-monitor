module.exports = {
  env: {
    node: true, // Node.js global variables and Node.js scoping
    es2021: true, // Adds all ECMAScript 2021 globals and automatically sets the ecmaVersion parser option to 12
  },
  extends: [
    "eslint:recommended", // Use ESLint's recommended rules
    "plugin:@typescript-eslint/recommended", // Use the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser for TypeScript
  parserOptions: {
    ecmaVersion: 12, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  plugins: [
    "@typescript-eslint", // Uses the TypeScript plugin
    "prettier", // Runs Prettier as an ESLint rule
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "prettier/prettier": "error", // Ensures that prettier rules are treated as ESLint errors
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Allows unused variables when they are prefixed with an underscore
    "@typescript-eslint/no-explicit-any": "off", // Disables the rule for using 'any' type
    "no-console": "warn", // Warns about console.log usage
    "no-process-env": "off", // Allows the use of process.env
    eqeqeq: ["error", "always"], // Enforces the use of === and !==
  },
  settings: {
    // Settings for how to resolve imports, etc.
  },
};
