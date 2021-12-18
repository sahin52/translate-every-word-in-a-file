import electron = require("electron");
import  translate = require("translate");
const remote = electron.remote;
const dialog = remote.dialog;
import fs = require('fs')

const button = document.getElementById("upload");

let filepath: string;

const symbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?1234567890—]+/;

function hasSymbols(str:string){
    if(symbols.test(str)){
        return true;
    } else {
        return false;
    }
}

async function trans(text: string): Promise<any>{
    console.log("Beginning translation");
    const res = await fetch("https://trans.zillyhuhn.com/translate", {
        method: "POST",
        body: JSON.stringify({
            q: text,
            source: "ru",
            target: "en"
        }),
        headers: { "Content-Type": "application/json" }
    });
    console.log("End trans");
    const translatedJSON = await res.json();
    console.log(translatedJSON);
    console.log(JSON.stringify(translatedJSON));
    console.log("here");

    const translatedText: string = translatedJSON.translatedText;
    const translatedArray = translatedText.split("\n");
    const beforeTranslationArray=text.split("\n");
    const wordsDictionary: any= {};
    for(const i in translatedArray){
        try{
            wordsDictionary[beforeTranslationArray[i]]=translatedArray[i];
            console.log(i);
            console.log("no problem");
        }catch(e){
            console.log(`a big problem occured: `+e)
        }
    }
    console.log(wordsDictionary);
    let stream = ""
    for(const word in wordsDictionary){
        console.log(word);
        stream += word + ";" + wordsDictionary[word]+"\n";
    }

    fs.writeFileSync(filepath+"_res.csv",stream)


}


button.addEventListener('click',(event)=>{
    //trans('Мир');
//    electron.ipcRenderer.send('open-file-dialog-for-file');
    //trans();
    dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openFile"]
    }).then(result => {
        if (result.canceled === false) {
            console.log("Selected file paths:")
            console.log(result.filePaths);
            const submitbutton = document.createElement('button');
            submitbutton.innerHTML = 'Submit';
            filepath = result.filePaths[0];
            submitbutton.onclick = listAllWords(filepath);
            submitbutton.className = "submitbutton";
            // where do we want to have the button to appear?
            // you can append it to another element just by doing something like
            // document.getElementById('foobutton').appendChild(button);
            document.body.appendChild(submitbutton);
        }
    }).catch(err => {
        console.log(err);
    })
    
});

function listAllWords(filePath: string):null{
    fs.readFile(filePath,'utf8',(err, data) => {
        const words: any = {};
        if (err) throw err;
        console.log(data);
        for(const line of data.split(/\n+/)){
            for(let word of line.split(/[\t ]+/)){
                word.replace(",","");
                word = word.toLowerCase();
                if(!hasSymbols(word) && word.length!=0){
                    //console.log("-"+word+"-");
                    if(words[word]){
                        words[word]++;
                    }else{
                        words[word]=1;
                    }
                }
                    
            }
        }
        console.log(words)
        const keysSorted = Object.keys(words).sort(function(a,b){return words[b]-words[a]})
        console.log(keysSorted);  
        //Test purposes
        //keysSorted.slice(0,3).join("\n")
        trans(keysSorted.join("\n"));
        //console.log(trans(keysSorted.join("\n")));

    });
    return null;
}