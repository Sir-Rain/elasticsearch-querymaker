const resultSetQuery = {};

const fullTextArr = ['match', 'match_all', 'match_phrase', 'query_string', 'term', 'range'];

const setQuery = function(fullText, keyword, field){

    const checkCorrectQuery = fullTextArr.find(value=> value === fullText);

    if(!checkCorrectQuery){
        throw new Error("setQuery ::: Incorrect Query")
    }

    if(fullText === 'match_all')  resultSetQuery.query.match_all = {};
    if(fullText === 'query_string') resultSetQuery.query.query_string = {
        default_field : field,
        query : keyword
    }
    if(fullText === 'range') return; //todo

    resultSetQuery.query = {
        [fullText] : keyword
    }
    console.log(resultSetQuery)
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
        setQuery
    }
    
}

queryMaker().setQuery("match", "hello");