var log = require("./log");
const process = require("process");
const fs = require("fs");
const readline = require("readline");
const texts = require("./texts.json");
const path = require("path");
const rl = readline.createInterface({   input: process.stdin,
    output: process.stdout });


(function() {
    console.clear();
    
    rl.question("Select a language (fr/en) : ", (lang) => {
        lang =lang.toLowerCase();

        if(!texts.langs.includes(lang)) {
            log(1, texts.LangNotSupported);
            process.exit(1);
        }
        log(2, texts.ThankToUse[lang])
        if(process.platform != "win32") {
            log(1, texts.PlatformNotSupported[lang]);
            process.exit(1);
        }

        if(!fs.existsSync(process.env.APPDATA)) {
            log(1, texts.PlatformNotSupported[lang]);
            process.exit(1);
        }

        var adtracepath = path.join(process.env.APPDATA, "AnyDesk", "ad.trace");
        if(!fs.existsSync(adtracepath)) {
            log(1, texts.FileNotFound[lang]);
            process.exit(1);
        }

        var filecontent = fs.readFileSync(adtracepath).toString().split("\r\n").filter(line => line.includes("anynet.any_socket - Client-ID:") || line.includes("anynet.any_socket - Logged in from")).map(line => line.substr(line.indexOf("anynet.any_socket")));
        if(filecontent.length == 0) {
            log(2, texts[NoIPFound][lang]);
            process.exit(1);
        } 
        var groups = decoupe(filecontent, 2).filter(group => group.length == 2);
        
        groups.forEach(group => {
            var clientraw = group[0];
            var ipraw = group[1];
            var userip;
            var clientid;
            
            clientid = clientraw.substring(clientraw.indexOf("Client-ID"), clientraw.indexOf("(FPR:")).trim();
            userip = ipraw.substring(ipraw.indexOf("Logged in from") + 15, ipraw.indexOf(":"));
            log(0, `${clientid}, IP: ${userip}`);
        });
    });
    
 
})();


const decoupe = function(arr, limit) {
    let array = arr
    const result = []
    
    const length = Math.ceil(array.length / limit);
    for (let i = 0; i < length; i++) {
      result.push(array.slice(0, limit))
      array = array.slice(limit) 
    }
     
    return result
}