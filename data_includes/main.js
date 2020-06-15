//test test
var ParticCondition = Math.floor(Math.random() * 6 + 1);
//generate a random number between 1 and 6 inclusive
/*generates the participant condition.
SEEN CONDITION
1) Colour morphologically realised
2) Texture morphologically realised
UNSEEN CONDITION
Colour morphologically realised
3) value1 in the critical condition
4) value2 in the critical condition
Texture morphologically realised
5) value1 in the critical condition
6) value2 in the critical condition
*/

//shuffle function
function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
    }
    
// suffix varies randomly, it is the entity condition that is crucial which is associated with 
// a given participant condition and therefore varied systematically
var suffixes = ["ni", "ko"];
var suffixes2 = shuffle(suffixes);
var s1 = suffixes2[0];
var s2 = suffixes2[1];
//make sure these are logged, find how

//40 base stems

//will properly filter these once we decide on the language
var ws = ['ta', 'co', 'qa', 'ku', 'ba', 'ru', 'da', 'ma', 'pi', 'ha', 'be', 'cika', 'hiti', 'waxe', 'hoge', 'vafi', 'yibe', 'luvi', 'dexu', 'gimu', 'maje', 'tefe', 'duwi', 
'sojo', 'nibe', 'vuqe', 'fago', 'wuja', 'maqa', 'quco', 'fice', 'yevu', 'bocu', 'rayo', 'piva', 'tinu', 'toye', 'masu', 'veva', 'mewu', 'duli', 'fivo']; 
var ws_shuf = shuffle(ws);

//set the constants for each participant condition
if(ParticCondition == 1 || ParticCondition == 3 || ParticCondition == 4){
    var morphReal = "Colour";
    var pic_grouping = [["BD", "BS"],["OD", "OS"]];
} else {
        var morphReal = "Texture";
        var pic_grouping = [["BD", "OD"], ["BS", "OS"]];
    }
    
//set unknown condition for unseen conditions
switch(ParticCondition){
    case 1:
        var unseen_cond = shuffle(pic_grouping.flat())[0];
        break;
    case 2:
        var unseen_cond = shuffle(pic_grouping.flat())[0];
        break;
    case 3:
        var unseen_cond = shuffle(pic_grouping[0])[0];
        break;
    case 4:
        var unseen_cond = shuffle(pic_grouping[1])[0];
        break;
    case 5:
        var unseen_cond = shuffle(pic_grouping[0])[0];
        break;
    case 6:
        var unseen_cond = shuffle(pic_grouping[1])[0];
        break;
}


var all_conds = pic_grouping.flat();
var seen_conds = all_conds.filter(function(el) { return el != unseen_cond; });


//divide testing from training
//all IDs
var pic_id_all = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];
var pic_id_all_shuf = shuffle(pic_id_all);
//only 35 IDs (decided to keep entities for which texture was least clear as testing fillers)
var pic_id_training = ['1', '2', '3', '5', '6', '8', '9', '10', '12', '13', '14', '15', '16', '18', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];
var pic_id_shuf = shuffle(pic_id_training);
var testing_fillers_only = ["4", "7", "11", "17", "19"];


//dictionary of stem~entity pairs 
var stemEntity = {};
pic_id_all_shuf.forEach((key, i) => stemEntity[key] = ws_shuf[i]);

//create an array of file names for each condition
//check that the way slice works + start countig at 0 gives the right amount of items

//has 35 training entities
var training_conds = {"OD" : shuffle(pic_id_shuf.flatMap(i => i+"OD.jpg")),
"BD" : shuffle(pic_id_shuf.flatMap(i => i+"BD.jpg")),
"OS" : shuffle(pic_id_shuf.flatMap(i => i+"OS.jpg")),
"BS" : shuffle(pic_id_shuf.flatMap(i => i+"BS.jpg"))};

//has all entities (40)
var all_items_conds = {"OD" : shuffle(pic_id_all.flatMap(i => i+"OD.jpg")),
"BD" : shuffle(pic_id_all.flatMap(i => i+"BD.jpg")),
"OS" : shuffle(pic_id_all.flatMap(i => i+"OS.jpg")),
"BS" : shuffle(pic_id_all.flatMap(i => i+"BS.jpg"))};

