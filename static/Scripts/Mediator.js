"use strict";

// подключем вспомогательные модули
import BoxRender from "./BoxRender.js";
import ElementFinder from "./ElementFinder.js";
import ContentManager from "./ContentManager.js";
import StringController from "./StringController.js";
import AuthorizationControl from "./AuthorizationControl.js";
import CheckIn from "./CheckIn.js";
import TextFieldsCleaner from "./TextFieldsCleaner.js";
import Router from "./Router.js";
import CanvasManager from "./CanvasManager.js";
import GameWithComputerManager from "./GameWithComputerManager.js";
import GameResultSaver from "./GameResultSaver.js";
import UserResultsGetter from "./UserResultsGetter.js";
import HelloToServer from "./HelloToServer.js";
import TopOfPlayersResultsGetter from "./TopOfPlayersResultsGetter.js";
import TwoPlayersGameManager from "./TwoPlayersGameManager.js";
import ScreenManager from "./ScreenManager.js";


// класс для управления взаимодействием между модулями
class Mediator{
    // конструктор
    // инициализация полей класса
    constructor(){
        // строка для хранения адреса сервера (для авторизации и регистрации)
        // this.url = "http://localhost/MaximGameScripts/";
        // this.url = "http://prokm.ru/MaximGameScripts/";
		this.url = "http://dnoteam.herokuapp.com/api/DB/";

		
        // строка для хранения адреса сервера для организации многопользовательской игры
        // this.socketUrl = "http://localhost:4000/";
        this.socketUrl = "ws://dnoteam.herokuapp.com/game";

        // объект, отвечающий за то, авторизован ли пользователь
        this.isAuthorized = {
            flag: false,
            login: ""
        };
        // создание полей класса
        this.gameResultSaver = new GameResultSaver(this.url);
        this.boxRender = new BoxRender();
        this.elementFinder = new ElementFinder();
        this.message = new ContentManager();
        this.stringController = new StringController();
        this.authorizationControl = new AuthorizationControl(this.elementFinder,this.stringController,this.message,this.boxRender);
        this.checkIn = new CheckIn(this.elementFinder,this.stringController,this.message);
        this.textFieldsCleaner = new TextFieldsCleaner(this.elementFinder);
        this.router = new Router(this.textFieldsCleaner,this.boxRender,this.message,this.isAuthorized);
        this.twoPlayersCanvasManager = new CanvasManager(this.elementFinder,"two-players-game-box__holst-for-paint_cursor-pointer");
        this.canvasManager = new CanvasManager(this.elementFinder,"game-with-computer-box__holst-for-paint_cursor-pointer");
        this.gameWithComputerManager = new GameWithComputerManager(this.canvasManager,this.elementFinder, new ContentManager(), this.gameResultSaver, this.isAuthorized);

        let userResultsList = new ContentManager();
        userResultsList.initElement(this.elementFinder.getElement("results-of-user-box__list-of-user-results_color-blue"));
        this.userResultsGetter = new UserResultsGetter(userResultsList, this.url);

        let bestUsersResultList = new ContentManager();
        bestUsersResultList.initElement(this.elementFinder.getElement("best-users-results-box__results-list"));
        this.TopOfPlayersResultsGetter = new TopOfPlayersResultsGetter(this.url, bestUsersResultList);

        this.twoPlayersMessage = new ContentManager();
        this.twoPlayersMessage.initElement(this.elementFinder.getElement("two-players-game-box__message-text_color-blue"));
    }

    // отправка проверочного запроса
    sendHelloToServer(){
        this.helloToServer = new HelloToServer(this.url);
        this.helloToServer.sendHello();
    }

    // метод для добавление тектовых полей в объект, отвечающий за их очистку
    addAllTextFields(){
        this.textFieldsCleaner.addTextField("authorization-box__login-field_black-shadow");
        this.textFieldsCleaner.addTextField("authorization-box__password-field_black-shadow");
        this.textFieldsCleaner.addTextField("check-in-box__login-field_black-shadow");
        this.textFieldsCleaner.addTextField("check-in-box__password-field_black-shadow");
    }

    // метод для запуска игры против компьютера
    startOnePlayerGame(){
        this.gameWithComputerManager.startNewGame();
    }

    // метод для вывода на экран содержимого игрового поля
    renderCanvasHolst(){
        this.canvasManager.renderMap();
    }

    // метод для добавления всех страниц - боксов в объект, отвечающий за их скрытие и показ
    addAllBoxes(){
        this.boxRender.addBox("welcome-box");
        this.boxRender.addBox("authorization-box");
        this.boxRender.addBox("check-in-box");
        this.boxRender.addBox("my-profile-box");
        this.boxRender.addBox("game-with-computer-box");
        this.boxRender.addBox("results-of-user-box");
        this.boxRender.addBox("best-users-results-box");
        this.boxRender.addBox("two-players-game-box");
    }

