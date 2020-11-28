const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client()

const channelId = '782290323186647050'

exports.start = () => {
  client.login(process.env.BOT_TOKEN)
  console.log("Sucessfully started")
}

exports.stop = () => {
  client.destroy()
  console.log("Sucesfully killed. How dare you ?")
}

exports.printCandidature = (formResponse) => {
  let discordTag
  const discordUser = client.users.cache.find(u => u.tag === formResponse.discordNickname)
  if(typeof discordUser === 'undefined'){
    discordTag = formResponse.discordNickname
  } else {
    discordTag = `<@${discordUser.id}>`
  }

  const embed = new Discord.MessageEmbed()
  .setTitle(formResponse.mcNickname)
  .setColor('#ff8b55')
  .setThumbnail(`https://minotar.net/avatar/${formResponse.mcNickname}/128`)
  .addField("Age", formResponse.age, true)
  .addField("Pseudo Discord", discordTag, true)
  .addField("Adresse mail", formResponse.email, false)
  .addField("Pseudo du/des Parrain(s)", formResponse.godfathers === "" ? "Non Renseigné" : formResponse.godfathers, true)
  .addField("Méthode de Découverte", formResponse.foundOut === "" ? "Non Renseigné" : formResponse.foundOut, true)
  .addField("Candidature", "⬇")
  .setFooter(formResponse.apply)

  client.channels.fetch(channelId).then((channel) => {
    channel.send(embed)
  })
}
