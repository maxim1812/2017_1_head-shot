"use strict";

// класс для реализация многопользовательской игры
export default class TwoPlayersGameManager{
    // конструктор
    // инициализация полей класса
    constructor(socketUrl, isAuthorized, twoPlayersMessage, twoPlayersCanvasManager, elementFinder, gameResultSaver){
        this.gameResultSaver = gameResultSaver;
        // адрес сервера
        this.socketUrl = socketUrl;
        // информация об авторизованности пользователя и его логине
        this.isAuthorized = isAuthorized;
        // объект для вывода сообщений
        this.twoPlayersMessage = twoPlayersMessage;
        // объект для реализации рисования клеточного поля на холсте
        this.twoPlayersCanvasManager = twoPlayersCanvasManager;
        // объект для получения элементов
        this.elementFinder = elementFinder;
        // интервал для посылания запросов на поиск соперника
        this.interval = 0;
        // интервал для посылания запросов во время игры с другим пользователем
        this.intervalGame = 0;
        // переменная для хранения информации, закончена ли игра
        this.gameFinished = false;
        // объект сокет
        this.socket = io.connect(this.socketUrl);
        // переменная - флаг, хранит информацию, нашли мы себе соперника, или нет
        this.isEnemyFound = false;
        // добавляем события к сокету
        this.addEventsToSocket();
        // очищаем содержимое игрового поля
        this.twoPlayersCanvasManager.clearField();
        // выводим на экран содержимое игрового поля
        this.twoPlayersCanvasManager.renderMap();
        // информация для хранения номера игрока (1 - игрок за крестики, 2 - игрок за нолики)
        this.numberOfPlayer = -1;
        // объект для обращения к THIS
        let thisManager = this;
        // объект для реализации рисования на холсте
        let canvasManager = this.twoPlayersCanvasManager;
        // получаем объект - холст
        let holstObj = this.elementFinder.getElement("two-players-game-box__holst-for-paint_cursor-pointer");
        // при щелчке по холсту
        holstObj.addEventListener("click",function(event){
            if(thisManager.gameFinished === false) {
                // если игрок - соперник уже найден и игра уже начата, и при этом игра НЕ закончена
                if (thisManager.isEnemyFound === true && thisManager.gameFinished === false) {
                    // получаем количество пустых клеток
                    let numberOfDogs = thisManager.getNumberOfDogs();
                    // переменная, хранящая информацию, чей сейчас ход
                    let whoseHod = 0;
                    // если количество пустых клеток НЕчётное, то ход КРЕСТИКОВ, иначе ход НОЛИКОВ
                    if (numberOfDogs % 2 === 1) {
                        whoseHod = 1;
                    } else {
                        whoseHod = 2;
                    }
                    // получаем координаты мыши относительно холста
                    const xMouse = event.offsetX;
                    const yMouse = event.offsetY;
                    // получаем координаты клетки, по которой кликнули мышкой
                    const xKv = Math.floor(xMouse / 80.0);
                    const yKv = Math.floor(yMouse / 80.0);
                    // получаем номер клетки по её координатам
                    let number = thisManager.getNumberOfKvByCoordinats(xKv, yKv);
                    // если данная клетка пустая
                    if (canvasManager.getElementOfMap(number).type === "@") {
                        // если ход 1-го игрока, и данный игрок является первым
                        if (thisManager.numberOfPlayer === 1 && whoseHod === 1) {
                            // ставим в клетку крестик
                            canvasManager.setElementOfMap(number, "X");
                        }
                        // если ход 2-го игрока, и данный игрок является вторым
                        if (thisManager.numberOfPlayer === 2 && whoseHod === 2) {
                            // ставим в клетку нолик
                            canvasManager.setElementOfMap(number, "0");
                        }
                    }
                    // получаем логин пользователя
                    let login = thisManager.isAuthorized.login;
                    // получаем содержимое клеточного поля
                    let field = thisManager.twoPlayersCanvasManager.getStringContentOfMap();
                    // создаём JSON объект для передачи данных
                    let myObjJSON = {
                        login: login,
                        field: field
                    };
                    // строка - запрос
                    const query = JSON.stringify(myObjJSON);
                    // отсылаем запрос на сервер
                    thisManager.socket.send(query);
                    // выводим содержимое клеточного поля на экран
                    thisManager.twoPlayersCanvasManager.renderMap();
                }
            }
        });

    }

