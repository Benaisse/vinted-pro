export interface Notification {
  id: number;
  type: 'vente' | 'stock' | 'engagement' | 'ia';
  titre: string;
  message: string;
  lue: boolean;
  date: Date;
  statut: string;
  montant?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  color: 'green' | 'orange' | 'blue' | 'purple' | 'gray';
}

export interface NotificationFilter {
  type: 'toutes' | 'ventes' | 'ia' | 'stock';
  label: string;
}

export interface ModernNotificationItemProps {
  notif: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface ColorClasses {
  border: string;
  bg: string;
  icon: string;
  title: string;
  text: string;
  badge: string;
} 