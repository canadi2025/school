import React from 'react';
import { Student, Trainer, Car, Lesson, Payment, Exam, Maintenance, Inspection, Truck, Bus, Motorcycle, Staff, Standard, Charge, ChargeCategory, SchoolProfile, Attendance, Notification, Subscription } from './types';
import OfficeRentIcon from './components/icons/charge-categories/OfficeRentIcon';
import ElectricityIcon from './components/icons/charge-categories/ElectricityIcon';
import WaterIcon from './components/icons/charge-categories/WaterIcon';
import PhoneIcon from './components/icons/charge-categories/PhoneIcon';
import InternetIcon from './components/icons/charge-categories/InternetIcon';
import SoftwareIcon from './components/icons/charge-categories/SoftwareIcon';
import SalaryIcon from './components/icons/charge-categories/SalaryIcon';
import MechanicIcon from './components/icons/charge-categories/MechanicIcon';
import PurchaseIcon from './components/icons/charge-categories/PurchaseIcon';
import OtherIcon from './components/icons/charge-categories/OtherIcon';

export const MOCK_STUDENTS: Student[] = [
  { id: 'S001', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', joinDate: '2023-01-15', status: 'active', licenseCategory: 'B', officeId: 'OFFICE01', archived: false },
  { id: 'S002', name: 'Bob Smith', email: 'bob@example.com', phone: '234-567-8901', joinDate: '2023-02-20', status: 'active', licenseCategory: 'A1', officeId: 'OFFICE02', archived: false },
  { id: 'S003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', joinDate: '2022-11-05', status: 'completed', licenseCategory: 'B', officeId: 'OFFICE01', archived: false },
  { id: 'S004', name: 'Diana Prince', email: 'diana@example.com', phone: '456-789-0123', joinDate: '2023-03-10', status: 'inactive', licenseCategory: 'BE', officeId: 'OFFICE02', archived: false },
  { id: 'S005', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '567-890-1234', joinDate: '2023-04-01', status: 'active', licenseCategory: 'A', officeId: 'OFFICE01', archived: false },
  { id: 'S006', name: 'Fiona Glenanne', email: 'fiona@example.com', phone: '678-901-2345', joinDate: '2023-04-12', status: 'active', licenseCategory: 'C', officeId: 'OFFICE01', archived: false },
  { id: 'S007', name: 'George Costanza', email: 'george@example.com', phone: '789-012-3456', joinDate: '2023-05-20', status: 'active', licenseCategory: 'CE', officeId: 'OFFICE02', archived: false },
  { id: 'S008', name: 'Hannah Montana', email: 'hannah@example.com', phone: '890-123-4567', joinDate: '2023-06-05', status: 'completed', licenseCategory: 'D', officeId: 'OFFICE01', archived: false },
  { id: 'S009', name: 'Ian Malcolm', email: 'ian@example.com', phone: '901-234-5678', joinDate: '2023-06-15', status: 'active', licenseCategory: 'DE', officeId: 'OFFICE02', archived: false },
  { id: 'S010', name: 'Jessica Rabbit', email: 'jessica@example.com', phone: '012-345-6789', joinDate: '2023-07-01', status: 'active', licenseCategory: 'C1', officeId: 'OFFICE01', archived: false },
  { id: 'S011', name: 'Kevin McCallister', email: 'kevin@example.com', phone: '111-222-3333', joinDate: '2023-07-22', status: 'inactive', licenseCategory: 'C1E', officeId: 'OFFICE02', archived: false },
  { id: 'S012', name: 'Laura Croft', email: 'laura@example.com', phone: '444-555-6666', joinDate: '2023-08-01', status: 'active', licenseCategory: 'D1', officeId: 'OFFICE01', archived: false },
  { id: 'S013', name: 'Michael Scott', email: 'michael@example.com', phone: '777-888-9999', joinDate: '2023-08-10', status: 'active', licenseCategory: 'D1E', officeId: 'OFFICE02', archived: false },
  { id: 'S014', name: 'Nate Archibald', email: 'nate@example.com', phone: '123-123-1234', joinDate: '2023-09-01', status: 'active', licenseCategory: 'A', officeId: 'OFFICE01', archived: false },
  { id: 'S015', name: 'Olivia Pope', email: 'olivia@example.com', phone: '234-234-2345', joinDate: '2023-09-02', status: 'active', licenseCategory: 'A1', officeId: 'OFFICE02', archived: false },
  { id: 'S016', name: 'Peter Pan', email: 'peter@example.com', phone: '345-345-3456', joinDate: '2023-09-03', status: 'active', licenseCategory: 'B', officeId: 'OFFICE01', archived: false },
  { id: 'S017', name: 'Quinn Fabray', email: 'quinn@example.com', phone: '456-456-4567', joinDate: '2023-09-04', status: 'active', licenseCategory: 'BE', officeId: 'OFFICE01', archived: false },
  { id: 'S018', name: 'Rachel Green', email: 'rachel@example.com', phone: '567-567-5678', joinDate: '2023-09-05', status: 'active', licenseCategory: 'C', officeId: 'OFFICE02', archived: false },
  { id: 'S019', name: 'Steve Rogers', email: 'steve@example.com', phone: '678-678-6789', joinDate: '2023-09-06', status: 'active', licenseCategory: 'CE', officeId: 'OFFICE01', archived: false },
  { id: 'S020', name: 'Tony Stark', email: 'tony@example.com', phone: '789-789-7890', joinDate: '2023-09-07', status: 'completed', licenseCategory: 'D', officeId: 'OFFICE02', archived: false },
  { id: 'S021', name: 'Uma Thurman', email: 'uma@example.com', phone: '890-890-8901', joinDate: '2023-09-08', status: 'active', licenseCategory: 'DE', officeId: 'OFFICE01', archived: false },
  { id: 'S022', name: 'Vince Masuka', email: 'vince@example.com', phone: '901-901-9012', joinDate: '2023-09-09', status: 'inactive', licenseCategory: 'C1', officeId: 'OFFICE02', archived: false },
  { id: 'S023', name: 'Walter White', email: 'walter@example.com', phone: '012-012-0123', joinDate: '2023-09-10', status: 'active', licenseCategory: 'C1E', officeId: 'OFFICE01', archived: false },
  { id: 'S024', name: 'Xena Warrior', email: 'xena@example.com', phone: '112-112-1124', joinDate: '2023-09-11', status: 'active', licenseCategory: 'D1', officeId: 'OFFICE02', archived: false },
  { id: 'S025', name: 'Ygritte Wildling', email: 'ygritte@example.com', phone: '223-223-2235', joinDate: '2023-09-12', status: 'active', licenseCategory: 'D1E', officeId: 'OFFICE01', archived: false },
];

export const MOCK_TRAINERS: Trainer[] = [
  { id: 'T01', name: 'John Davis', email: 'john.d@example.com', phone: '555-111-2222', specialty: 'Manual Transmission', hireDate: '2021-05-20', licenseDDate: '2020-01-10', cin: 'A123456', licenseTypes: ['B', 'D', 'ED'], associatedCarIds: ['C101'], associatedTruckIds: ['TR01'], associatedBusIds: [], associatedMotorcycleIds: ['M01'], pictureUrl: 'john_davis.jpg', diplomaUrl: 'jd_diploma.pdf' },
  { id: 'T02', name: 'Jane Williams', email: 'jane.w@example.com', phone: '555-333-4444', specialty: 'Automatic Transmission', hireDate: '2022-08-15', licenseDDate: '2021-03-22', cin: 'B789012', licenseTypes: ['A', 'B'], associatedCarIds: ['C102'], associatedTruckIds: [], associatedBusIds: ['B01'], associatedMotorcycleIds: [], pictureUrl: 'jane_williams.jpg', diplomaUrl: 'jw_diploma.pdf' },
  { id: 'T03', name: 'Peter Jones', email: 'peter.j@example.com', phone: '555-555-6666', specialty: 'Defensive Driving', hireDate: '2020-02-01', licenseDDate: '2019-11-05', cin: 'C345678', licenseTypes: ['C', 'EC', 'D'], associatedCarIds: ['C103', 'C101'], associatedTruckIds: ['TR02', 'TR03'], associatedBusIds: ['B02'], associatedMotorcycleIds: ['M02'], pictureUrl: 'peter_jones.jpg', diplomaUrl: 'pj_diploma.pdf' },
];

export const MOCK_STAFF: Staff[] = [
    { id: 'STF01', name: 'Sarah Miller', role: 'Secretary', email: 'sarah.m@example.com', phone: '555-777-8888', hireDate: '2022-01-10', cin: 'A123456', address: '123 Main St, Anytown', whatsapp: '555-777-8888', salaryType: 'monthly', salaryAmount: 2500, pictureUrl: `https://i.pravatar.cc/150?u=STF01`, status: 'present' },
    { id: 'STF02', name: 'Mike Ross', role: 'Content Creator', email: 'mike.r@example.com', phone: '555-888-9999', hireDate: '2023-03-15', cin: 'B789012', address: '456 Oak Ave, Anytown', whatsapp: '555-888-9999', salaryType: 'monthly', salaryAmount: 3000, pictureUrl: `https://i.pravatar.cc/150?u=STF02`, status: 'present' },
    { id: 'STF03', name: 'Linda Chen', role: 'Cleaner', email: 'linda.c@example.com', phone: '555-999-0000', hireDate: '2021-11-20', cin: 'C345678', address: '789 Pine Ln, Anytown', whatsapp: '555-999-0000', salaryType: 'hourly', salaryAmount: 15, pictureUrl: `https://i.pravatar.cc/150?u=STF03`, status: 'absent' },
];

export const MOCK_CARS: Car[] = [
  { id: 'C101', make: 'Toyota', model: 'Corolla', year: 2022, licensePlate: 'DRIVE-1', status: 'available' },
  { id: 'C102', make: 'Honda', model: 'Civic', year: 2023, licensePlate: 'DRIVE-2', status: 'in_use' },
  { id: 'C103', make: 'Ford', model: 'Focus', year: 2021, licensePlate: 'DRIVE-3', status: 'maintenance' },
  { id: 'C104', make: 'Dacia', model: 'Sandero', year: 2021, licensePlate: 'DRIVE-4', status: 'available' },
  { id: 'C105', make: 'Ford', model: 'Fiesta', year: 2020, licensePlate: 'DRIVE-5', status: 'in_use' },
];

export const MOCK_TRUCKS: Truck[] = [
  { id: 'TR01', make: 'Isuzu', model: 'N-Series', year: 2020, licensePlate: 'TRUCK-1', status: 'available', type: 'normal' },
  { id: 'TR02', make: 'Mitsubishi', model: 'Fuso Canter', year: 2021, licensePlate: 'TRUCK-2', status: 'maintenance', type: 'normal' },
  { id: 'TR03', make: 'Volvo', model: 'FH16', year: 2022, licensePlate: 'TRUCK-3', status: 'in_use', type: 'long_haul' },
  { id: 'TR04', make: 'Renault', model: 'T High', year: 2023, licensePlate: 'TRUCK-4', status: 'available', type: 'long_haul' },
];

export const MOCK_BUSES: Bus[] = [
  { id: 'B01', make: 'Renault', model: 'Master Bus', year: 2019, licensePlate: 'BUS-1', status: 'available', capacity: 16 },
  { id: 'B02', make: 'Mercedes-Benz', model: 'Sprinter', year: 2021, licensePlate: 'BUS-2', status: 'in_use', capacity: 22 },
];

export const MOCK_MOTORCYCLES: Motorcycle[] = [
  { id: 'M01', make: 'Benelli', model: 'TNT 150', year: 2022, licensePlate: 'MOTO-1', status: 'available', engineDisplacement: 150 },
  { id: 'M02', make: 'Harley-Davidson', model: 'Street 750', year: 2020, licensePlate: 'MOTO-2', status: 'available', engineDisplacement: 750 },
];

export const ALL_LICENSE_TYPES: string[] = ['AM', 'A1', 'A', 'B', 'EB', 'C', 'EC', 'D', 'ED'];

export const MOCK_LESSONS: Lesson[] = [
  { id: 'L001', studentId: 'S001', trainerId: 'T01', carId: 'C101', date: '2023-08-10', startTime: '10:00', endTime: '11:00', status: 'completed' },
  { id: 'L002', studentId: 'S002', trainerId: 'T02', carId: 'C102', date: '2023-08-11', startTime: '14:00', endTime: '15:00', status: 'scheduled' },
  { id: 'L003', studentId: 'S001', trainerId: 'T01', carId: 'C101', date: '2023-08-12', startTime: '10:00', endTime: '11:00', status: 'scheduled' },
];

export const MOCK_PAYMENTS: Payment[] = [
    { id: 'P001', studentId: 'S001', amount: 500, date: '2023-07-15', status: 'paid', method: 'card' },
    { id: 'P002', studentId: 'S002', amount: 550, date: '2023-08-01', status: 'pending', method: 'transfer' },
    { id: 'P003', studentId: 'S004', amount: 700, date: '2023-06-20', status: 'overdue', method: 'cash' },
];

export const MOCK_EXAMS: Exam[] = [
    { id: 'E001', studentId: 'S003', date: '2023-05-20', type: 'practical', result: 'passed' },
    { id: 'E002', studentId: 'S001', date: '2023-09-05', type: 'theory', result: 'pending' },
    { id: 'E003', studentId: 'S002', date: '2023-08-15', type: 'practical', result: 'failed' },
];

export const MOCK_MAINTENANCE: Maintenance[] = [
  { id: 'M001', vehicleId: 'C101', date: '2023-07-20', description: 'Oil Change', cost: 80, status: 'completed' },
  { id: 'M002', vehicleId: 'C103', date: '2023-08-05', description: 'Brake Pad Replacement', cost: 250, status: 'completed' },
  { id: 'M003', vehicleId: 'C103', date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], description: 'Annual Inspection', cost: 150, status: 'scheduled' },
  { id: 'M004', vehicleId: 'TR02', date: '2023-08-10', description: 'Engine Check', cost: 400, status: 'completed' },
  { id: 'M005', vehicleId: 'B01', date: '2023-09-01', description: 'Tire replacement', cost: 1200, status: 'scheduled' },
  { id: 'M006', vehicleId: 'M02', date: '2023-09-05', description: 'Chain lubrication', cost: 50, status: 'completed' },
];

