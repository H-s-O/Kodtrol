# Kodtrol
![Kodtrol screenshot](screenshot.png)

(Curious to see what the project in this screenshot looks like? [Here it is](https://youtu.be/CueEGW6SlJ0).)

# ⚠️ Note: this software is still in alpha stage. Use at your own risk; expect breaking changes without prior notice.
There is no executable build yet. Still an Electron noob. See "Local development / run from source" below.

## Features roadmap (in no particular order)
- [Open Fixture Library](https://open-fixture-library.org/) integration
- OSC/MSC/Serial outputs
- MIDI timecode sync
- Helpers Hub (where users can post their script helpers and share them)
- Manual and docs on [kodtrol.com](http://kodtrol.com)

## Local development / run from source

**Requirements**
- Node.js >= 10.x.x
- npm >= 3.6.x
- Linux only: `libasound2-dev` package

Clone the repository and `cd` into it.  
Then:
```
npm install
npm run rebuild
npm run dev
```
And in another terminal, run:
```
npm start
```
If all goes well, you should see the Welcome Screen allowing you to create a new project or open an existing one.