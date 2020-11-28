const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client()

exports.start = () => {
  client.login(process.env.TOKEN)
  console.log("Sucessfully started")
}

exports.stop = () => {
  client.destroy()
  console.log("Sucesfully killed. How dare you ?")
}

exports.printCandidature = (jsonBoolObject, jsonCandidatureObject) => {
  var isDataUnsable = false
  var channelCandidatures = '782290323186647050'
  for(i in jsonBoolObject){
    if(jsonBoolObject[i] == false){
      isDataUnsable = true
    }
  }
  if(isDataUnsable){
    console.log("Houston, we have a problem.")
  }else{
    //TODO Build message for Poca the fils de pute MESSAGE
    var discordTag
    const discordUser = client.users.cache.find(u => u.tag === jsonCandidatureObject.formDiscordNickname)

    if(typeof discordUser === 'undefined'){
      discordTag = jsonCandidatureObject.formDiscordNickname
    } else {
      discordTag = `<@${discordUser.id}>`
    }

    embed = new Discord.MessageEmbed()
    .setTitle(jsonCandidatureObject.formMcNickname)
    .setColor('#ff8b55')
    .setThumbnail(`https://minotar.net/avatar/${jsonCandidatureObject.formMcNickname}/128`)
    .addField("Age", jsonCandidatureObject.formAge, true)
    .addField("Pseudo Discord", discordTag, true)
    .addField("Adresse mail", jsonCandidatureObject.formEmail, true)
    .addField("Pseudo des Parrains", jsonCandidatureObject.formGodfathers === "" ? "Aucun" : jsonCandidatureObject.formGodfathers, true)
    .addField("Méthode de Découverte", jsonCandidatureObject.formFoundOut, true)
    .addField("Candidature", "⬇")
    .setFooter(jsonCandidatureObject.formApply)

    client.channels.fetch(channelCandidatures).then((channel) => {
      channel.send(embed)
    })
  }
}