var spellJSON;

function loadSpellData(){
    return new Promise((resolve, reject) => {
        getJSON("./spells/srd.json", (json) => {
            spellJSON = json
                .sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });

            //setup catalog selection
            createSpellCatalog(spellJSON);

            var spellListBox = document.getElementById("spell-listbox");
            spellListBox.value = spellJSON[0].name;
            mapSRDCatalogSpell(spellJSON[0]);

            spellListBox.addEventListener("change", event => {
                var spell = spellJSON.find(spell => spell.name == event.target.value);
                mapSRDCatalogSpell(spell);
            });

            //setup catalog filters
            document.getElementById("filter-name").addEventListener('input', event => { filterSpellCatalog(); });
            document.getElementById("filter-level").addEventListener('change', event => { filterSpellCatalog(); });
            document.getElementById("filter-school").addEventListener('change', event => { filterSpellCatalog(); });
            document.getElementById("filter-class").addEventListener('change', event => { filterSpellCatalog(); });

            resolve();
        });
    });
}

function applyAllSpellTips(){
    document.querySelectorAll(".spell-name").forEach(input => {
        applySpellTip(input);
        
        input.addEventListener("change", event => {
            applySpellTip(event.target);
        });
    });
}

function applySpellTip(el){
    spell = spellJSON.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\W/g, '').toUpperCase());

    if (spell){
        el.title = 
        `${spell.type}\n`
        +`Casting Time: ${spell.casting_time}\n`
        +`Range: ${spell.range}\n`
        +`Components: ${spell.components.raw}\n`
        +`Duration: ${spell.duration}\n\n`

        +`${spell.description}`;
    }
    else{
        el.title = "No Description Found";
    }
}

function createSpellCatalog(spellList){
    var spellListBox = document.getElementById("spell-listbox");
    spellListBox.innerHTML = "";

    spellList.forEach(spell => {
        var option = document.createElement("option");
        option.value = spell.name;
        option.innerHTML = spell.name;
        spellListBox.appendChild(option);
    });
}

function mapSRDCatalogSpell(spell){
    var classes = spell.classes.join(", ")

    document.getElementById("srd-catalog-name").innerHTML = spell.name;
    document.getElementById("srd-catalog-level").innerHTML = spell.level;
    document.getElementById("srd-catalog-school").innerHTML = spell.school;
    document.getElementById("srd-catalog-classes").innerHTML = classes;
    document.getElementById("srd-catalog-components").innerHTML = spell.components.raw;
    document.getElementById("srd-catalog-ritual").innerHTML = spell.ritual ? "Yes" : "No";
    document.getElementById("srd-catalog-casting-time").innerHTML = spell.casting_time;
    document.getElementById("srd-catalog-duration").innerHTML = spell.duration;
    document.getElementById("srd-catalog-range").innerHTML = spell.range;
    document.getElementById("srd-catalog-description").value = spell.description;
}

function filterSpellCatalog(){
    var name = document.getElementById("filter-name").value;
    var level = document.getElementById("filter-level").value;
    var school = document.getElementById("filter-school").value;
    var _class = document.getElementById("filter-class").value;

    var filteredCatalog = spellJSON
        .filter(spell => !name || spell.name.toUpperCase().indexOf(name.toUpperCase()) != -1)
        .filter(spell => !level || spell.level.toUpperCase() == level.toUpperCase())
        .filter(spell => !school || spell.school.toUpperCase() == school.toUpperCase())
        .filter(spell => !_class || spell.classes.indexOf(_class) != -1);

    createSpellCatalog(filteredCatalog);
}

function getJSON(path, callback){
    var request = new XMLHttpRequest();
    request.open('GET', path, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            callback(JSON.parse(request.responseText));
        }
    };

    request.send();
}