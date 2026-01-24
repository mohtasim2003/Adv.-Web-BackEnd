const Pusher = require("pusher");

export const PUSHER_CLIENT = "PUSHER_CLIENT";

export const pusherProvider = {
  provide: PUSHER_CLIENT,
  useFactory: () => {
    const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } =
      process.env;

    if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
      throw new Error(
        "Missing Pusher env vars. Check PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER",
      );
    }

    return new Pusher({
      appId: PUSHER_APP_ID,
      key: PUSHER_KEY,
      secret: PUSHER_SECRET,
      cluster: PUSHER_CLUSTER,
      useTLS: true,
    });
  },
};
