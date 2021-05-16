var width = 600,  //viewBox width in px
    height = 600, //viewBox height in px
    nObjects = 10,  //number of objects to draw that will be cloned
    nQuestObjects = 4, //number of unique objective objects to draw
    timeLimit = 10,    //total time in seconds between objects finds
    gameboard = document.getElementById("gameboard"), //the SVG #1
    clonedboard = document.getElementById("clonedboard"), //the SVG #2
    timer = document.getElementById("timer"), //display for time remaining
    scoreboard = document.getElementById("scoreboard"), //display scoreboard
    svgNS = gameboard.namespaceURI;

var score = 0, //number of pieces found so far 
    timerInterval, //update time
    last5seconds, //no time left alert
    timeLeft; //time left until end game

menu();

function menu(){
    document.getElementById("menu_text").innerHTML = "Appuyez sur \'JOUER\' pour demarrer"; //adds menu text
    document.getElementById("menu_trigger").addEventListener("click", gamestart); //waits for click on menu button    
    document.getElementById("menu_options").addEventListener("click", options); //waits for click on menu button
}

function options(){
    var form = document.createElement("form");
    form.setAttribute("action","javascript:applyOptions()");

    var return_line_br = document.createElement("br"); //Skip to next line between each options

    /*  Label for the Width Option */
    var labelWidth = document.createElement("label");
    labelWidth.setAttribute("for","width_options");
    labelWidth.innerHTML = "Largeur du plateau de jeu: ";
    /* Input for width option */
    var inputWidth = document.createElement("input");
    inputWidth.setAttribute("type","text");
    inputWidth.setAttribute("id","width_options");
    inputWidth.setAttribute("name","width_options");
    form.appendChild(labelWidth);
    form.appendChild(inputWidth);
    form.appendChild(return_line_br);

    /*Label for height*/
    var labelHeight = document.createElement("label");
    labelHeight.setAttribute("for","height_options");
    labelHeight.innerHTML = "Hauteur du plateau de jeu: ";
    /*input for height*/
    var inputHeight = document.createElement("input");
    inputHeight.setAttribute("type","text");
    inputHeight.setAttribute("id","height_options");
    inputHeight.setAttribute("name","height_options");
    form.appendChild(labelHeight);
    form.appendChild(inputHeight);
    form.appendChild(return_line_br.cloneNode(true)); //return to line cloned element

    /*label for nObjects (number of objects on image that are non-clickable*/
    var label_nObjects = document.createElement("label");
    label_nObjects.setAttribute("for","nObjects_options");
    label_nObjects.innerHTML = "Nombres d'objets de fond: ";
    /*input for nObjects*/
    var input_nObjects = document.createElement("input");
    input_nObjects.setAttribute("type","text");
    input_nObjects.setAttribute("id","nObjects_options");
    input_nObjects.setAttribute("name","nObjects_options");
    form.appendChild(label_nObjects);
    form.appendChild(input_nObjects);
    form.appendChild(return_line_br.cloneNode(true)); //return to line cloned

    /*label for nQuestObjects (number of objects to be found)*/
    var label_nQuestObjects = document.createElement("label");
    label_nQuestObjects.setAttribute("for","nQuestObjects_options");
    label_nQuestObjects.innerHTML = "Nombre d'objets à trouver: ";
    /*input for nQuestObjects*/
    var input_nQuestObjects = document.createElement("input");
    input_nQuestObjects.setAttribute("type","text");
    input_nQuestObjects.setAttribute("id","nQuestObjects_options");
    input_nQuestObjects.setAttribute("name","nQuestObjects_options");
    form.appendChild(label_nQuestObjects);
    form.appendChild(input_nQuestObjects);
    form.appendChild(return_line_br.cloneNode(true)); //cloned return to line

    /*label for TimeLimit*/
    var labelTimeLimit = document.createElement("label");
    labelTimeLimit.setAttribute("for","timeLimit_options");
    labelTimeLimit.innerHTML = "Temps entre chaque objet (en secondes): "
    /*input for TimeLimit*/
    var inputTimeLimit = document.createElement("input");
    inputTimeLimit.setAttribute("type","text");
    inputTimeLimit.setAttribute("id","timeLimit_options");
    inputTimeLimit.setAttribute("name","timeLimit_options");
    form.appendChild(labelTimeLimit);
    form.appendChild(inputTimeLimit);
    form.appendChild(return_line_br.cloneNode(true)); //cloned return to line

    /* Creates and appends the submit button that'll apply settings*/
    var submit_button = document.createElement("input");
    submit_button.setAttribute("type","submit");
    submit_button.setAttribute("value","Apply");
    form.appendChild(submit_button);

    /* Apends form to the Div id="menu  " to make it appear*/
    var div_menu = document.getElementById("menu");
    div_menu.appendChild(form);
}

