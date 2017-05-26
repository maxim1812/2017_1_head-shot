"use strict";

// класс для получения информации о игроках с самыми лучшими результатами
export default class TopOfPlayersResultsGetter{
    // конструктор
    // инициализация полей класса
    constructor(url,contentManager){
        this.url = url;
        this.contentManager = contentManager;
        this.count = 3;
    }

    // метод для отправки запроса и получении информации о лучших игроках
    getInformationAboutBestUsers(){
        // переменная для доступа к THIS в блоке onreadystatechange
        let thisManager = this;
        // создание строки - запроса
        const query = this.url + "stats/" + this.count;
        // отпраляем запрос на сервер
        let request = new XMLHttpRequest();
        let url = query;
        request.open("GET",url, true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send(null);
        let styleString = "<style>td{padding-top: 10px; padding-bottom: 10px; padding-left: 15px; padding-right: 15px;}</style> ";
        let answerTable = styleString + "<table border = '1px'>";
        answerTable += ("<tr> <td><b>Логин</b></td>  <td><b>Разность побед и поражений</b></td> </tr>");
        // при получении ответа с сервера
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                // сохраняем полученные данные в строку
                const answerContent = request.responseText;

                let obj = JSON.parse(answerContent);
                let arr = obj.userProfiles;
                let n = arr.length;
                for(let i = 0; i < n; i++){
                    let username = arr[i].username;
                    let email = arr[i].email;
                    let wins = arr[i].wins;
                    let losses = arr[i].losses;
                    let draws = arr[i].draws;
                    answerTable += ("<tr>");
                    answerTable += ("<td>" + username + "</td>");
                    //answerTable += ("<td>" + email + "</td>");
                    //answerTable += ("<td>" + wins + "</td>");
                    //answerTable += ("<td>" + losses + "</td>");
                    //answerTable += ("<td>" + draws + "</td>");
                    answerTable += ("<td>" + (parseInt(wins) - parseInt(losses)) + "</td>");
                    answerTable += ("</tr>");
                }
                answerTable += "</table>";
                // вызываем метод вывода данных на экран
                thisManager.printInformationAboutBestUsers(answerTable);
            }
        }
    }

    // метод вывода данных на экран
    printInformationAboutBestUsers(contentText){
        // очищаем блок для вывода данных
        this.contentManager.clear();
        // записываем в блок для вывода данных информацию о лучших игроках
        this.contentManager.setText(contentText);
    }

    // метод для получения информации о лучших игроках и её вывод на экран
    getInfoAboutBestUsersAndRenderIt(){
        this.getInformationAboutBestUsers();
    }
}