//training filler conds? (do I need this?)


//takes a file name, gets the entity ID, maps it to the stem, adds the suffix.
//this works despite the errors
function mapStem(filename){
    let mappedStem = stemEntity[filename.slice(0,filename.length - 6)];
    let cond = filename.slice(filename.length-6,filename.length - 4);
    if(morphReal == "Colour") {
        if (pic_grouping[0].includes(cond)){
            var suff = s1;
        } else{
            var suff = s2;
        }
    } else {
       if (pic_grouping[0].includes(cond)){
            var suff = s1;
        } else{
            var suff = s2;
        } 
    } return mappedStem+suff;}
    
var testing_seen = [];

for(var cond of seen_conds){
     testing_seen.push(testing_conds[cond]);
}
var testing_seen = testing_seen.flat();

//set item order for each condition
var seen_n_training = 22;
var unseen_n_training = 30;

//conds 1&2 have 88 items, others have 90
switch(ParticCondition){
    case 1:
    case 2:
        var training_pics = shuffle(training_conds.OD.slice(0,seen_n_training).concat(training_conds.BD.slice(0,seen_n_training)).concat(training_conds.OS.slice(0,seen_n_training)).concat(training_conds.BS.slice(0,seen_n_training)));
        var training_words = training_pics.map(mapStem);
        //make array of word~picture pairs
        var training_items = training_pics.map(function(e, i) {
            return [e, training_words[i]];
            });
        var leftover_training = training_conds.OD.slice(seen_n_training).concat(training_conds.BD.slice(seen_n_training)).concat(training_conds.OS.slice(seen_n_training)).concat(training_conds.BS.slice(seen_n_training));
        //have what to fill with. I guess any other item is fine, but we may want to think this through a little more
        var testing_pics = shuffle(testing_conds[unseen_cond].slice(0,10).concat(shuffle(testing_seen).slice(0,20)).concat(leftover_training.slice(0,30)));
        var testing_words = testing_pics.map(mapStem);
        var testing_items = testing_pics.map(function(e, i) {
            return [e, testing_words[i]];
            });
    break;
    case 3:
    case 4:
    case 5:
    case 6:
        var training_pics = shuffle(training_conds[seen_conds[0]].concat(training_conds[seen_conds[1]]).concat(training_conds[seen_conds[2]]));
        var training_words = training_pics.map(mapStem);
        var training_items = training_pics.map(function(e, i) {
            return [e, training_words[i]];
            });
        var testing_pics = shuffle(testing_conds[unseen_cond].slice(0,10).concat(shuffle(testing_seen).slice(0,20)).concat(training_conds[unseen_cond].slice(0,10)).concat(shuffle(testing_seen).slice(0,20)));
        var testing_words = testing_pics.map(mapStem);
        var testing_items = testing_pics.map(function(e, i) {
            return [e, testing_words[i]];
            });
        
    break;
}

//make function for assigning block names to add comprehension trial
var block_dict = {};
var ints = [...Array(90).keys()];
var block_ID = [];
for (var i of [...Array(9).keys()]){
  	block_ID.push(Array(10).fill(i));
  }
ints.forEach((key, i) => block_dict[key] = block_ID.flat()[i]);

//takes a nested array, for each subarray (= trial) its index is used to get block membership and append it to the subarray
function chunker(arr){
    for (var x of arr){
        let idx = arr.indexOf(x);
        x.push("block_"+block_dict[idx]);
    }
    return arr;
}
var training_items = chunker(training_items);
//comprehension questions identifier
var comp_in_chunk = []
for (var i in [...Array(9).keys()]){
    comp_in_chunk.push(shuffle(["Y","N","N","N","N","N","N","N","N","N"]))
}
if (ParticCondition == 1||2){
    comp_in_chunk[8] = shuffle(["Y","N","N","N","N","N","N","N"])
}
for (i in training_items){
	training_items[i].push(comp_in_chunk.flat()[i])
}
//turn the input into csv
var csv_training = training_items.map(function(d){
    return d.join();
}).join('\n');
var csv_training = csv_training+"\n"

