const Discord = require('discord.js');
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] })

const guildId = '694628130010431518'
let guild
const channelId = '782290323186647050'
let channel
const roleId = '694638894909620325'
let role

const waitingColor = '#ff8b55'
const refusedColor = '#ff0000'
const acceptedColor = '#00ff00'


exports.start = () => {
  client.login(process.env.BOT_TOKEN).then(() => {
    console.log("Discord bot successfully started");
  });
}

client.on('ready', () => {
  client.guilds.fetch(guildId)
    .then(fetchedGuild => {
      guild = fetchedGuild
      guild.members.fetch()
      channel = guild.channels.cache.get(channelId)
      role = guild.roles.cache.get(roleId)
    })
})

exports.stop = () => {
  client.destroy()
}

exports.isUserPresent = (userTag) => {
  return typeof guild.members.cache.find(member => member.user.tag === userTag) !== 'undefined'
}

exports.printCandidature = (form) => {
  const embed = new Discord.MessageEmbed()
  .setTitle(form.mcNickname)
  .setColor(waitingColor)
  .setThumbnail(`https://minotar.net/avatar/${form.mcNickname}/128`)
  .setTimestamp()
  .addField("Age", form.age, true)
  .addField("Pseudo Discord", `<@${client.users.cache.find(u => u.tag === form.discordNickname).id}>`, true)
  .addField("Pseudo du/des Parrain(s)", form.godfathers === "" ? "Non Renseigné" : form.godfathers)
  .addField("Méthode de Découverte", form.foundOut === "" ? "Non Renseigné" : form.foundOut)
  .addField("Candidature", "⬇")
  .setFooter(form.apply)

  channel.send(embed).then(msg => {
    msg.react('🟥')
    .then(() => msg.react('⬛'))
    .then(() => msg.react('🟩'))
  })
}

exports.printDonation = (pseudo, montant) => {
  const embed = new Discord.MessageEmbed()
  .setTitle(`${pseudo} vient de cracher la thune`)
  .setColor('#1da805')
  .setThumbnail(`https://minotar.net/avatar/${pseudo}/128`)
  .setTimestamp()
  .addField("Montant de la donation :", `${montant} EUR`)
  
  channel.send(embed).then(msg => {
    msg.react('💜')
    .then(() => msg.react('💰'))
    .then(() => msg.react('🤑'))
    .then(() => msg.react('💸'))
    .then(() => msg.react('💶'))
  })
}

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.id === channelId && user.id !== client.user.id) {
    reaction.fetch().then(react => {
      if (react.message.author.id === client.user.id && react.message.embeds.length === 1) {
        const embed = react.message.embeds[0]
        if (embed.hexColor === waitingColor) {
          if (react.emoji.toString() === "🟥") {
            refuseCandidature(react.message, embed, user)
          } else if (react.emoji.toString() === "🟩") {
            acceptCandidature(react.message, embed, user)
          }
        }
      }
    })
  }
})

function refuseCandidature(message, embed, user) {
  const candidateId = embed.fields.find(field => field.name === "Pseudo Discord").value.slice(2, -1)
  const candidate = guild.members.cache.get(candidateId)
  const candidateName = embed.title

  if (typeof candidate !== 'undefined') {
    candidate.createDM().then(dmChannel => {
      const acceptedEmbed = new Discord.MessageEmbed()
        .setColor(refusedColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTitle("Candidature Refusée")
        .setDescription(`Désolé **${candidateName}** mais nous avons le malheur de vous annoncer que votre candidature à été refusée pour plus d'informations veuillez contacter <@${user.id}>`)
      dmChannel.send(acceptedEmbed)
    })
  }

  embed.setColor(refusedColor)
    .setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true }))

  message.edit(embed)
  message.reactions.removeAll()
}

function acceptCandidature(message, embed, user) {
  const candidateId = embed.fields.find(field => field.name === "Pseudo Discord").value.slice(2, -1)
  const candidate = guild.members.cache.get(candidateId)
  const candidateName = embed.title

  if (typeof candidate !== 'undefined') {
    candidate.createDM().then(dmChannel => {
      const acceptedEmbed = new Discord.MessageEmbed()
        .setColor(acceptedColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTitle("Candidature Acceptée")
        .setDescription(`
        Bienvenue sur La Palmeraie **${candidateName}**
        Tu peux désormais te connecter sur le serveur en utilisant cette adresse IP : \`play.lapalmeraiemc.fr\`
        Nous te conseillons aussi d'aller voir notre tutoriel sur nos ajouts à cette adresse : http://tuto.lapalmeraiemc.fr`)
      dmChannel.send(acceptedEmbed)
    })
    candidate.roles.add(role)
  }

  embed.setColor(acceptedColor)
    .setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true }))

  message.edit(embed)
  message.reactions.removeAll()
}