export const MOCK_INSPECTIONS: Inspection[] = [
  { id: 'I001', carId: 'C101', date: '2023-06-01', inspectorName: 'Gov. Inspector A', result: 'passed', notes: 'All systems nominal.' },
  { id: 'I002', carId: 'C102', date: '2023-07-15', inspectorName: 'Gov. Inspector B', result: 'passed', notes: 'Minor scratch on rear bumper noted.' },
  { id: 'I003', carId: 'C101', date: new Date(new Date().setDate(new Date().getDate() - 180)).toISOString().split('T')[0], inspectorName: 'Gov. Inspector A', result: 'passed', notes: 'Routine semi-annual check.' },
  { id: 'I004', carId: 'C103', date: '2023-08-01', inspectorName: 'Gov. Inspector C', result: 'failed', notes: 'Worn brake pads. Re-inspection required.' },
];

export let LICENSE_CATEGORY_PRICES: { [key: string]: number } = {
  'A': 600,
  'A1': 550,
  'B': 500,
  'BE': 700,
  'C1': 800,
  'C1E': 950,
  'C': 900,
  'CE': 1100,
  'D1': 1000,
  'D1E': 1200,
  'D': 1150,
  'DE': 1300
};

export const CHARGE_CATEGORIES: ChargeCategory[] = [
  'office_rent', 'electricity', 'water', 'phone', 'internet', 'software', 'salary', 'mechanic', 'purchase', 'other'
];

