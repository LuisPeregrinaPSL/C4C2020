const fs = require('fs');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01'
});

const LANGUAGES = ['es', 'hi', 'de', 'fr', 'zh'];

let TRANSLATION_FILES_PATH = './src/assets/i18n'
let SOURCE_FILE = TRANSLATION_FILES_PATH + '/en.json';

function getStatus(documentId, filePath) {
    console.log('Getting status for ' + documentId)
    languageTranslator.getDocumentStatus({ documentId })
        .then(result => {
            let status = result['result']['status'];
            console.log('Status is ' + status)
            if (status == 'available') {
                downloadFile(documentId, filePath)
            } else {
                setTimeout(getStatus, 1000, documentId, filePath)
            }
        })
        .catch(err => {
            console.log('error:', err);
        });
}

function downloadFile(documentId, filePath) {
    let body = ''
    languageTranslator.getTranslatedDocument({ documentId })
        .then(result => {
            result['result'].on('data', (data) => body += data.toString())
            result['result'].on('end', () => {
                // Translation service adds spaces in handlebars
                body = body.replace(/{ { /g, '{{')
                body = body.replace(/ } }/g, '}}')
                body = body.replace(/{{([0-9]+)}}/g, (a, b) => { return '{{val' + b + '}}' })
                fs.writeFile(filePath, body, err => {
                    if (err) throw new Error(err)
                    console.log('File saved.')
                })
            })
        })
        .catch(err => {
            console.log('error:', err);
        }).finally(() => {
            // Delete the file once it's translated
            languageTranslator.deleteDocument({ documentId })
                .then(result => {
                    console.log('Online document deleted');
                })
                .catch(err => {
                    console.log('error:', err);
                });
        });
}

function clean() {
    languageTranslator.listDocuments()
        .then(result => {
            result['result']['documents'].forEach(document => {
                documentId = document['document_id']
                languageTranslator.deleteDocument({ documentId })
                    .then(result => {
                        console.log('Deleted ' + documentId)
                    })
                    .catch(err => {
                        console.log('error:', err);
                    });
            })
        })
        .catch(err => {
            console.log('error:', err);
        });
}

function main() {
    LANGUAGES.forEach((language, index) => {
        let filePath = TRANSLATION_FILES_PATH + '/' + language + '.json';
        const translateDocumentParams = {
            file: fs.createReadStream(SOURCE_FILE),
            source: 'en',
            target: language,
            filename: 'en.json',
        };
        languageTranslator.translateDocument(translateDocumentParams)
            .then(result => {
                getStatus(result['result']['document_id'], filePath)
            })
            .catch(err => {
                console.log('error:', err);
            });
    });
}

switch (process.argv.slice(2)[0]) {
    case 'clean':
        clean();
        break;
    default:
        main();
}