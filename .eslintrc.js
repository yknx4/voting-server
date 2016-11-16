module.exports = {
    "extends": "react",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true
    },
    "rules": {
      "semi": ["off", "always"],
      "max-len": ["warn", 120]
    },
    "plugins": [
      "chai-expect"
    ],
    "globals": {
      "describe": true,
      "it": true,
      "require": true
    }
};