export const MOCK_CHARGES: Charge[] = [
  { id: 'CH001', category: 'office_rent', amount: 2000, beneficiary: 'City Properties', date: '2023-09-01', invoiceUrl: 'invoice_rent_sep.pdf' },
  { id: 'CH002', category: 'electricity', amount: 150.75, beneficiary: 'Power & Light Co.', date: '2023-09-05' },
  { id: 'CH003', category: 'salary', amount: 2500, beneficiary: 'Sarah Miller', date: '2023-09-10' },
  { id: 'CH004', category: 'mechanic', amount: 350, beneficiary: 'Auto Repair Shop', date: '2023-09-12', invoiceUrl: 'invoice_brakes.pdf' },
  { id: 'CH005', category: 'internet', amount: 80, beneficiary: 'ISP Services', date: '2023-09-15' },
  { id: 'CH006', category: 'purchase', amount: 120, beneficiary: 'Office Supplies Inc.', date: '2023-09-02' },
  { id: 'CH007', category: 'water', amount: 45.50, beneficiary: 'Municipal Water', date: '2023-09-06' },
  { id: 'CH008', category: 'phone', amount: 65.00, beneficiary: 'Telecom Provider', date: '2023-09-08' },
  { id: 'CH009', category: 'software', amount: 29.99, beneficiary: 'SaaS Platform', date: '2023-09-11' },
];