    // метод для для добавления событий к сокету
    addEventsToSocket(){
        // объект для обращения к THIS
        let thisManager = this;
        // при установке соединения с сервером
        this.socket.on('connect', function(){
            console.log("Соединение с сервером установлено.");
        });
        // при получении сообщения с сервера
        this.socket.on('message', function(data) {
            if(thisManager.gameFinished === false) {
                // если соперник ещё не найден
                if (thisManager.isEnemyFound === false) {
                    console.log("Получено сообщение: " + data);
                    // сохраняем полученные данные в объект
                    let myJSON = JSON.parse(data);
                    // получаем переданный массив
                    let arr = myJSON.arr;
                    // переменная для хранения своего логина
                    let yourLogin = "";
                    // переменная для хранения логина соперника
                    let enemyLogin = "";
                    // пробегаемся по всему полученному массиву
                    for (let i = 0; i < arr.length; i++) {
                        // если хоть один логин в записи совпадает с логином данного пользоателя
                        if (arr[i].login1 === thisManager.isAuthorized.login || arr[i].login2 === thisManager.isAuthorized.login) {
                            // если оба логина не пустые
                            if (arr[i].login1 !== "" && arr[i].login2 !== "") {
                                // это означает, что соперник найден
                                thisManager.isEnemyFound = true;
                                // получаем логин соперника и информацию, за кого играет данный пользователь
                                if (thisManager.isAuthorized.login === arr[i].login1) {
                                    thisManager.numberOfPlayer = 1;
                                    yourLogin = arr[i].login1;
                                    enemyLogin = arr[i].login2;
                                } else {
                                    thisManager.numberOfPlayer = 2;
                                    yourLogin = arr[i].login2;
                                    enemyLogin = arr[i].login1;
                                }
                                // выходим из цикла
                                break;
                            }
                        }
                    }

                    // если соперник найден
                    if (thisManager.isEnemyFound === true) {
                        console.log("Найден соперник для игры.");
                        // перестаём посылать запрос на поиск соперника
                        thisManager.stopSendingRequestForFindingEnemy();
                        // выводим иформацию об игре на экран
                        if (thisManager.numberOfPlayer === 1) {
                            thisManager.twoPlayersMessage.setText(yourLogin + " против " + enemyLogin + " (вы играете за Крестики)");
                        } else {
                            thisManager.twoPlayersMessage.setText(yourLogin + " против " + enemyLogin + " (вы играете за Нолики)");
                        }
                        // очищаем игровое поле
                        thisManager.twoPlayersCanvasManager.clearField();
                        // выводим на экран содержимое игрового поля
                        thisManager.twoPlayersCanvasManager.renderMap();
                        // начинаем посылать запросы на обновление и получение содержимого игрового поля
                        thisManager.startSendingGameRequests();
                    }
                }

                // если соперник найден
                if (thisManager.isEnemyFound === true) {
                    // получаем переданный массив
                    let myJSON = JSON.parse(data);
                    let arr = myJSON.arr;
                    // пробегаемся по всему массиву
                    for (let i = 0; i < arr.length; i++) {
                        // если хоть один логин записи совпадает с текущим логином
                        if (arr[i].login1 === thisManager.isAuthorized.login || arr[i].login2 === thisManager.isAuthorized.login) {
                            // при этом оба логина не пустые
                            if (arr[i].login1 !== "" && arr[i].login2 !== "") {
                                // получаем содержимое игрового поля
                                const fieldMap = arr[i].field;
                                // задаём обновлённое содержимое игрового поля
                                thisManager.twoPlayersCanvasManager.setStringContentOfMap(fieldMap);
                                // выводим содержимое игрового поля на экран
                                thisManager.twoPlayersCanvasManager.renderMap();

                                // проверяем, выиграл ли кто-то из игроков
                                let winK = thisManager.isKrestWin();
                                let winZ = thisManager.isZeroWin();
                                // если кто-то из игроков выиграл
                                if (winK === true || winZ === true) {
                                    // говорим, что игра закончена
                                    thisManager.gameFinished = true;
                                    // если победили крестики
                                    if (winK === true) {
                                        thisManager.twoPlayersMessage.setText("Игра закончена. Крестики победили.");
                                        // останавливаем интервал
                                        thisManager.stopSendingGameRequests();
                                        // сохраняем результат игры
                                        if(thisManager.numberOfPlayer === 1){
                                            thisManager.gameResultSaver.saveWin(thisManager.isAuthorized.login);
                                        }else{
                                            thisManager.gameResultSaver.saveLose(thisManager.isAuthorized.login);
                                        }
                                        return;
                                    }
                                    // если победили нолики
                                    if (winZ === true) {
                                        thisManager.twoPlayersMessage.setText("Игра закончена. Нолики победили.");
                                        // останавливаем интервал
                                        thisManager.stopSendingGameRequests();
                                        // сохраняем результат игры
                                        if(thisManager.numberOfPlayer === 2){
                                            thisManager.gameResultSaver.saveWin(thisManager.isAuthorized.login);
                                        }else{
                                            thisManager.gameResultSaver.saveLose(thisManager.isAuthorized.login);
                                        }
                                        return;
                                    }
                                }

                                // проверяем, все ли клетки заняты
                                let allBusy = thisManager.areAllBusy();
                                // если все клетки заняты (при этом никто не выиграл)
                                if (allBusy === true) {
                                    // говорим, что игра закончена
                                    thisManager.gameFinished = true;
                                    thisManager.twoPlayersMessage.setText("Игра закончена. Ничья.");
                                    // останавливаем интервал
                                    thisManager.stopSendingGameRequests();
                                    // сохраняем результат игры
                                    thisManager.gameResultSaver.saveNichia(thisManager.isAuthorized.login);
                                    return;
                                }

                                // выходим из цикла
                                break;
                            }
                        }
                    }
                }
            }
        });

        // при разрыве соединения с сервером
        this.socket.on('disconnect', function(){
            console.log("Соединение с сервером закрыто.");
        });
    }

