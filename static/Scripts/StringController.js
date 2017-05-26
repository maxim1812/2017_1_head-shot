"use strict";

// класс, который проверяет, может ли данная строка быть логином или паролем
export default class StringController{
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
	
	isNormalEmail(str){
        if(str.length === 0){
            return "EMPTY";
        }
		if (str.indexOf("@") === -1){
			return "NO_CORRECT";
		}
		return "OK";
	}
}