"use strict";

// класс роутер для эмуляции истории переходов
export default class Router{
    // конструктор класса
    // передаём в качестве параметров вспомогательные объекты
    constructor(textFieldCleaner,boxRender,messageBox,isAuthorized){
        // инициализируем поля класса
        this.textFieldCleaner = textFieldCleaner;
        this.boxRender = boxRender;
        this.messageBox = messageBox;
        this.isAuthorized = isAuthorized;
        // переменная, чтобы обращаться к THIS внутри блока window.addEventListener
        let routerThis = this;
        // добавляем событие при изменении адресной строки
        window.addEventListener("popstate", function(){
            // вызываем метод осуществления перехода между блоками
            routerThis.moveToPage();
        });
    }

    // осуществление перехода между боксами
    moveToPage(){
        // очищаем содержимое текстовых полей и бокса для вывода сообщений
        this.textFieldCleaner.clearAllTextFields();
        // очищаем окно для вывода сообщений
        this.messageBox.clear();
        // сохраняем содержимое адресной строки
        const pathname = window.location.pathname;
        // в зависимости от содержимого адресной строки показываем разные боксы
        switch(pathname){
            // для блока авторизации
            case "/avt":
                this.boxRender.showBox("authorization-box");
                break;
            // для блока регистрации
            case "/reg":
                this.boxRender.showBox("check-in-box");
                break;
            // для блока приветствия
            case "/":
                this.boxRender.showBox("welcome-box");
                break;
            // для блока приветствия
            case "":
                this.boxRender.showBox("welcome-box");
                break;
            // для блока своего профиля
            case "/profile":
                this.boxRender.showBox("my-profile-box");
                break;
            // для блока игры с компьютером (одиночной игры)
            case "/game_with_computer":
                this.boxRender.showBox("game-with-computer-box");
                break;
            // для блока просмотра своих результатов
            case "/my_results":
                this.boxRender.showBox("results-of-user-box");
                break;
            // для блока просмотра достижений самых успешных игроков
            case "/top_of_players":
                this.boxRender.showBox("best-users-results-box");
                break;
            // для блока многопользовательской игры
            case "/two_players_game":
                this.boxRender.showBox("two-players-game-box");
                break;
        }

        // создаём массив страниц, которые могут быть открыты, только если пользователь авторизован
        let arrOfPages = ["/profile","/game_with_computer","/my_results","/top_of_players","/two_players_game"];

        // если пользователь ещё не авторизован
        if(this.isAuthorized.flag === false){
            // сохраняем длину массива, хранящего страницы, которые могут быть открыты, только если пользователь авторизован
            let length = arrOfPages.length;
            // пробегаемся по данному массиву
            for(let i = 0; i < length; i++){
                // если адресная строка совпадает с содержимым ячейки массива
                if(window.location.pathname === arrOfPages[i]){
                    // это означает, что НЕавторизованный пользователь пытается попасть на страницу, которую можно посещать только будучи авторизованным
                    // перекидываем пользователя на страницу авторизации
                    this.setPathName("/avt");
                    return;
                }
            }
        }
    }

    // добавляем переход в историю и меняем бокс
    setPathName(pathname){
        // добавляем переход в историю
        history.pushState({}, "" ,pathname);
        // показываем определённый бокс
        this.moveToPage();
    }
}