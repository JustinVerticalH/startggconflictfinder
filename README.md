# Start.gg Conflict Finder
Start.gg Conflict Finder is a Firefox browser extension that runs whenever the user opens a start.gg bracket page as a TO. The extension checks each player who's still in that bracket, and if the player is currently playing a set in another bracket, that player's name will turn red on the current page. This way, TOs can quickly see if a player is busy before they call their set, without having to check the pages for every other bracket or look around the room.

## Setup
<small>Sorry you have to do this for now I haven't published the extension yet</small>

### Adding your own token
First, you need to insert your own API token. This allows the extension to communicate with start.gg's API and get information about the other brackets.

- Go to start.gg's [Developer Settings](https://start.gg/admin/profile/developer)
- Click "Create new token" ![Create new token](https://imgur.com/Xx4LNIN.png)
- Enter a description for the token ![Enter a description](https://imgur.com/b2russ6.png)
- Click "Save" ![Save](https://imgur.com/nEycaZA.png)
- Copy the token
- Open [findConflicts.js](findConflicts.js) in a text editor
- On line 1 of findConflicts.js, replace the underscore with your token, and save the file

### Adding the extension
Next, you need to add the extension to Firefox.
- In your Firefox browser, go to [about:debugging -> This Firefox](about:debugging)
- Click "Load Temporary Add-on..." ![Load Temporary Add-on](https://i.imgur.com/iM0GKLO.png)
- Select any file in the extension's directory
The extension is now installed! The extension will be removed when you close Firefox, so you'll have to add it back every time you reopen Firefox.

## To Do
- Support other browsers (Chrome, Opera, etc)
- Let users add their API token without modifying the source code