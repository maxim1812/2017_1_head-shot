"use strict";

// класс, который проверяет, может ли данная строка быть логином или паролем
export default class StringController{
    // проверка, является ли символ маленькой буквой, нижним подчёркиванием или цифрой
    /*
    isNormalChar(c){
        // создаём строку, содержащую все корректные для логина и пароля символы
        const normalChars = "abcdefghijklmnopqrstuvwxyz_0123456789";
        // проверяем содержится ли символ С в строке корректных символов
        let number = normalChars.indexOf(c);
        // возвращаем результат проверки
        return number !== -1;
    }
    */

    /*
    // проверка, пуста ли строка и содержит ли строка запретные символы
    isNormalString(s){
        // проверяем строку на пустоту
        if(s.length === 0){
            // возвращаем результат проверки
            return "EMPTY";
        }
        // пробегаемся по всем символам строки
        for(let i = 0; i < s.length; i++){
            // берём символ строки под номером i
            const c = s.charAt(i);
            // если данный символ не корректен, то и строка тоже не корректна
            if(this.isNormalChar(c) === false){
                // возвращаем результат
                return "NO_CORRECT";
            }
        }
        // если строка не пуста, и оне не содержит запретных симвлов, то она прошла проверку успешно
        return "OK";
    }
    */

    isNormalString(s){
        let allLength = s.length;
        if(allLength === 0){
            return "EMPTY";
        }
        let charArr = s.match(/[a-z]/g);
        let numberArr = s.match(/[0-9]/g);
        let charLen = 0;
        let numberLen = 0;
        if(charArr !== null){
            charLen = charArr.length;
        }
        if(numberArr !== null){
            numberLen = numberArr.length;
        }
        if(charLen + numberLen !== allLength){
            return "NO_CORRECT";
        }
        return "OK";
    }
}