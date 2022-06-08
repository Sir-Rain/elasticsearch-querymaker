const resultSetQuery = {};


const fullTextArr = ['match', 'match_all', 'match_phrase', 'query_string', 'term', 'range'];
const boolArr = ['must', 'must_not', 'should', 'filter'];

let tempBool = null;

/* 타입체커 obj의 기본 값으로 resultSetQuery 사용. */
const typeChecker = function(obj, checkString){
    for (key in obj){
        if (key === checkString){
            return true
        }
        if (typeof obj[key] == 'object'){
            return typeChecker(obj[key], checkString)
        }
    }
    return false
}

const end = function(){
    console.dir(resultSetQuery);
    return resultSetQuery;
}

const setRangeQuery = function(rangeObj){

    if(!rangeObj || typeof rangeObj !== 'object' ){
        return new Error("Incorrect rangeObj");
    }

    const range = ["field", "gt", "gte", "lt", "lte"]

    for(const key in rangeObj){
        const checkCorrectRange = range.find(value => value === key);

        if(!checkCorrectRange){
            return new Error("Incorrect Range Field");
        }
    }
    
    resultSetQuery.query.range = {
        [rangeObj.field] : {
            ...rangeObj
        }
    }

    return {end}
}

const setQuery = function(fullText, keyword, field){

    const checkCorrectQuery = fullTextArr.find(value=> value === fullText);

    if(!checkCorrectQuery){
        throw new Error("setQuery ::: Incorrect Query")
    }

    let tempFullTextQuery =  {};
    if(fullText === 'match_all') tempFullTextQuery.match_all = {};
    else if(fullText === 'match_phrase'){
        tempFullTextQuery.match_pharse = {
            [field] : keyword
        };
    }
    else if(fullText === 'query_string') tempFullTextQuery.query_string = {
        default_field : field,
        query : keyword
    }
    else tempFullTextQuery = {
        [fullText] : keyword
    }

    if(typeChecker(resultSetQuery, "bool")){
        resultSetQuery.query.bool[tempBool].push(tempFullTextQuery[fullText])
    }else{
        resultSetQuery.query = tempFullTextQuery[fullText];
    }


    return{
        end
    }
}

const setBool = function(boolQuery){

    const checkCorrectBool = boolArr.find(value=> value === boolQuery);

    if(!checkCorrectBool){
        throw new Error("setBool ::: Incorrect Bool")
    }

    tempBool = boolQuery;

    resultSetQuery.query.bool = {
        [boolQuery] : []
    }
    return{
        setQuery,
        end
    }
}

const queryMaker = function (from, size) {
    //사이즈가 0일 떄 입력 방법을 확실히
    if (typeof from === 'number' && from >= 0 ) {
        resultSetQuery.from = from;
    }
  
    if (typeof size === 'number' && from >= 0 ) {
        resultSetQuery.size = size;
    }

    resultSetQuery.query = {};

    return {
        setQuery,
        setBool,
        setRangeQuery
    }
    
}

const testQ = {
    "field" : "testField",
    "gt" : "test",
    "lt" : "bye"
}

queryMaker().setRangeQuery(testQ).end();