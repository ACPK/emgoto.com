---
title: "Setting up Steam Authentication using OpenID"
date: 2020-01-03
tag: "steam"
category: "blog"
published: true
emoji: ♨️
coverImage: ''
---# 

If you’ve ever been interested in developing a web app that integrates with Steam, this post will help provide you with a quick overview of the things to keep in mind when getting started.

## The Steam Web API

The [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API) can provide you with a lot of useful information relating to games on the Steam store, as well as user-specific data such as game playtime and achievement statistics.

> To use this API you’ll need a Steam API key, which you can obtain [here](https://steamcommunity.com/dev/apikey).

If you’re looking to get information about a Steam user you will also need their Steam ID. This ID is accessible via OpenID authentication with Steam, but can also be easily accessed from profile URLs (if the user hasn't set up a custom ID) and by third-party tools such as [Steam ID Finder](https://steamidfinder.com/).

The benefit of using Steam authentication is that it provides a smooth way to get a user’s ID, without having to make them jump through hoops to provide it for you.

One important thing to note is that even after you get a user to authenticate with Steam, **if their profile visibility is set to private it is not possible to get any of their data**. The exception to this rule is your own account, and any accounts on your Steam friend list, as the API key you use is linked to your Steam account. 

## Finding an OpenID 2.0 library to use

Steam uses an authentication protocol called **OpenID 2.0**. This is a rather old protocol that has actually been deprecated in favour of a newer protocol called **OpenID Connect**. 

Libraries for OpenID Connect are not compatible with OpenID 2.0, so when looking for a library make sure you choose carefully! The OpenID website provides [a list of OpenID 2.0 libraries](https://openid.net/developers/libraries/obsolete/), but if you use Google you may be able to find ones specific to Steam in your language of choice, such as [passport-steam](https://github.com/liamcurry/passport-steam) for Node.js. 

If you’re looking to use only JavaScript for OpenID, you’re out of luck as your API key needs to be kept secret as per Steam’s [Terms of Use](https://steamcommunity.com/dev/apiterms). If you use client-side JavaScript then any calls you make to the API will be visible in the network tab, along with your key.

## The authentication flow

You must use one of the ["Sign in through Steam"](https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png) buttons provided by Steam to tell the user to log in. Once the user clicks this button, you should be able to use your OpenID library to kick off the authentication flow. It will redirect the user to Steam where they will be prompted to log in (note that this cannot be in an iframe), and then redirect the user back to a URL of your choice. Provided you can find a well-documented OpenID library (or even better, one specific to Steam) this should be fairly straightforward to set up.

You will then also receive some information about the user such as their display name, avatar and Steam ID. From there you can go on to use the ID to grab the information you need about their games. Just remember to keep in mind that the user's profile will need to be public for their data to be accessible.

Happy coding!


