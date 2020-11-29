const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] })

const guildId = '694628130010431518'
let guild
const channelId = '782290323186647050'
let channel

const waitingColor = '#ff8b55'
const refusedColor = '#ff0000'
const acceptedColor = '#00ff00'


exports.start = () => {
  client.login(process.env.BOT_TOKEN)
  console.log("Sucessfully started")
}

client.on('ready', () => {
  client.guilds.fetch(guildId)
    .then(fetchedGuild => {
      guild = fetchedGuild
      guild.members.fetch()
      channel = guild.channels.cache.get(channelId)
    })
})

exports.stop = () => {
  client.destroy()
  console.log("Sucesfully killed. How dare you ?")
}

exports.isUserPresent = (userTag) => {
  return typeof guild.members.cache.find(member => member.user.tag === userTag) !== 'undefined'
}

exports.printCandidature = (formResponse) => {
  const embed = new Discord.MessageEmbed()
  .setTitle(formResponse.mcNickname)
  .setColor(waitingColor)
  .setThumbnail(`https://minotar.net/avatar/${formResponse.mcNickname}/128`)
  .addField("Age", formResponse.age, true)
  .addField("Pseudo Discord", `<@${client.users.cache.find(u => u.tag === formResponse.discordNickname).id}>`, true)
  .addField("Adresse mail", formResponse.email, false)
  .addField("Pseudo du/des Parrain(s)", formResponse.godfathers === "" ? "Non Renseigné" : formResponse.godfathers, true)
  .addField("Méthode de Découverte", formResponse.foundOut === "" ? "Non Renseigné" : formResponse.foundOut, true)
  .addField("Candidature", "⬇")
  .setFooter(formResponse.apply)

  channel.send(embed).then(msg => {
    msg.react('🟥')
    .then(() => msg.react('⬛'))
    .then(() => msg.react('🟩'))
  })
}

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.id === channelId && user.id !== client.user.id) {
    reaction.fetch().then(react => {
      if (react.message.author.id === client.user.id && react.message.embeds.length === 1) {
        const embed = react.message.embeds[0]
        if (embed.hexColor === waitingColor) {
          if (react.emoji.toString() === "🟥") {
            embed.setColor(refusedColor)
            embed.setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true }))
            react.message.edit(embed)
            react.message.reactions.removeAll()
          } else if (react.emoji.toString() === "🟩") {
            embed.setColor(acceptedColor)
            embed.setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true }))
            react.message.edit(embed)
            react.message.reactions.removeAll()
          }
        }
      }
    })
  }
})
