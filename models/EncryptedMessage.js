"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// @ts-ignore
var model_1 = require("radiks/lib/model");
var EncryptedMessage = /** @class */ (function (_super) {
    __extends(EncryptedMessage, _super);
    function EncryptedMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EncryptedMessage.className = 'EncryptedMessage';
    EncryptedMessage.schema = {
        content: {
            type: String
        },
        category: {
            type: String,
            decrypted: true
        },
        createdBy: {
            type: String,
            decrypted: true
        },
        _id: {
            type: String,
            decrypted: true
        },
        userGroupId: {
            type: String,
            decrypted: true
        }
    };
    return EncryptedMessage;
}(model_1["default"]));
exports["default"] = EncryptedMessage;
