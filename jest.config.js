module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  roots: ["src"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "node_modules/babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
};
