class GameEngine {
  private static instance: GameEngine;
  private constructor() {}

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  public init() {
    console.log("GameEngine initialized");
  }

  public start() {
    console.log("GameEngine started");
  }

  public stop() {
    console.log("GameEngine stopped");
  }
}
