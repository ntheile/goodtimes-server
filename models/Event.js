import { Model } from 'radiks';

export default class Event extends Model {
  static className = 'Event';

  static schema = {
    messageId: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    },
    eventName: {
        type: String,
        decrypted: true,
    },
    location: {
        type: String,
        decrypted: true,
    }
  }
};
