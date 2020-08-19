var jsonSchemaVersion = 1.0;

ipcRenderer.on('request-save-json', (event, arg) => {
    var json = {}
    json["version"] = jsonSchemaVersion;

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat")){
            return;   //Handled below
        }
        if (el.type == "text"){
            json[el.id] = el.value;
        }
        else if(el.type == "checkbox"){
            json[el.id] = el.checked;
        }
    });
    document.querySelectorAll("textarea").forEach(el => {
        json[el.id] = el.value;
    });

    json["attack-stats"] = [];
    document.getElementById("attack-stats").querySelectorAll(".attack-stat-row").forEach(row => {
        if (row.querySelector(".attack-stat-name").value){
            var attackJSON = {};
            attackJSON["name"] = row.querySelector(".attack-stat-name").value;
            attackJSON["bonus"] = row.querySelector(".attack-stat-bonus").value;
            attackJSON["dmg"] = row.querySelector(".attack-stat-dmg").value;
            
            json["attack-stats"].push(attackJSON);
        }
    });


    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event, json) => {
    document.title = json["character-name"] + " - RollaDex";

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat")){
            return;   //Handled below
        }
        if (el.type == "text"){
            el.value = json[el.id];
        }
        else if (el.type == "checkbox"){
            el.checked = json[el.id];
        }

        document.getElementById("attack-stats").innerHTML = "";
        json["attack-stats"].forEach(attack => {
            var attackRow = buildAttackRow();
            attackRow.querySelector(".attack-stat-name").value = attack["name"];
            attackRow.querySelector(".attack-stat-bonus").value = attack["bonus"];
            attackRow.querySelector(".attack-stat-dmg").value = attack["dmg"];

            document.getElementById("attack-stats").appendChild(attackRow);
        });
    });
    document.querySelectorAll("textarea").forEach(el => {
        el.value = json[el.id];
    });

    updateAllAbilityMods();
});