export const CHARGE_CATEGORY_DETAILS: Record<ChargeCategory, { icon: React.FC<{className?: string}>; color: string; darkColor: string; textColor: string }> = {
  office_rent: { icon: OfficeRentIcon, color: 'border-blue-500', darkColor: 'dark:border-blue-400', textColor: 'text-blue-600 dark:text-blue-400' },
  electricity: { icon: ElectricityIcon, color: 'border-yellow-500', darkColor: 'dark:border-yellow-400', textColor: 'text-yellow-600 dark:text-yellow-400' },
  water: { icon: WaterIcon, color: 'border-cyan-500', darkColor: 'dark:border-cyan-400', textColor: 'text-cyan-600 dark:text-cyan-400' },
  phone: { icon: PhoneIcon, color: 'border-sky-500', darkColor: 'dark:border-sky-400', textColor: 'text-sky-600 dark:text-sky-400' },
  internet: { icon: InternetIcon, color: 'border-indigo-500', darkColor: 'dark:border-indigo-400', textColor: 'text-indigo-600 dark:text-indigo-400' },
  software: { icon: SoftwareIcon, color: 'border-purple-500', darkColor: 'dark:border-purple-400', textColor: 'text-purple-600 dark:text-purple-400' },
  salary: { icon: SalaryIcon, color: 'border-green-500', darkColor: 'dark:border-green-400', textColor: 'text-green-600 dark:text-green-400' },
  mechanic: { icon: MechanicIcon, color: 'border-gray-500', darkColor: 'dark:border-gray-400', textColor: 'text-gray-600 dark:text-gray-400' },
  purchase: { icon: PurchaseIcon, color: 'border-orange-500', darkColor: 'dark:border-orange-400', textColor: 'text-orange-600 dark:text-orange-400' },
  other: { icon: OtherIcon, color: 'border-pink-500', darkColor: 'dark:border-pink-400', textColor: 'text-pink-600 dark:text-pink-400' },
};

