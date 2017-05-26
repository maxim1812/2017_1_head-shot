"use strict";

// класс для реализация многопользовательской игры
export default class TwoPlayersGameManager{
    constructor(url,isAuthorized, message, twoPlayersCanvasManager, elementFinder, gameResultSaver){
        let thisManager = this;
        this.elementFinder = elementFinder;
        this.url = url;
        this.isAuthorized = isAuthorized;
        this.message = message;
        this.twoPlayersCanvasManager = twoPlayersCanvasManager;

        this.gameResultSaver = gameResultSaver;
        this.resultOfGame = "";

        this.message.setText("Ожидание соперника ... ");

        this.twoPlayersCanvasManager.clearField();
        this.twoPlayersCanvasManager.renderMap();

        this.socket = new WebSocket(this.url);
        let socket = this.socket;

        this.loginFirst = "";
        this.loginSecond = "";
        this.field = "";
        this.whoIAm = -1;
        let gotFirstMessage = false;

        let holst = this.elementFinder.getElement("two-players-game-box__holst-for-paint_cursor-pointer");
        holst.addEventListener("click", function(){
            if(gotFirstMessage === true && thisManager.whoIAm === thisManager.whoseTurnNow()){
                const xMouse = event.offsetX;
                const yMouse = event.offsetY;
                // получаем координаты клетки, по которой был осуществлён щелчок
                const xKv = Math.floor(xMouse / 160.0);
                const yKv = Math.floor(yMouse / 160.0);
                console.log(xKv + "  " + yKv);
                let number = thisManager.getNumberOfKvByCoordinats(xKv, yKv);
                if (thisManager.twoPlayersCanvasManager.getElementOfMap(number).type === "@") {
                    if(thisManager.whoIAm === 1){
                        thisManager.twoPlayersCanvasManager.setElementOfMap(number,"X");
                    } else {
                        thisManager.twoPlayersCanvasManager.setElementOfMap(number,"0");
                    }
                    thisManager.twoPlayersCanvasManager.renderMap();
                    let myObjContent = {
                        loginFirst: thisManager.loginFirst,
                        loginSecond: thisManager.loginSecond,
                        field: thisManager.twoPlayersCanvasManager.getStringContentOfMap()
                    };
                    let myObj = {
                        type: 2,
                        content: myObjContent
                    };
                    let query = JSON.stringify(myObj);
                    socket.send(query);
                    console.log("Query:  " + query);
                    console.log("Send it");
                }
            }
        });

        this.interval = "";
        this.interval = setInterval(function(){
            let myObj = {
                type: 999
            };
            let query = JSON.stringify(myObj);
            socket.send(query);
            console.log("We sent 999 to Magamed");
        }, 3000);

        socket.onopen = function() {
            console.log("Соединение установлено");
            let myLogin = thisManager.isAuthorized.login;
            let myObj = {
                type: 1,
                content: myLogin
            };
            let query = JSON.stringify(myObj);
            socket.send(query);
        };

        socket.onclose = function(event) {
            console.log('Соединение закрыто');
            clearInterval(thisManager.interval);
            console.log("Result: " + thisManager.resultOfGame);
            if(thisManager.resultOfGame === "WIN"){
                thisManager.gameResultSaver.saveWin(thisManager.isAuthorized.login);
            }
            if(thisManager.resultOfGame === "LOSE"){
                thisManager.gameResultSaver.saveLose(thisManager.isAuthorized.login);
            }
            if(thisManager.resultOfGame === "NICH"){
                thisManager.gameResultSaver.saveNichia(thisManager.isAuthorized.login);
            }
            //thisManager.socket.close();
        };

        socket.onmessage = function(event) {
            if(gotFirstMessage === false) {
                console.log("Получены самое первое сообщение " + event.data);
                gotFirstMessage = true;
                let answer = decodeURIComponent(event.data);
                let myJSON = JSON.parse(answer);
                thisManager.loginFirst = myJSON.loginFirst;
                thisManager.loginSecond = myJSON.loginSecond;
                thisManager.field = myJSON.field;
                if(thisManager.isAuthorized.login === thisManager.loginFirst){
                    thisManager.whoIAm = 1;
                }else{
                    thisManager.whoIAm = 2;
                }
                let messageString = "Игрок " + thisManager.loginFirst + " против игрока " + thisManager.loginSecond + "<br>";
                console.log(thisManager.loginFirst);
                console.log(thisManager.loginSecond);
                console.log(thisManager.field);
                if(thisManager.whoIAm === 1)
                {
                    messageString += "Вы играете за Крестики";
                }else{
                    messageString += "Вы играете за Нолики";
                }
                thisManager.message.setText(messageString);
            } else {
                console.log("Получены сообщение " + event.data);
                let myObj = JSON.parse(event.data);
                let field = myObj.field;

                if(field !== "KREST" && field !== "ZERO" && field !== "NICH") {
                    thisManager.twoPlayersCanvasManager.setStringContentOfMap(field);
                    thisManager.twoPlayersCanvasManager.renderMap();

                    const krestWin = thisManager.isKrestWin();
                    const zeroWin = thisManager.isZeroWin();

                    if (krestWin === true) {
                        thisManager.message.setText("Игра окончена. Победили Крестики.");
                        thisManager.sendGameEnd("KREST");
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "WIN";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "LOSE";
                        }
                        thisManager.socket.close();
                        return;
                    }
                    else if (zeroWin === true) {
                        thisManager.message.setText("Игра окончена. Победили Нолики.");
                        thisManager.sendGameEnd("ZERO");
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "LOSE";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "WIN";
                        }
                        thisManager.socket.close();
                        return;
                    } else if (thisManager.areAllBusy() === true) {
                        thisManager.message.setText("Игра окончена. Ничья.");
                        thisManager.sendGameEnd("NICH");
                        thisManager.resultOfGame = "NICH";
                        thisManager.socket.close();
                        return;
                    }
                }else{
                    if(field === "KREST"){
                        thisManager.message.setText("Игра окончена. Победили Крестики.");
                        clearInterval(thisManager.interval);
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "WIN";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "LOSE";
                        }
                        thisManager.socket.close();
                    }

                    if(field === "ZERO"){
                        thisManager.message.setText("Игра окончена. Победили Нолики.");
                        clearInterval(thisManager.interval);
                        if(thisManager.whoIAm === 1){
                            thisManager.resultOfGame = "LOSE";
                        }
                        if(thisManager.whoIAm === 2){
                            thisManager.resultOfGame = "WIN";
                        }
                        thisManager.socket.close();
                    }

                    if(field === "NICH"){
                        thisManager.message.setText("Игра окончена. Ничья.");
                        clearInterval(thisManager.interval);
                        thisManager.resultOfGame = "NICH";
                        thisManager.socket.close();
                    }
                }
            }
        };

        socket.onerror = function(error) {
            console.log("Ошибка");
            clearInterval(thisManager.interval);
            thisManager.socket.close();
        };
    }

    sendGameEnd(param){
        let thisManager = this;
        let myObjContent = {
            loginFirst: thisManager.loginFirst,
            loginSecond: thisManager.loginSecond,
            field: param
        };
        let myObj = {
            type: 2,
            content: myObjContent
        };
        let query = JSON.stringify(myObj);
        thisManager.socket.send(query);
        console.log("Query:  " + query);
        console.log("Send it");
    }



    whoseTurnNow(){
        let field = this.twoPlayersCanvasManager.getStringContentOfMap();
        let number = 0;
        for(let i = 0; i < field.length; i++){
            if(field.charAt(i) === "@"){
                number++;
            }
        }
        if(number % 2 === 0){
            return 2;
        }
        return 1;
    }


    // метод для получения номера клетки по её координатам
    getNumberOfKvByCoordinats(xKv,yKv){
        // создаём переменную для сохранения ответа
        let answerNumber = 0;
        // создаём строку и сохраняем в неё координаты клетки, которые разделены символом "_"
        const s = xKv + "_" + yKv;
        // в зависимости от значения данной строки получаем номер клетки - ответ
        switch(s){
            case "0_0":
                answerNumber = 0;
                break;
            case "1_0":
                answerNumber = 1;
                break;
            case "2_0":
                answerNumber = 2;
                break;
            case "0_1":
                answerNumber = 3;
                break;
            case "1_1":
                answerNumber = 4;
                break;
            case "2_1":
                answerNumber = 5;
                break;
            case "0_2":
                answerNumber = 6;
                break;
            case "1_2":
                answerNumber = 7;
                break;
            case "2_2":
                answerNumber = 8;
                break;
        }
        // возвращаем номер искомой клетки
        return answerNumber;
    }

    // метод для получения типа клетки под номером NUMBER
    getType(number){
        // возвращаем тип клетки
        return this.twoPlayersCanvasManager.getElementOfMap(number).type;
    }


    // метод для проверки, победи ли Крестики
    isKrestWin(){
        // задаём тип клетки - тип крестик
        let type = "X";
        return this.isManWin(type);
    }

    // метод для проверки, победили ли нолики
    isZeroWin(){
        // задаём тип клетки - тип нолик
        let type = "0";
        return this.isManWin(type);
    }

    isManWin(type){
        let situationWhenWinSmb = [];
        situationWhenWinSmb[0] = (this.getType(0) === type && this.getType(1) === type && this.getType(2) === type);
        situationWhenWinSmb[1] = (this.getType(3) === type && this.getType(4) === type && this.getType(5) === type);
        situationWhenWinSmb[2] = (this.getType(6) === type && this.getType(7) === type && this.getType(8) === type);
        situationWhenWinSmb[3] = (this.getType(0) === type && this.getType(4) === type && this.getType(8) === type);
        situationWhenWinSmb[4] = (this.getType(2) === type && this.getType(4) === type && this.getType(6) === type);
        situationWhenWinSmb[5] = (this.getType(0) === type && this.getType(3) === type && this.getType(6) === type);
        situationWhenWinSmb[6] = (this.getType(1) === type && this.getType(4) === type && this.getType(7) === type);
        situationWhenWinSmb[7] = (this.getType(2) === type && this.getType(5) === type && this.getType(8) === type);
        for(let i = 0; i < situationWhenWinSmb.length; i++){
            if(situationWhenWinSmb[i] === true){
                return true;
            }
        }
        return false;
    }

    // метод для проверки, все ли клетки игрового поля заняты
    areAllBusy(){
        // пробегаемся по всем клеткам игрового поля
        for(let i = 0; i < 9; i++){
            // получаем тип клетки под номером i
            const type = this.getType(i);
            // если данная клетка пустая (типу пустой клетки соответствует значение "@")
            if(type === "@"){
                // возвращаем результат, что НЕ все клетки заняты
                return false;
            }
        }
        // если до этого нас не выкинуло из цикла, это значит, что все клетки заняты
        // возвращаем результат проверки
        return true;
    }
}