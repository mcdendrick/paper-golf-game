# Paper Golf Game

A digital adaptation of the delightful paper-based golf game originally created by [Gladden Design](https://gladdendesign.com/). This project reimagines their innovative [Paper Apps™ GOLF](https://gladdendesign.com/products/paper-apps-golf) notebook game as an interactive web application.

## Overview

This project demonstrates modern web development practices by transforming a physical paper-and-pencil game into an engaging digital experience. The game maintains the charm and strategic elements of the original while adding interactive features only possible in a digital format.

## Tech Stack

- **Frontend Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Hooks with custom game logic
- **Build Tools**: Modern JavaScript tooling with ESLint and PostCSS

## Features

- 🎲 Dice-based movement system
- 🎯 Strategic gameplay with multiple terrain types:
  - Fairway (+1 to roll distance)
  - Sand traps (-1 to roll distance)
  - Water hazards (can cross but not land)
  - Trees (can cross from fairway)
- 🎮 Interactive game mechanics:
  - Putting system for precise short-distance shots
  - Mulligan system with free tee shot
  - Visual path tracking
  - Valid move highlighting
- 💫 Smooth animations and visual feedback
- 📱 Responsive design for various screen sizes

## Development Highlights

- **Clean Architecture**: Separation of concerns between game logic and UI components
- **Type Safety**: Comprehensive TypeScript types for game state and actions
- **Component Reusability**: Modular design with reusable UI components
- **Performance Optimization**: Efficient state updates and rendering
- **Code Quality**: Consistent code style and best practices

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Credits

This project is inspired by and pays homage to the original [Paper Apps™ GOLF](https://gladdendesign.com/products/paper-apps-golf) created by Gladden Design. Their innovative paper-based game ([demo video](https://www.youtube.com/watch?v=q-WOSGi2je8)) provided the foundation for this digital adaptation.

## Personal Note

As a recent Computer Science graduate, this project showcases my ability to:
- Transform physical concepts into digital experiences
- Implement complex game logic with clean, maintainable code
- Create engaging user interfaces with modern web technologies
- Build upon existing ideas while adding unique digital enhancements

## License

This project is a personal portfolio piece and is not intended for commercial use. The original Paper Apps™ GOLF concept and design belong to Gladden Design.