export let MOCK_SCHOOL_PROFILE: SchoolProfile = {
  logo: 'https://placehold.co/128x128/E0E7FF/4F46E5?text=YOUR%5CnLOGO%5CnHERE&font=raleway',
  name: 'IssraeDrive School',
  targetLine: 'Your journey to safe driving starts here.',
  phone: '123-456-7890',
  email: 'contact@issraedrive.com',
  website: 'www.issraedrive.com',
  address: '123 Drive St, Success City',
  country: 'Morocco',
  adminName: 'Admin User',
};

export const MOCK_ATTENDANCE: Attendance[] = [
  // Previous day's attendance
  { id: 'ATT001', entityId: 'S001', entityType: 'student', date: '2023-10-25', status: 'present' },
  { id: 'ATT002', entityId: 'S003', entityType: 'student', date: '2023-10-25', status: 'absent' },
  { id: 'ATT003', entityId: 'STF01', entityType: 'staff', date: '2023-10-25', status: 'present' },
  { id: 'ATT004', entityId: 'STF02', entityType: 'staff', date: '2023-10-25', status: 'present' },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub_basic', name: 'Starter Pack', price: 49, duration: 'monthly', features: ['1 Secretary Dashboard', 'Manage up to 50 students', 'Basic reporting', 'Email support'] },
  { id: 'sub_business', name: 'Growth Pack', price: 99, duration: 'monthly', features: ['Up to 2 Secretary Dashboards', 'Manage up to 200 students', 'Advanced reporting & analytics', 'Priority support'] },
  { id: 'sub_enterprise', name: 'Pro Pack', price: 199, duration: 'monthly', features: ['Unlimited Secretary Dashboards', 'Multi-school management', 'Dedicated account manager', 'API access'] },
];

export let MOCK_NOTIFICATIONS: Notification[] = [];