/*Applies user input settings to the game*/
function applyOptions(){
    width = parseInt(document.getElementById("width_options").value);  //viewBox width in px
    height = parseInt(document.getElementById("height_options").value); //viewBox height in px
    nObjects = parseInt(document.getElementById("nObjects_options").value);  //number of objects to draw that will be cloned
    nQuestObjects = parseInt(document.getElementById("nQuestObjects_options").value); //number of unique objective objects to draw
    timeLimit = parseInt(document.getElementById("timeLimit_options").value);    //total time in seconds between objects finds
}


function gamestart(){ //function to start the game
    document.getElementById("menu").remove(); //remove text and button leaving blank page
    resizeSvgElement(gameboard); //makes the svg elements appear on screen
    resizeSvgElement(clonedboard);
    createShapes(gameboard, "non-clickable", nObjects); //launches next phase of the game

    /* Copies all shapes from gameboard to clonedboard */
    cloneGameboardShapes = gameboard.cloneNode(true);
    clonedboard.appendChild(cloneGameboardShapes);
    document.getElementById("instructions").innerHTML = 'Trouver les <span style="color: red">' + nQuestObjects + '</span> objets en trop dans le plateau bleu'

    /*Makes objects to be found*/

    createShapes(clonedboard,"clickable", nQuestObjects);
    clonedboard.addEventListener("mouseup", checkClick); //executes checkClick when mouse is clicked

    /* Timer and stuff*/
    timeLeft = timeLimit*1000; //sets time to 10s
    timerInterval = setInterval(updateTime, 100);
    updateScore();
    gameboard.addEventListener("mouseup", checkClick);

    last5seconds = false; //sets timer alert to false


}

function resizeSvgElement(board){    //makes svg element visible instead of 0px as default per html line
    board.setAttribute("width",width+"px");
    board.setAttribute("height",height+"px");
}

function createShapes(board, clickOrNot, number){
    for(var i=0; i<number; i++){
        if(i<number){createCircles(board, clickOrNot, 1);} //checks if there's still place for 1 circle to be created
                                                            // if yes, it creates it.
        i++;

        if(i<number){createRectangles(board, clickOrNot, 1);} //same for rectangles
        i++;

        if(i<number){createEllipses(board, clickOrNot, 1);} //same for ellipses

        //createPolygons(board); // !!! Je n'ai pas compris comment générer des polygones en pos aléatoires !!!
    }
}

function createCircles(board, clickOrNot, number){ 
    board.setAttribute("viewBox", [0,0,width,height]);
    for (var i=0; i<number; i++) {
        var circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("class", clickOrNot);
        var r = parseInt((Math.random() * (50-20) + 20 )) //r between 20 and 50    
        circle.setAttribute("stroke", "black")    
        circle.setAttribute("r", r); //size
        circle.setAttribute("fill", randomColor() );
        circle.setAttribute("cx", Math.random()*width); //position inside the box
        circle.setAttribute("cy", Math.random()*height);
        board.appendChild(circle);
    }
}

