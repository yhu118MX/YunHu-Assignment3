//Search Word
document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the Default Submit
    searchWord();
    const results = document.getElementById("result")
    results.style.display = "flex"// Show result
});

var pronunciation = "";//pronunciation info holder

//Get info from API and show it
async function searchWord() {
    try{
        const searchTerm = document.getElementById("searchTerm").value;
        const apiUrl = `https://www.dictionaryapi.com/api/v3/references/learners/json/${searchTerm}?key=1e46a0f9-4f0a-4c0e-a401-a04f0d9b560c`;
        const response = await fetch( apiUrl )
        const foobar = await response.json()

        //Get Data
        const word = foobar[0].meta.stems[0]//the word
        //the first letter: const initial = foobar[0].meta.section
        const rawDefinition = foobar[0].meta["app-shortdef"].def[0]//the definition
        const meaning = rawDefinition.replace(/.*?}/g, '')//del the {} content
        pronunciation = foobar[0].hwi.prs[0].sound.audio//the pronunciation

        //Put The Word
        const put_word_here = document.querySelector( '#theword' )
        put_word_here.innerHTML = word

        //Put The Definition
        const put_def_here = document.querySelector( '#explanation' )
        put_def_here.innerHTML = meaning

    } catch( error ) {
        console.log(`Nope:${error}`)
        const boom = document.getElementById("sorry")
        boom.textContent = `Sorry. Try a new word please.`
    }
}

//Merriam-Webster's way to create a source url of word pronunciation
function generateAudioURL(pronunciation) {
    console.log("generateAudioURL")
    const languageCode = 'en'
    const countryCode = 'us'
    const format = 'mp3'
        
    let subdirectory = '';
    if (pronunciation.startsWith('bix')) {
        subdirectory = 'bix';
    } else if (pronunciation.startsWith('gg')) {
        subdirectory = 'gg';
    } else if (pronunciation.match(/^[0-9_]/)) {
        subdirectory = 'number';
    } else {
        subdirectory = pronunciation[0];
    }
console.log(`https://media.merriam-webster.com/audio/prons/${languageCode}/${countryCode}/${format}/${subdirectory}/${pronunciation}.${format}`)
    return `https://media.merriam-webster.com/audio/prons/${languageCode}/${countryCode}/${format}/${subdirectory}/${pronunciation}.${format}`;
}

//Play The Audio
const playAudioButton = document.getElementById('playaudio')
const audio = new Audio()
playAudioButton.addEventListener('click', function() {
    audio.pause( )
    const audioURL = generateAudioURL(pronunciation)
    audio.src = audioURL
    audio.play()
})