export interface Issue {
  id: string | number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  images?: string[];
  submittedAt?: string;
  updatedAt?: string;
  submittedBy?: string;
  assignedTo?: string;
  isAnonymous?: boolean;
  votes?: number;
  priority?: 'low' | 'medium' | 'high';
  distance: string;
  reportedDate: string;
  image?: string;
  isSpam?: boolean;
  isInvalid?: boolean;
  moderatedBy?: string;
  moderatedAt?: string;
}
