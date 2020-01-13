"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var sessionStore_1 = require("blockstack/lib/auth/sessionStore");
var bip39 = require("bip39");
// @ts-ignore
var _utils_1 = require("@utils"); // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
var crypto = require("crypto");
var blockstack = require("blockstack");
var radiks_1 = require("radiks");
var bitcoinjs = require('bitcoinjs-lib');
require("localstorage-polyfill");
// @ts-ignore
exports.initWallet = function () { return __awaiter(_this, void 0, void 0, function () {
    var action, STRENGTH, backupPhraseCache, backupPhrase, keychain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                action = 'none';
                STRENGTH = 128 // 128 bits generates a 12 word mnemonic
                ;
                backupPhraseCache = localStorage.getItem('backupPhrase');
                if (!backupPhraseCache) return [3 /*break*/, 1];
                backupPhrase = backupPhraseCache;
                return [3 /*break*/, 3];
            case 1:
                action = 'create'; // 'updateAccount'
                backupPhrase = bip39.generateMnemonic(STRENGTH, crypto.randomBytes);
                return [4 /*yield*/, localStorage.setItem('backupPhrase', backupPhrase)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, initWalletFromSeed(backupPhrase)];
            case 4:
                keychain = _a.sent();
                return [2 /*return*/, keychain];
        }
    });
}); };
function initWalletFromSeed(backupPhrase) {
    return __awaiter(this, void 0, void 0, function () {
        var masterKeychain, action, seedBuffer, keychain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    masterKeychain = null;
                    action = 'none';
                    return [4 /*yield*/, bip39.mnemonicToSeed(backupPhrase)];
                case 1:
                    seedBuffer = _a.sent();
                    return [4 /*yield*/, bitcoinjs.HDNode.fromSeedBuffer(seedBuffer)];
                case 2:
                    masterKeychain = _a.sent();
                    keychain = {
                        backupPhrase: backupPhrase,
                        masterKeychain: masterKeychain,
                        action: action
                    };
                    return [2 /*return*/, keychain];
            }
        });
    });
}
exports.initWalletFromSeed = initWalletFromSeed;
function makeUserSession(appPrivateKey, appPublicKey, username, profileJSON, scopes, appUrl, hubUrl) {
    // see https://forum.blockstack.org/t/creating-a-usersession-using-app-private-key/8096/4
    if (profileJSON === void 0) { profileJSON = null; }
    if (scopes === void 0) { scopes = ['store_write', 'publish_data']; }
    if (appUrl === void 0) { appUrl = 'goodtimesx.com'; }
    if (hubUrl === void 0) { hubUrl = 'https://hub.blockstack.org'; }
    var appConfig = new blockstack.AppConfig(scopes, appUrl);
    var userData = {
        username: username,
        decentralizedID: 'did:btc-addr:' + appPublicKey,
        appPrivateKey: appPrivateKey,
        authResponseToken: '',
        hubUrl: hubUrl,
        identityAddress: appPublicKey,
        profile: profileJSON
    };
    var dataStore = new sessionStore_1.InstanceDataStore({
        appPrivateKey: appPrivateKey,
        hubUrl: hubUrl,
        userData: userData
    });
    var userSession = new blockstack.UserSession({
        appConfig: appConfig,
        sessionStore: dataStore
    });
    return userSession;
}
exports.makeUserSession = makeUserSession;
function makeProfileJSON(profile, keypair, api) {
    var profileJSON = _utils_1.signProfileForUpload(profile, keypair, api);
    return profileJSON;
}
exports.makeProfileJSON = makeProfileJSON;
exports.saveProfileJSON = function (userSession, profileJSON) { return __awaiter(_this, void 0, void 0, function () {
    var resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userSession.putFile('profile.json', JSON.stringify(profileJSON), { encrypt: false, contentType: 'application/json' })];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp];
        }
    });
}); };
function configureRadiks(userSession) {
    radiks_1.configure({
        apiServer: process.env.RADIKS_API_SERVER,
        userSession: userSession
    });
}
exports.configureRadiks = configureRadiks;
function rando() {
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}
exports.rando = rando;
exports.createBlockchainIdentity = function (keychain, username, avatarUrl, identitiesToGenerate) {
    if (username === void 0) { username = "good" + rando() + '.id.blockstack'; }
    if (avatarUrl === void 0) { avatarUrl = 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0'; }
    if (identitiesToGenerate === void 0) { identitiesToGenerate = 2; }
    return __awaiter(_this, void 0, void 0, function () {
        var identityKeypairs, browserPublicKey, browserPrivateKey, browserKeyID, profile, userSession, profileResp, appPublicKey, appPrivateKey;
        return __generator(this, function (_a) {
            identityKeypairs = _utils_1.getBlockchainIdentities(keychain.masterKeychain, identitiesToGenerate).identityKeypairs;
            browserPublicKey = identityKeypairs[0].address;
            browserPrivateKey = identityKeypairs[0].key;
            browserKeyID = identityKeypairs[0].keyID;
            profile = makeNewProfile(browserPrivateKey, browserPublicKey, avatarUrl, username);
            userSession = makeUserSession(browserPrivateKey, browserPublicKey, username, profile.decodedToken.payload.claim);
            profileResp = exports.saveProfileJSON(userSession, [profile]);
            appPublicKey = identityKeypairs[1].address;
            appPrivateKey = identityKeypairs[1].key;
            return [2 /*return*/, {
                    appPublicKey: appPublicKey,
                    appPrivateKey: appPrivateKey,
                    identityKeypairs: identityKeypairs,
                    profileJSON: profile,
                    username: username,
                    profileResp: profileResp
                }];
        });
    });
};
function getPublicKeyFromPrivate(privateKey) {
    var keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    return keyPair.publicKey.toString('hex');
}
exports.getPublicKeyFromPrivate = getPublicKeyFromPrivate;
function makeNewProfile(privateKey, publicKey, avatarUrl, username) {
    var api = {
        gaiaHubConfig: {
            url_prefix: 'https://gaia.blockstack.org/hub/'
        },
        gaiaHubUrl: 'https://hub.blockstack.org'
    };
    var profileJSON = makeProfileJSON(_utils_1.DEFAULT_PROFILE, { key: privateKey, keyID: publicKey }, api);
    var profile = (JSON.parse(profileJSON))[0];
    profile.decodedToken.payload.claim.image = [{
            '@type': 'ImageObject',
            'contentUrl': avatarUrl,
            'name': 'avatar'
        }];
    return profile;
}
exports.makeNewProfile = makeNewProfile;