//this needs changing
var csv_testing = testing_items.map(function(d){
    return d.join();
}).join('\n');

var csv_testing = csv_testing+"\n"


//check how adding a table instead of a .csv actually works, not straightforward
//have to convert array into csv text? there must be a better way
//
PennController.AddTable("myTable_training", "picture,word,chunk,comp\n"+
                        csv_training);

PennController.AddTable("myTable_testing", "picture,word,p1,p2,p3,p4,p5,w5,n_correct,pol\n"+
                        csv_testing);
                        

//---------------------------------------------------------
//create separator for comprehension questions during training

//function to intersperse separator trials, and pauses - ...why does this work without being called?
//thinking of doing
/*function modifyRunningOrder(ro) {
        for (var i = 0; i < ro.length; ++i) {
            if (i % 10 == 0) {
                // Passing 'true' as the third argument casues the results from this controller
                // to be omitted from the results file.
                ro[i].push(new DynamicElement(
                    "Message",
                    { html: "<p>jshfkjhaLKFSHFJSHF</p>", transfer: 1000 },
                    true
                ));
            }
        }
        return ro;
    }
*/   
/*once the above works, replace push argument with this bit
        new DynamicElement(
    "PennController",
    newTrial(
        newTimer(10000)
        newButton()
    ),
    true
)

*/


//--------------------------------------------------------
//templates and running order

PennController.ResetPrefix(null); // Shorten command names (keep this line here)
//WHY ARE YOU NOT WORKING
//PreloadZip("https://cloud.llf.aiakide.net/nextcloud/mcopot/png.zip");
/*array of testing~comprehension labels
var training_comprehension_arr = []
for (var x of [...Array(8).keys()]){
        training_comprehension_arr.push("training_"+x);
        training_comprehension_arr.push("comprehension_"+x);
    }
//check if I don't need this
var training_comprehension = training_comprehension_arr.join();
*/

//Sequence( "intro", "training_0", "comprehension_0", "training_1", "comprehension_1","testing_instructions", SendResults() , "bye" );

Sequence( "intro", "training_0", "comprehension_0", "training_1", "comprehension_1", "training_2", "comprehension_2", "training_3", "comprehension_3", "training_4", "comprehension_4", "training_5", "comprehension_5", "training_6", "comprehension_6", "training_7", "comprehension_7", "training_8", "comprehension_8", "testing_instructions", SendResults() , "bye" );


// What is in Header happens at the beginning of every single trial
Header(
    //appends indexical info at the beginning of each row of results
    newVar("age")
        .global()
    ,
    newVar("genre")
        .global()
    ,
    newVar("francais")
        .global()
    ,
    newVar("autreLangue1")
        .global()
    ,
    newVar("scoreAutreLangue1")
        .global()
    ,
    newVar("autreLangue2")
        .global()
    ,
    newVar("scoreAutreLangue2")
        .global()
    ,
    newVar("autreLangue3")
        .global()
    ,
    newVar("scoreAutreLangue3")
        .global()
    ,
    newVar("autreLangue4")
        .global()
    ,
    newVar("scoreAutreLangue4")
        .global()
    ,
    newVar("autreLangue4")
        .global()
    ,
    newVar("scoreAutreLangue5")
        .global()
    ,
    newVar("diplome")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(250)
        .start()
        .wait()
)
.log( "diplome" , getVar("diplome") )
.log( "scoreAutreLangue5", getVar("scoreAutreLangue5"))
.log( "autreLangue5", getVar("autreLangue5"))
.log( "scoreAutreLangue4", getVar("scoreAutreLangue4"))
.log( "autreLangue4", getVar("autreLangue4"))
.log( "scoreAutreLangue3", getVar("scoreAutreLangue3"))
.log( "autreLangue3", getVar("autreLangue3"))
.log( "scoreAutreLangue2", getVar("scoreAutreLangue2"))
.log( "autreLangue2", getVar("autreLangue2"))
.log( "scoreAutreLangue1", getVar("scoreAutreLangue1"))
.log( "autreLangue1", getVar("autreLangue1"))
.log( "francais" , getVar("francais") )
.log( "genre" , getVar("genre") )
.log( "age" , getVar("age") )
.log( "ParticCond", getVar("ParticCond"))

