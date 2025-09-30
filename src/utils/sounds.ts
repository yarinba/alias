// Sound utility for playing game sounds
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Pre-load sounds - use relative paths that work with Vite's base configuration
    const basePath = import.meta.env.BASE_URL;
    this.loadSound("success", `${basePath}sounds/success.mp3`);
    this.loadSound("burn", `${basePath}sounds/burn.wav`);
    this.loadSound("buzzer", `${basePath}sounds/buzzer.wav`);
  }

  private loadSound(name: string, path: string) {
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.addEventListener('error', (e) => {
      console.error(`Failed to load sound: ${name} from ${path}`, e);
    });
    this.sounds.set(name, audio);
  }

  play(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      // Clone the audio to allow overlapping plays
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = 0.5; // Set volume to 50%
      clone.play().catch((err) => {
        console.warn(`Failed to play sound: ${name}`, err);
      });
    }
  }
}

export const soundManager = new SoundManager();
