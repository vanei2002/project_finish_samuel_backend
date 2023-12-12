export type Sender = {
  name: string;
  email?: string | null;
  phone?: string | null;
};

export type Attachment = {
  contentType: string;
  fileName: string;
  content: string;
};

export type NotificationType = 'EMAIL' | 'SMS' | 'WHATSAPP';

export type Notification = {
  type: NotificationType;
  content: string;
  subject: string;
  attachments: Attachment[];
};

export type Recipient = {
  userId: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
};

export type CreateNotificationParams = {
  sender: Sender;
  notification: Notification;
  recipients: Recipient[];
};