// This log command adds columns reporting the participant's info to every line saved to the results


newTrial( "intro" ,

    newText("pres", "<p>Bonjour ! </p> ATTENTION : il est extrêmement important d’effectuer l’expérience sur un ordinateur ou une tablette plutot que sur un smartphone. Si vous avez ouvert l’expérience sur un appareil qui n’est pas un ordinateur ou une tablette, veuillez fermer cette fenêtre et y accéder depuis un ordinateur ou une tablette. Assurez-vous de ne pas être derangé.e pendant l’expérience : éteignez votre télévision, musique ou toute.s autre.s source.s de distraction car cela aura un impacte sur les résultats. </p> <p> Dans cette expérience, nous vous apprendrons une langue alienne. L'expérience dure environ 50 minutes, en incluant les pauses prévues. La première moitié est de 30 minutes, et la seconde de 20 minutes. Pendant la première moitié de l'expérience, on vous montrera une série d'entités et le mot qui désigne chacune de ces entités dans cette langue extraterrestre. Il est important que vous soyez attentif.ve, car de temps en temps, il vous sera demandé d'écrire le nom d'une entité qui vous aura été montrée. Vous aurez la possibilité de faire des pauses pendant cette phase (surveillez la barre de progression pour savoir quand la prochaine est prévue !). Les pauses ne doivent pas dépasser plus de quelques minutes : une fois l'écran de pause affiché, un minuteur sonnera au bout de trois minutes. Veuillez revenir à l'expérience lorsqu'il sonne. Dans la deuxième moitié de l'expérience, un mot et une série d'images vous seront montrés. Il vous sera demandé de cliquer soit sur toutes les images qui correspondent à ce mot, soit sur toutes les images qui ne lui correspondent pas. Les instructions vous seront données au début de chaque essai.</p><p>Toutes les données sont conservées de manière anonyme et serviront strictement à des objectifs scientifiques. Une fois l'expérience terminée, un code aleatoire vous sera donné. Vous pouvez utiliser ce code pour demander une copie de vos données expérimentales, si vous le souhaitez, en écrivant à mcopot@linguist.univ-paris-diderot.fr. Veuillez écrire à cette adresse si vous avez des questions sur l'expérience ou si vous souhaitez recevoir une mise à jour des résultats de l'expérience.</p> ")
        .css("margin-right","250px")
        .css("margin-left","250px")
        .print()
    ,

    newScale("acceptation", 1)
        .settings.after( newText("<p>Je déclare d’accepter librement et de façon éclairée de parteciper comme sujet à cette expérience, et je suis conscient.e de pouvoir cesser l’expérience à tout moment sans devoir donner de justification</p>").css("margin-left","300px")
        .css("margin-right","300px"))
        .css("margin-left","300px")
        .css("margin-right","300px")
        .print()
        .wait()
    ,
    
    newButton("C'est parti")
        .css("margin-left","250px")
        .print()
        .wait()
    ,
    clear()
    ,
    
    newTextInput("askAge")
        .size(70, 20)
        .before(newText("Age :&nbsp"))
        .after(newText("<i>(Entrez des chiffres uniquement)<i>"))
        .print()
        .wait(getTextInput("askAge").test.text(/^[0-9]+$/))
    ,      
    newScale("genre", "Homme", "Femme", "Non-binaire")
        .labelsPosition("bottom")  // Position the labels
        .vertical()
        .before(newText("<p>Genre :</p>"))
        .print()
        .wait()
    ,
    newDropDown("DDLfrancais", "")
        .add("ma langue maternelle", "une de mes langues maternelles", "une deuxi&egrave;me langue")
        .before(newText("Le francais est :"))
        .print()
        .wait()
    ,
    newText("<p>Autres langues parl&eacute;es: </p>")
        .print()
    ,
    
    newTextInput("autreLangue1")
        .size(100, 20)
        .print()
    ,
    newScale("scoreAutreLangue1", 5)
                    .before(newText("left","Debutant"))
                    .after(newText("right", "Bilingue"))
                    .print()
    ,                
    newTextInput("autreLangue2")
        .size(100, 20)
        .print()
    ,
    newScale("scoreAutreLangue2", 5)
                    .before(newText("Debutant"))
                    .after(newText("Bilingue"))
                    .print()
    ,
    newTextInput("autreLangue3")
        .size(100, 20)
        .print()
    ,    
    newScale("scoreAutreLangue3", 5)
                    .before(newText("Debutant"))
                    .after(newText("Bilingue"))
                    .print()
    ,
        newTextInput("autreLangue4")
        .size(100, 20)
        .print()
    ,
    newScale("scoreAutreLangue4", 5)
                    .before(newText("Debutant"))
                    .after(newText("Bilingue"))
                    .print()
    ,
        newTextInput("autreLangue5")
        .size(100, 20)
        .print()
    ,
    newScale("scoreAutreLangue5", 5)
                    .before(newText("Debutant"))
                    .after(newText("Bilingue"))
                    .print()
    ,
    newButton("Valider les autres langues parl&eacute;es et passer &agrave; la suite")
        .print()
        .wait()
    ,
    newDropDown("educ", "")
        .add("Aucun", "Brevet ou &eacute;quivalent", "Bac ou &eacute;quivalent", "Licence ou &eacute;quivalent", "Master ou &eacute;quivalent", "Doctorat ou &eacute;quivalent" )
        .before(newText("Votre dipl&ocirc;me le plus &eacute;lev&eacute; :"))
        .print()
        .wait()
    ,
    newButton("Commencer")
        .print()
        .wait()
    ,
    
    getTextInput("askAge").setVar("age"),
    getScale("genre").setVar("genre"),
    getDropDown("DDLfrancais")
        .test.selected(0).success( 
            getVar("francais").set("FR-seule-maternelle")
        )
        .test.selected(1).success( 
            getVar("francais").set("FR-parmi-maternelle")
        )
        .test.selected(2).success( 
            getVar("francais").set("FR-2elangue")
        ),
    
    getTextInput("autreLangue1").setVar("autreLangue1"),
    getScale("scoreAutreLangue1").setVar("scoreAutreLangue1"),
    
    getTextInput("autreLangue2").setVar("autreLangue2"),
    getScale("scoreAutreLangue2").setVar("scoreAutreLangue2"),
    
    getTextInput("autreLangue3").setVar("autreLangue3"),
    getScale("scoreAutreLangue3").setVar("scoreAutreLangue3"),
    
    getTextInput("autreLangue4").setVar("autreLangue4"),
    getScale("scoreAutreLangue4").setVar("scoreAutreLangue4"),
    
    getTextInput("autreLangue5").setVar("autreLangue5"),
    getScale("scoreAutreLangue5").setVar("scoreAutreLangue5"),
    
    getDropDown("educ")
        .test.selected(0).success( 
            getVar("diplome").set("aucun")
        )
        .test.selected(1).success( 
            getVar("diplome").set("brevet")
        )
        .test.selected(2).success( 
            getVar("diplome").set("bac")
        )
        .test.selected(3).success( 
            getVar("diplome").set("licence")
        )
        .test.selected(4).success( 
            getVar("diplome").set("master")
        )
        .test.selected(5).success( 
            getVar("diplome").set("doctorat")
        )
		
)


