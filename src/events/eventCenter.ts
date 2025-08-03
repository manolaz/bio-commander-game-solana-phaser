let EventCenter: any;

if (typeof window !== 'undefined') {
  // Only import Phaser on the client side
  const Phaser = require('phaser');
  EventCenter = new Phaser.Events.EventEmitter();
} else {
  // Create a mock EventCenter for SSR
  EventCenter = {
    on: () => {},
    off: () => {},
    emit: () => {},
    once: () => {},
    removeAllListeners: () => {},
  };
}

export default EventCenter;