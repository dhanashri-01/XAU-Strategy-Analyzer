// Socket / Real-time module
const { getLiveSignal } = require("../controllers/signalController");

function initSockets(server) {
  // Can be extended with ws or socket.io if needed
  return {
    broadcastSignal: (signalData) => {
      // Broadcast helper
    },
  };
}

module.exports = { initSockets };

