import { Injectable } from '@nestjs/common';
import * as PushNotifications from '@pusher/push-notifications-server';

@Injectable()
export class BeamsService {
  private beamsClient: PushNotifications;

  constructor() {
    this.beamsClient = new PushNotifications({
      instanceId: process.env.ADMIN_PUSHER_BEAMS_INSTANCE_ID!,
      secretKey: process.env.ADMIN_PUSHER_BEAMS_SECRET_KEY!,
    });
  }

  async sendAdminLoginNotification(email: string) {
    await this.beamsClient.publishToInterests(['admin-notifications'], {
      web: {
        notification: {
          title: 'Admin Login',
          body: `Admin ${email} logged in successfully`,
        },
      },
    });
  }
}
