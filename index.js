const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv');
// import xml2js Module
var parseString = require('xml2js').parseString; 

dotenv.config()

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: 'EasyBot'
})

        bot.on('start', () => {
            const params = {
                icon_emoji: ':robot_face:'
            }

            bot.postMessageToChannel(
                'easyar',
                'Hola soy el Bot estoy para ayudarte',
                params
            );
        })
        // Error Handler
        bot.on('error', (err) => {
            console.log(err);
        })

// Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message') {
        return;
    }
    handleMessage(data.text);
})

// Response Handler
function handleMessage(message) {
    if(message.includes(' Solr')) {
        Solr()
    } else if(message.includes(' /')) {
        inicio()
    } else if(message.includes(' help')) {
        runHelp()
    }
}
// Show Help
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel(
        'easyar',
        `*Ayuda:*Para obtener el estado del indexhado escribir= (Solr)`,
        params
    );
}
// Funcion para buscar el numFound del SOLR
        function Solr() {
            axios.get('http://sv77p2srch01r:3737/solr/MC_10001_CatalogEntry_es_ES/select?q=*.*')
            .then(res => {
                
                    const dato = res.data;
                    //console.log("results1",dato);
                    // parsing xml data
                    parseString(dato, function (err, results) {

                    // parsing to json
                    var datos = JSON.stringify(results,['results','response','result','$','numFound'])
        
                    // display the json data
                    console.log("results2 :",datos);
                    const params = {
                        icon_emoji: ':male-technologist:'
                    }
                
                    bot.postMessageToChannel(
                    
                        'easyar',
                        `:zap: ${datos}`,
                        params
                    
                    );
                });

            })
        }