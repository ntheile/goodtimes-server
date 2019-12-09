"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// @ts-ignore
var model_1 = require("radiks/lib/model");
// @ts-ignore
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Comment.className = 'Comment';
    Comment.schema = {
        text: {
            type: String,
            decrypted: true
        },
        createdBy: {
            type: String,
            decrypted: true
        },
        postId: {
            type: String,
            decrypted: true
        }
    };
    return Comment;
}(model_1["default"]));
exports["default"] = Comment;
