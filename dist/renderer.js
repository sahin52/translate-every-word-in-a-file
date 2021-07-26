"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var electron = require("electron");
var remote = electron.remote;
var dialog = remote.dialog;
var fs = require("fs");
var button = document.getElementById("upload");
var filepath;
var symbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?1234567890—]+/;
function hasSymbols(str) {
    if (symbols.test(str)) {
        return true;
    }
    else {
        return false;
    }
}
function trans(text) {
    return __awaiter(this, void 0, void 0, function () {
        var res, translatedJSON, translatedText, translatedArray, beforeTranslationArray, wordsDictionary, i, stream, word;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Beginning translation");
                    return [4 /*yield*/, fetch("https://translate.astian.org/translate", {
                            method: "POST",
                            body: JSON.stringify({
                                q: text,
                                source: "ru",
                                target: "en"
                            }),
                            headers: { "Content-Type": "application/json" }
                        })];
                case 1:
                    res = _a.sent();
                    console.log("End trans");
                    return [4 /*yield*/, res.json()];
                case 2:
                    translatedJSON = _a.sent();
                    console.log(translatedJSON);
                    console.log(JSON.stringify(translatedJSON));
                    console.log("here");
                    translatedText = translatedJSON.translatedText;
                    translatedArray = translatedText.split("\n");
                    beforeTranslationArray = text.split("\n");
                    wordsDictionary = {};
                    for (i in translatedArray) {
                        try {
                            wordsDictionary[beforeTranslationArray[i]] = translatedArray[i];
                            console.log(i);
                            console.log("no problem");
                        }
                        catch (e) {
                            console.log("a big problem occured: " + e);
                        }
                    }
                    console.log(wordsDictionary);
                    stream = "";
                    for (word in wordsDictionary) {
                        console.log(word);
                        stream += word + ";" + wordsDictionary[word] + "\n";
                    }
                    fs.writeFileSync(filepath + "_res.csv", stream);
                    return [2 /*return*/];
            }
        });
    });
}
button.addEventListener('click', function (event) {
    //trans('Мир');
    //    electron.ipcRenderer.send('open-file-dialog-for-file');
    //trans();
    dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openFile"]
    }).then(function (result) {
        if (result.canceled === false) {
            console.log("Selected file paths:");
            console.log(result.filePaths);
            var submitbutton = document.createElement('button');
            submitbutton.innerHTML = 'Submit';
            filepath = result.filePaths[0];
            submitbutton.onclick = listAllWords(filepath);
            submitbutton.className = "submitbutton";
            // where do we want to have the button to appear?
            // you can append it to another element just by doing something like
            // document.getElementById('foobutton').appendChild(button);
            document.body.appendChild(submitbutton);
        }
    })["catch"](function (err) {
        console.log(err);
    });
});
function listAllWords(filePath) {
    fs.readFile(filePath, 'utf8', function (err, data) {
        var words = {};
        if (err)
            throw err;
        console.log(data);
        for (var _i = 0, _a = data.split(/\n+/); _i < _a.length; _i++) {
            var line = _a[_i];
            for (var _b = 0, _c = line.split(/[\t ]+/); _b < _c.length; _b++) {
                var word = _c[_b];
                word.replace(",", "");
                word = word.toLowerCase();
                if (!hasSymbols(word) && word.length != 0) {
                    //console.log("-"+word+"-");
                    if (words[word]) {
                        words[word]++;
                    }
                    else {
                        words[word] = 1;
                    }
                }
            }
        }
        console.log(words);
        var keysSorted = Object.keys(words).sort(function (a, b) { return words[b] - words[a]; });
        console.log(keysSorted);
        //Test purposes
        //keysSorted.slice(0,3).join("\n")
        trans(keysSorted.join("\n"));
        //console.log(trans(keysSorted.join("\n")));
    });
    return null;
}
//# sourceMappingURL=renderer.js.map