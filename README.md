# Falling Sand Simulation

A modular falling sand simulation built with vanilla JavaScript using ES6 modules.

## Project Structure

The project has been restructured into a clean, modular architecture with clear separation of concerns:

```
src/
├── state/
│   └── GameState.js       # Centralized state management
├── core/
│   ├── Canvas.js          # Canvas setup and coordinate management
│   └── GameLoop.js        # Main animation loop
├── rendering/
│   └── Renderer.js        # All drawing operations
├── physics/
│   └── Physics.js         # Falling sand simulation logic
├── input/
│   └── InputHandler.js    # User input handling
├── config/
│   └── constants.js       # Configuration constants
├── utils/
│   └── utils.js           # Pure utility functions
└── main.js                # Application entry point
```

## Architecture Benefits

### 1. **Centralized State Management**
- All application state is managed through the `GameState` class
- No more scattered global variables
- Subscription system for state changes
- Clean separation between data and presentation

### 2. **Clear Separation of Concerns**
- **Canvas Management**: Setup, coordinate conversion, bounds checking
- **Rendering**: All drawing operations (grid, cells, lines)
- **Physics**: Falling sand simulation logic
- **Input Handling**: User interactions and UI controls
- **Game Loop**: Animation timing and coordination

### 3. **No Circular Dependencies**
- Each module has clear dependencies
- Data flows in one direction through the state manager
- Easy to test and debug individual modules

### 4. **Maintainable Code**
- Each file has a single responsibility
- Easy to add new features or modify existing ones
- Clear interfaces between modules

## How It Works

1. **Initialization**: `main.js` coordinates the initialization of all modules
2. **State Management**: `GameState` holds all application data and notifies changes
3. **User Input**: `InputHandler` processes mouse/touch events and UI interactions
4. **Physics**: `Physics` module updates the sand simulation each frame
5. **Rendering**: `Renderer` draws the current state to the canvas
6. **Game Loop**: `GameLoop` coordinates physics updates and rendering

## Running the Application

Simply open `index.html` in a modern web browser. The application uses ES6 modules, so you may need to serve it from a local server for development.

## Adding New Features

Thanks to the modular structure, adding new features is straightforward:

- **New particle types**: Extend the `Physics` module
- **New rendering effects**: Add methods to the `Renderer` module
- **New input methods**: Extend the `InputHandler` module
- **New UI controls**: Add to the state management in `GameState`

## Performance

The modular structure maintains the same performance as the original code while being much more maintainable and extensible.