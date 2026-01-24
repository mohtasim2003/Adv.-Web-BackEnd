import { Module } from "@nestjs/common";
import { pusherProvider } from "./pusher.provider";

@Module({
  providers: [pusherProvider],
  exports: [pusherProvider],
})
export class PusherModule {}
