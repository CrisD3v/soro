export class NotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string; // task, project, invoice, deal, system
  entityType?: string;
  entityId?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }

  markAsRead(): void {
    this.read = true;
    this.readAt = new Date();
  }

  get isUnread(): boolean {
    return !this.read;
  }
}
