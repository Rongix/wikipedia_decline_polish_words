const fetch = require('node-fetch')

async function findWordCase(searchItem)  {
    let encodedSearchItem = encodeURI(searchItem);
    let response = await fetch(`https://pl.wiktionary.org/w/index.php?title=Specjalna:Szukaj&limit=1&profile=default&search=${encodedSearchItem}%7D&ns0=1&ns100=1&ns102=1%27`)
    let body = await response.text();
    // console.log(body);

    //link to webpage here
    let expression = /<div(.*?)mw-search-result-heading(.*?)><a href="(?<link>.*?)"/
    let expressionMatch = body.match(expression);
    if(expressionMatch != null || expressionMatch!= undefined){
        var link = expressionMatch.groups['link'];
    } else {
        return null?? null;
    }
    let wordPage = await fetch(`https://pl.wiktionary.org${link}`);
    let wordPageBody = await wordPage.text();
    let expressionTable = /<table(.*?)wikitable odmiana(.*?)>(?<odmiana_tabela>(.*?))<\/table>/
    let odmianaTabeli = wordPageBody.match(expressionTable).groups['odmiana_tabela'];
    let filter = RegExp('<tr(.*?)><td(.*?)><a(.*?)>(?<przypadek>.*?)</a></td><td(.*?)>(?<pojedyncza>.*?)</td>(<td(.*?)>(?<mnoga>.*?)</td>)?</tr>', 'g');
    return [...odmianaTabeli.matchAll(filter)].map(
        x => x.groups
    )
}

// przeszukaj odmiane na głośniki -> jest w l.mnoga mianownik
// search l.mnoga na przypadek: dopelniacz
// jednak lepiej Odmien(slowo: slowo, przypadek: mianownik, liczba: mnoga)...



// declinationTask.then((declination) => 
//     declination.filter(obj => 
//         obj['pojedyncza'] == lookinWord
//         || obj['mnoga'] == lookinWord 
//     )
// ).then(filtered => {
//     console.log(filtered)
// })

async function declinate(word, wordCase, plurality){
    let declination = await findWordCase(word)
    let x = declination.find(obj =>
        obj['przypadek'] == wordCase    
    );
    return x[plurality] ?? x[plurality == 'pojedyncza' ? 'mnoga' : 'pojedyncza']
}

declinate('skrzypce','mianownik','mnoga').then(console.log);

// let odmieniony = Object.fromEntries(
//     Object.entries(declinationTask).map()
// )


// for (let value of Object.values(declination)){
//     alert(value)
// }