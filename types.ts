export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  subscriptionPlan: 'basic' | 'business' | 'enterprise';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'student' | 'secretary' | 'superadmin';
  officeId?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'completed';
  licenseCategory: string;
  officeId: string;
  archived: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  hireDate: string;
  licenseDDate?: string;
  pictureUrl?: string;
  diplomaUrl?: string;
  cin?: string;
  licenseTypes?: string[];
  associatedCarIds?: string[];
  associatedTruckIds?: string[];
  associatedBusIds?: string[];
  associatedMotorcycleIds?: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hireDate: string;
  cin: string;
  address: string;
  whatsapp: string;
  salaryType: 'monthly' | 'hourly' | 'task_based';
  salaryAmount: number;
  pictureUrl?: string;
  status: 'present' | 'absent';
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
}

export interface Truck {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
  type: 'normal' | 'long_haul';
}

export interface Bus {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
  capacity: number;
}

export interface Motorcycle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
  engineDisplacement: number; // in cc
}


export interface Lesson {
  id: string;
  studentId: string;
  studentName?: string;
  trainerId: string;
  trainerName?: string;
  carId: string;
  carName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Payment {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  method: 'card' | 'cash' | 'transfer';
}

export interface Exam {
  id: string;
  studentId: string;
  studentName?: string;
  date: string;
  type: 'theory' | 'practical';
  result: 'passed' | 'failed' | 'pending';
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g., 'monthly', 'yearly'
  features: string[];
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  status: 'scheduled' | 'completed';
}

export type ChargeCategory = 'office_rent' | 'electricity' | 'water' | 'phone' | 'internet' | 'software' | 'salary' | 'mechanic' | 'purchase' | 'other';

export interface Charge {
  id: string;
  category: ChargeCategory;
  amount: number;
  beneficiary: string;
  date: string;
  invoiceUrl?: string;
}

export interface StudentProgressDetails {
  lessons: Lesson[];
  exams: Exam[];
}

export interface Inspection {
  id: string;
  carId: string;
  date: string;
  inspectorName: string;
  result: 'passed' | 'failed' | 'pending';
  notes: string;
}

export type StandardColor = 'teal' | 'blue' | 'red' | 'brown' | 'purple' | 'cyan' | 'orange' | 'indigo';

export interface Standard {
  id: string;
  name: string;
  level: number;
  studentCount: number;
  studentAvatars: string[];
  color: StandardColor;
  category: string;
}

export interface SchoolProfile {
  logo: string;
  name: string;
  targetLine: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  country: string;
  adminName: string;
}

export interface Attendance {
  id: string;
  entityId: string; // Student or Staff ID
  entityType: 'student' | 'staff';
  date: string;
  status: 'present' | 'absent';
  notes?: string;
}

export interface Notification {
  id: string;
  message: string;
  studentId: string;
  studentName: string;
  date: string;
  read: boolean;
  type: 'completion' | 'payment_due';
}