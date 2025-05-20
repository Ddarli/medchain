export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  address: string;
  snils?: string;
  passport?: {
    series: string;
    number: string;
    issuedBy: string;
    issueDate: string;
  };
}

export interface MedicalRecord {
  ID: string;
  date: string;
  type: 'analysis' | 'reference';
  FileName: string;
  Description: string;
  status: 'pending' | 'completed';
  result?: string;
  isPrivate?: boolean;
}

export interface AccessLog {
  id: string;
  recordId: string;
  recordTitle: string;
  accessedBy: {
    id: string;
    name: string;
    role: string;
  };
  accessType: 'view' | 'download';
  timestamp: string;
}

export interface FormField {
  label: string;
  type: 'text' | 'date' | 'select';
  name: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  pattern?: string;
  validation?: (value: string) => string | undefined;
}

export interface Translations {
  appName: string;
  profile: string;
  records: string;
  accessLogs: string;
  logout: string;
  personalInfo: string;
  documents: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  address: string;
  uploadFile: string;
  uploading: string;
  downloadRecord: string;
  viewFullRecord: string;
  medicalRecords: string;
  makePrivate: string;
  makePublic: string;
  status: {
    completed: string;
    pending: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}