    // метод для отсылания на сервер информации о том, что игра закончена
    sendQueryFinishGame(){
        let login = this.isAuthorized.login;
        let field = "FINISH";
        let myObjJSON = {
            login: login,
            field: field
        };
        const query = JSON.stringify(myObjJSON);
        this.socket.send(query);
        console.log("Send FINISH to server")
    }

    // получить количество пустых клеток на игровом поле
    getNumberOfDogs(){
        // получаем содержимое игрового поля в виде строки
        const s = this.twoPlayersCanvasManager.getStringContentOfMap();
        // переменная счётчик
        let number = 0;
        // пробегаемся по всей строке
        for(let i = 0; i < s.length; i++){
            const c = s.charAt(i);
            // если клетка пустая
            if(c === "@"){
                // увеличиваем значение счётчика
                number++;
            }
        }
        // возвращаем результат подсчёта
        return number;
    }

    // посылание запроса на обновление игрового поля
    startSendingGameRequests(){
        // объект для доступа к сокету
        let socket = this.socket;
        // объект для доступа к THIS
        let thisManager = this;
        // циклический вызов функции
        this.intervalGame = setInterval(function(){
            // получаем логин
            let login = thisManager.isAuthorized.login;
            // получаем содержимое игрового поля
            let field = thisManager.twoPlayersCanvasManager.getStringContentOfMap();
            // объект для передачи данных
            let myObjJSON = {
                login: login,
                field: field
            };
            // создаём строку - запрос
            const query = JSON.stringify(myObjJSON);
            console.log("_ _ _ Game Interval Works _ _ _");
            // посылаем запрос на сервер
            socket.send(query);
        }, 500);
    }

    // остановка отправки запросов на получение содержимого игрового поля
    stopSendingGameRequests(){
        clearInterval(this.intervalGame);
        console.log("_ _ _ Game Interval Stopped _ _ _");

        let thisManager = this;
        this.count = 0;
        this.intervalForWaiting = setInterval(function(){
            thisManager.count++;
            console.log("Wait ...");
            if(thisManager.count === 4){
                thisManager.sendQueryFinishGame();
                clearInterval(thisManager.intervalForWaiting);
                console.log("Waiting interval is DELETED");
            }
        }, 500);
    }

    //  посылание запроса на поиск соперника
    startSendingRequestsForFindingEnemy(){
        // получаем свой логин
        let login = this.isAuthorized.login;
        // объект для передачи данных
        let myObjJSON = {
            login: login,
            field: ""
        };
        // объект для доступа к сокету
        let socket = this.socket;
        // создаём строку - запрос
        let query = JSON.stringify(myObjJSON);
        // циклический вызов функции
        this.interval = setInterval(function(){
            // посылаем запрос на сервер
            socket.send(query);
            console.log("________ Interval works _______");
        }, 500);
    }

    // остановка отправки запросов на поиск соперника
    stopSendingRequestForFindingEnemy(){
        clearInterval(this.interval);
        console.log("________ Clear Interval _______");
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