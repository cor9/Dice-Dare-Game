# 🎲 Dice Dare Game

A digital implementation of the dice dare game similar to Deal or No Deal. This web application provides an interactive way to play the game with automatic dice rolling and dare tracking.

## 🎮 How to Play

### Setup
1. **Choose Your Role**: Select whether you're the Roller or Game Master
2. **Set Face Limits**: Check the appropriate boxes if either player has face limits
3. **Start Game**: Click "Start Game" to begin

### Gameplay
- **Roller**: Click "Roll Dice" to eliminate dares from the list
- **Game Master**: Keeps track of rolled numbers and eliminated dares
- **Center Dare Option**: The Roller can end the game early by choosing the center dare instead of continuing to roll

### Game Rules
- Roll a twenty-sided dice (or use an online roller like rolz.org)
- Each roll eliminates the corresponding dare number from the list
- If you roll a number that's already been rolled, you must roll again
- The Roller can choose to "take the deal" by selecting the center dare at any time
- When only one dare remains, it must be completed on camera

### Center Dare Rule
- If there's an even number of dares remaining, use the lower numbered dare of the two centermost dares
- This gives the Roller control over when the game ends

## 🎯 Features

- **Interactive Dice Rolling**: Animated dice with random number generation
- **Dare Tracking**: Visual display of all dares with elimination status
- **Face Limit Support**: Automatic dare substitution for players with face limits
- **Center Dare Calculator**: Automatically calculates and displays the center dare option
- **Responsive Design**: Works on desktop and mobile devices
- **Game Statistics**: Tracks remaining dares and rolled numbers
- **Result Display**: Shows the final dare that must be completed

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. No additional setup or installation required
3. Works offline once loaded

## 📱 Mobile Support

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Customization

The game includes all 20 original dares with support for face limit substitutions:
- **Roller Face Limit**: Replaces dares #3 and #4 with face-free alternatives
- **Game Master Face Limit**: Replaces dares #16-19 with face-free alternatives

## ⚠️ Important Notes

- This is a digital implementation of the original game
- All dares are displayed as provided in the original game description
- Players should ensure they're comfortable with all potential dares before playing
- The game master should only play if willing to complete any of the game master dares

## 🔧 Technical Details

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No external dependencies, works in all modern browsers
- **Local Storage**: Game state is maintained during the session

## 📄 Files

- `index.html` - Main game interface
- `styles.css` - Styling and responsive design
- `script.js` - Game logic and interactions
- `README.md` - This documentation file

Enjoy playing! 🎲


