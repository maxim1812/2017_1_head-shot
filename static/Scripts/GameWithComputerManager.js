"use strict";

// класс для управления игрой в одиночном режиме
export default class GameWithComputerManager{
    // конструктор класса
    // передаём в качестве параметров вспомогательные объекты
    constructor(canvasManager,elementFinder,contentManager, gameResultSaver, isAuthorized){
        this.isAuthorized = isAuthorized;
        this.gameResultSaver = gameResultSaver;
        this.elementFinder = elementFinder;
        this.canvasManager = canvasManager;
        this.contentManager = contentManager;
        this.canvasManager.clearField();
        this.canvasManager.renderMap();
        // переменная - флаг, отвечает за то, закончена ли игра
        this.gameNotStopped = true;
        // переменная для обращения к THIS в блоке holstObj.addEventListener
        let thisManager = this;
        // получаем объект - холст для рисования
        let holstObj = this.elementFinder.getElement("game-with-computer-box__holst-for-paint_cursor-pointer");
        // событие при щелчке по холсту
        holstObj.addEventListener("click",function(event){
            // если игра ещё не закончена
            if(thisManager.gameNotStopped === true) {
                // получаем координаты мыши относительно холста
                const xMouse = event.offsetX;
                const yMouse = event.offsetY;
                // получаем координаты клетки, по которой был осуществлён щелчок
                const xKv = Math.floor(xMouse / 160.0);
                const yKv = Math.floor(yMouse / 160.0);
                console.log(xKv + "  " + yKv);
                // переменная - флаг, отвечает за то, выиграл ли кто-нибудь
                let smbWins = false;
                // получаем номер нажатой клетки по её координатам
                let number = thisManager.getNumberOfKvByCoordinats(xKv, yKv);
                // если данная клетка пока пустая
                if (thisManager.canvasManager.getElementOfMap(number).type === "@") {
                    // записываем в клетку крестик
                    thisManager.canvasManager.setElementOfMap(number, "X");
                    // проверяем, выиграли ли крестики после хода
                    const winKrest = thisManager.isKrestWin();
                    // если крестики победили
                    if (winKrest === true){
                        // выводим содержимое поля игры
                        thisManager.canvasManager.renderMap();
                        // говорим, что игра закончена
                        thisManager.gameNotStopped = false;
                        // выводим результат игры на экран
                        thisManager.renderResult("Игра окончена. КРЕСТИКИ победили.");
                        // сохранение результата игры в БД
                        thisManager.gameResultSaver.saveWin(thisManager.isAuthorized.login);
                        // говорим, что кто-то победил
                        smbWins = true;
                    }else{
                        // если же крестики не победили
                        // ход делают нолики
                        thisManager.enemyMakeHodMove();
                        // выводим содержимое игрового поля
                        thisManager.canvasManager.renderMap();
                        // проверяем, выиграли ли нолики
                        const winZero = thisManager.isZeroWin();
                        // если нолики выиграли
                        if(winZero === true){
                            // говорим, что игра закончена
                            thisManager.gameNotStopped = false;
                            // выводим результат игры на экран
                            thisManager.renderResult("Игра окончена. НОЛИКИ победили.");
                            // сохранение результата игры в БД
                            thisManager.gameResultSaver.saveLose(thisManager.isAuthorized.login);
                            // говорим, что кто-то победил
                            smbWins = true;
                        }
                    }
                }
                // выводим содержимое игрового поля на экран
                thisManager.canvasManager.renderMap();
                // если никто пока не победил
                if(smbWins === false){
                    // если все клетки игрового поля заняты
                    if (thisManager.areAllBusy() === true) {
                        // говорим, что игра закончена
                        thisManager.gameNotStopped = false;
                        // выводим результат игры на экран
                        thisManager.renderResult("Игра окончена. НИЧЬЯ.");
                        // сохранение результата игры в БД
                        thisManager.gameResultSaver.saveNichia(thisManager.isAuthorized.login);
                    }
                }
            }
        });
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

    // метод для вывода результата игры на экран
    renderResult(text){
        // получаем объект, в который будем выводить результат
        let resultElement = this.elementFinder.getElement("game-with-computer-box__game-result_color-blue");
        // инициализируем объект, управляющий содержимым объекта для вывода результата
        this.contentManager.initElement(resultElement);
        // выводим результат
        this.contentManager.setText(text);
    }

    // метод для запуска новой игры
    startNewGame(){
        // очищаем игровое поле
        this.canvasManager.clearField();
        // выводим содержимое игрового поля на экран
        this.canvasManager.renderMap();
        // говорим, что игра НЕ закончена
        this.gameNotStopped = true;
        // очищаем объект для вывода результата игры
        this.renderResult("");
    }

    // метод, который реализует ход компьютера (компьютер играет за НОЛИКИ)
    enemyMakeHodMove(){
        // выполняем блок кода 15 раз
        for(let i = 0; i < 15; i++){
            // выбираем случайный номер клетки
            let randomNumber = parseInt(Math.random() * 9);
            // если клетка пустая
            if(this.canvasManager.getElementOfMap(randomNumber).type === "@"){
                // записываем в клетку нолик
                this.canvasManager.setElementOfMap(randomNumber,"0");
                // выходим из метода
                return;
            }
        }
        // если в предыдущем цикле мы не смогли взять подходящую клетку случайным образом
        // будем искать первую подходящую клетку последовательным перебором
        // пробегаемся по всем клеткам
        for(let i = 0; i < 9; i++){
            // если клетка под номером i пустая
            if(this.canvasManager.getElementOfMap(i).type === "@"){
                // записываем в неё нолик
                this.canvasManager.setElementOfMap(i,"0");
                // выходим из метода
                return;
            }
        }
    }

    // метод для получения типа клетки под номером NUMBER
    getType(number){
        // возвращаем тип клетки
        return this.canvasManager.getElementOfMap(number).type;
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
}