    // определение страницы (бокса), на котором сейчас находится пользователь
    definePage(){
        this.router.moveToPage();
    }

    // замена содержимого адресной строки и переход на соответствующий бокс
    changePathName(pathname){
        this.router.setPathName(pathname);
    }

    // инициализация бокса, отвечающего за вывод сообщений на экран
    initMessageTextRender(){
        this.message.initElement(this.elementFinder.getElement("message-box__text-of-message_blue"));
        this.message.clear();
    }

    // показать бокс с определённым классом
    showBoxElement(boxClass){
        this.boxRender.showBox(boxClass);
    }

    // метод авторизации пользователя
    authorizeUser(){
        this.authorizationControl.authorize(this.url,this.router,this.isAuthorized);
    }

    // метод регистрации пользователя
    checkInUser(){
        this.checkIn.registrate(this.url);
    }

    // метод для добавления событий к кнопкам
    addListenersToButtons() {
        let mediatorThis = this;

        let avtBtn = this.elementFinder.getElement("welcome-box__sign-in-button_DeepSkyBlue-color");
        avtBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/avt");
        });

        let regBtn = this.elementFinder.getElement("welcome-box__check-in-box-button_DeepSkyBlue-color");
        regBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/reg");
        });

        let avtBackBtn = this.elementFinder.getElement("authorization-box__back-button_DeepSkyBlue-color");
        avtBackBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/");
        });

        let regBackBtn = this.elementFinder.getElement("check-in-box__back-button_DeepSkyBlue-color");
        regBackBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/");
        });

        let avtUserBtn = this.elementFinder.getElement("authorization-box__sign-in-button_DeepSkyBlue-color");
        avtUserBtn.addEventListener("click", function() {
            mediatorThis.authorizeUser();
        });

        let checkInUserBtn = this.elementFinder.getElement("check-in-box__registration-button_DeepSkyBlue-color");
        checkInUserBtn.addEventListener("click", function() {
            mediatorThis.checkInUser();
        });

        let exitFromProfileBtn = this.elementFinder.getElement("my-profile-box__exit-button_DeepSkyBlue-color");
        exitFromProfileBtn.addEventListener("click", function() {
            const query = mediatorThis.url + "auth/signOut";
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("GET",query);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            request.send(null);

            mediatorThis.isAuthorized.flag = false;
            mediatorThis.isAuthorized.login = "";
            mediatorThis.changePathName("/");
        });

        let gameWithComputerBtn = this.elementFinder.getElement("my-profile-box__play-with-computer-button_DeepSkyBlue-color");
        gameWithComputerBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/game_with_computer");
            mediatorThis.startOnePlayerGame();
        });

        let myResultsBtn = this.elementFinder.getElement("my-profile-box__my-results-button_DeepSkyBlue-color");
        myResultsBtn.addEventListener("click", function() {
            mediatorThis.changePathName("/my_results");
            mediatorThis.userResultsGetter.writeResultsOfUser(mediatorThis.isAuthorized.login);
        });

        let goToMainMenuBtn = this.elementFinder.getElement("results-of-user-box__go-to-main-menu-button_DeepSkyBlue-color");
        goToMainMenuBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/profile");
        });

        let showResultsOfBestPlayersBtn = this.elementFinder.getElement("my-profile-box__best-players-button_DeepSkyBlue-color");
        showResultsOfBestPlayersBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/top_of_players");
            mediatorThis.TopOfPlayersResultsGetter.getInfoAboutBestUsersAndRenderIt();
        });

        let moveToMainMenuBtn = this.elementFinder.getElement("best-users-results-box__go-to-main-menu-button_DeepSkyBlue-color");
        moveToMainMenuBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/profile");
        });

        let gameWithAnotherPlayerBtn = this.elementFinder.getElement("my-profile-box__play-with-user-button_DeepSkyBlue-color");
        gameWithAnotherPlayerBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/two_players_game");
            mediatorThis.twoPlayersGameManager = new TwoPlayersGameManager(mediatorThis.socketUrl,mediatorThis.isAuthorized, mediatorThis.twoPlayersMessage, mediatorThis.twoPlayersCanvasManager, mediatorThis.elementFinder, mediatorThis.gameResultSaver);
        });
    }
}

// создание экземпляра класса медиатор
let mediator = new Mediator();

// при загрузке страницы
window.addEventListener("load", function(){
    mediator.addAllBoxes();
    mediator.addAllTextFields();
    mediator.addListenersToButtons();
    mediator.initMessageTextRender();
    mediator.definePage();
    mediator.renderCanvasHolst();
    mediator.sendHelloToServer();

    let screenManager = new ScreenManager();
});
