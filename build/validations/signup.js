'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = validate;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(data) {
    var errors = {};

    if (_validator2.default.isEmpty(data.username)) errors.username = "This field is required";

    if (!_validator2.default.isEmail(data.email)) errors.email = "Email is invalid";
    if (_validator2.default.isEmpty(data.email)) errors.email = "This field is required";

    if (_validator2.default.isEmpty(data.password)) errors.password = "This field is required";

    if (!_validator2.default.equals(data.password, data.confirmPassword)) errors.confirmPassword = "Password must match";
    if (_validator2.default.isEmpty(data.confirmPassword)) errors.confirmPassword = "This field is required";

    return {
        errors: errors,
        isValid: (0, _isEmpty2.default)(errors)
    };
}
//# sourceMappingURL=signup.js.map