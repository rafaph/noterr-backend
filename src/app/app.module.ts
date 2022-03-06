import { Module } from "@nestjs/common";
import { AppController } from "@app/app/app.controller";
import { AppService } from "@app/app/app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
