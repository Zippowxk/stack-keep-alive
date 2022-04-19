module.exports = {
  verbose: true,
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  testEnvironment: "jsdom",
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  "globals": {
    __DEV__ : true,
    __FEATURE_SUSPENSE__ : false,
    __COMPAT__ : false,
    __TEST__ : true,
  },
  transform: {
    "^.+\\.js$": "babel-jest",
    // "^.+\\.vue$": "vue-jest",
  },
  snapshotSerializers: [
    // "<rootDir>/node_modules/jest-serializer-vue"
  ]
}
