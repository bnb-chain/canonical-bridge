import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';

@Injectable()
export class BridgeService {
  private logger = new Logger(BridgeService.name);

  constructor(private databaseService: DatabaseService) {}

  async getAllTokens() {
    return this.databaseService.getAllTokens();
  }
}