//template for training in chunks
customTrial_training = label => row => newTrial( label , 
        newTimer(500)
        .start()
        .wait()
        ,
        newImage("t", row.picture)
        .settings.size(420, 420) //check if there is a way to make it relative to the screen size/type
        .print()
        
        ,
        newTimer(400)
        .start()
        .wait()
        ,
        newText(row.word)
        .css("font-size", "40px")
        .css("text-transform", "uppercase")
        .center()
        .bold()
        .print()
        ,
        newTimer(3000)
        .start()
        .wait()
        ).log("picture", row.picture)
        .log("word", row.word)

//template for comprehension questions
customTrial_comprehension = label => row => newTrial(label,
    newText("Type the name of this item in the text box below and press enter")
    .center()
    .bold()
    .print()
    ,
    newImage("d", row.picture)
    .size(420, 420)
    .print()
    ,
    newTextInput("answer_comp","")
    //add testing command to see if it matches memory_item.word
    //check that log is at the right level 
    .log()
    .lines(0)
    .settings.before(newText("Name:"))
    .size(200,25)
    .center()
    .print()
    .wait()
    
);
//something weird: for loop is working, trials have the right names, so num is being a placeholder behaving as expected
//but I get the same items in cycles for (training+comp)
//it's not an issue of the csv table, all works as expected there
/*for (num in [...Array(8).keys()]){
Template( GetTable("myTable").filter(row => (row.cond == "train")&(row.chunk == ["block_",num].join(""))&(row.comp == "Y")), customTrial_comprehension(["comprehension_",num].join("")));
Template( GetTable("myTable").filter(row => (row.cond == "train")&(row.chunk == ["block_",num].join(""))), customTrial_training(["training_",num].join("")));
}*/

Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_0")&(row.comp == "Y")), customTrial_comprehension("comprehension_0"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_0")), customTrial_training("training_0"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_1")&(row.comp == "Y")), customTrial_comprehension("comprehension_1"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_1")), customTrial_training("training_1"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_2")&(row.comp == "Y")), customTrial_comprehension("comprehension_2"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_2")), customTrial_training("training_2"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_3")&(row.comp == "Y")), customTrial_comprehension("comprehension_3"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_3")), customTrial_training("training_3"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_4")&(row.comp == "Y")), customTrial_comprehension("comprehension_4"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_4")), customTrial_training("training_4"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_5")&(row.comp == "Y")), customTrial_comprehension("comprehension_5"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_5")), customTrial_training("training_5"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_6")&(row.comp == "Y")), customTrial_comprehension("comprehension_6"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_6")), customTrial_training("training_6"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_7")&(row.comp == "Y")), customTrial_comprehension("comprehension_7"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_7")), customTrial_training("training_7"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_8")&(row.comp == "Y")), customTrial_comprehension("comprehension_8"));
Template( GetTable("myTable_training").filter(row => (row.cond == "train")&(row.chunk == "block_8")), customTrial_training("training_8"));


  

newTrial("testing_instructions",
    newText("On passe maintenant � la deuxi�me partie. Des images vous seront pr�sent�es, pr�c�d�es d'une question. La question vous demandera d'identifier tous les �l�ments qui peuvent �tre d�sign�s par un mot donn� dans la langue � laquelle vous venez d'�tre expos�, ou tous les �l�ments qui ne peuvent pas �tre d�sign�s par un mot donn�. S�lectionnez toutes les images qui correspondent � la demande, puis appuyez sur le bouton 'continuer'. Vous pouvez d�s�lectionner une photo en cliquant � nouveau sur celle-ci. Les images s�lectionn�es seront marqu�es par un contour en gras. Si aucune des images ne peut �tre d�crite par le mot donn�, cochez la case 'aucune des images ci-dessus' et appuyez sur 'continuer'.")
    .css("margin-right","200px")
    .css("margin-left","200px")
)

//testing - set up canvas and have pics as input - can 
//testing, one right
Template(GetTable("myTable_testing").filter( row => (row.n_correct == 1) & (row.pol == "pos")),
    row => newTrial("testing_1cor",
    newText("Click on any picture corresponding to"+row.word+"?")
    ,
    newImage("target", row.picture)
    .print()
    ,
    newImage("d1", row.p1)
    .print()
    ,
    newImage("d2", row.p2)
    .print()
    ,
    newImage("d3", row.p3)
    .print()
    ,
    newImage("d4", row.p4)
    .print()
    ,
    newImage("d5", row.p5)
    .print()
    ,
    newSelector("shapes_1")
    .add(getImage("target"), getImage("p1"), getImage("p2"), getImage("p3"), getImage("p4"), getImage("p5"))
    .shuffle()
    .frame("solid 6px black")
    //find how to enable muliple selection, check first if it's default
    ,
    //add continue button to validate choice
    
    )

)

newTrial( "bye" ,
    newText("Thank you for your participation!").print(),
    newButton().wait()  // Wait for a click on a non-displayed button = wait here forever
)
.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