function createRectangles(board, clickOrNot, number){ 
    board.setAttribute("viewBox", [0,0,width,height]);
    for (var i=0; i<number; i++) {
        var rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("class", clickOrNot);
        var w = parseInt((Math.random() * (70-40) + 40 )) //width between 40 and 70
        var h = parseInt((Math.random() * (70-40) + 40 )) //height between 40 and 70
        rect.setAttribute("stroke", "black")
        rect.setAttribute("width", w); //size between 40 and 70
        rect.setAttribute("height", h); //size between 40 and 70
        rect.setAttribute("fill", randomColor() );
        rect.setAttribute("x", Math.random()*width); //position inside the box
        rect.setAttribute("y", Math.random()*height);
        board.appendChild(rect);
    }
}

function createEllipses(board, clickOrNot, number){ 
    board.setAttribute("viewBox", [0,0,width,height]);
    for (var i=0; i<number; i++) {
        var ellip = document.createElementNS(svgNS, "ellipse");
        ellip.setAttribute("class", clickOrNot);
        var rx = parseInt((Math.random() * (50-30) + 30 )) //rx between 30 and 50
        var ry = parseInt((Math.random() * (50-30) + 30 )) //ry between 30 and 50
        ellip.setAttribute("stroke", "black")
        ellip.setAttribute("rx", rx);
        ellip.setAttribute("ry", ry);
        ellip.setAttribute("fill", randomColor() );
        ellip.setAttribute("cx", Math.random()*width); //position inside the board
        ellip.setAttribute("cy", Math.random()*height);
        board.appendChild(ellip);
    }
}


/* Imported random colors function from the web */
function randomColor() {
    /* returns a random color with at least 50% saturation
       and 50-80% lightness (for drawing on dark background) */
    var hue = Math.random()*360,
        sat = 50 + Math.random()*50,               
        light = 50 + Math.random()*30;
    return "hsl(" + hue+"," + sat+"%," + light+"% )";
}

/*Checks if the clicked object is clickable or not*/
function checkClick(event) {
    var element = event.target.correspondingUseElement || event.target;
    if (element.getAttribute("class")=="clickable") {     
        element.setAttribute("class", "clicked");
        nQuestObjects--;    
        score++;
        timeLeft = 10000; //sets time left to 10s when object is found
        timer.removeAttribute("aria-live"); //removes red color
        last5seconds=false;
        updateScore();
        /*Win condition*/
        if(nQuestObjects <= 0){
            scoreboard.classList.add("win"); //sets scoreboard green for the win
            document.getElementById("result").innerHTML = "Vous avez gagné, bien joué!"
            document.getElementById("result").classList.add("win");
            endGame();
        }
    }
}

/*End of the game*/
function endGame() {
    clearInterval(timerInterval);
    clonedboard.removeEventListener("mouseup", checkClick);   
    document.documentElement.setAttribute("class", "game-over"); //notifies that the game is over to css
    document.getElementById("instructions").remove() //removes the useless line for more space
}

function updateTime() {
    timeLeft = timeLeft - 100;
    if (timeLeft <= 0) {
        scoreboard.classList.add("lose"); //sets scoreboard to red because the game is lost
        document.getElementById("result").innerHTML = "Vous avez perdu, dommage!"
        document.getElementById("result").classList.add("lose");
        endGame();                                         
        timeLeft = 0;
        timer.removeAttribute("aria-live"); //remove red color
    }
    if ((!last5seconds)&&(timeLeft <= 5000)) { 
        //less than 5 seconds left
        timer.setAttribute("aria-live", "polite"); //allows the red timer to work
        last5seconds = true;
    }
    timer.innerHTML = (timeLeft/1000).toFixed(1);
    //timer.textContent = (timeLeft/1000).toFixed(1);
}
function updateScore() {
    scoreboard.textContent = score.toFixed(0);
}
