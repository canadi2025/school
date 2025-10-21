import { MOCK_STUDENTS, MOCK_TRAINERS, MOCK_CARS, MOCK_LESSONS, MOCK_PAYMENTS, MOCK_EXAMS, MOCK_MAINTENANCE, MOCK_INSPECTIONS, LICENSE_CATEGORY_PRICES, MOCK_TRUCKS, MOCK_BUSES, MOCK_MOTORCYCLES, MOCK_STAFF, MOCK_CHARGES, MOCK_SCHOOL_PROFILE, MOCK_ATTENDANCE, MOCK_NOTIFICATIONS, MOCK_SUBSCRIPTIONS } from '../constants';
import { Student, Trainer, Car, Lesson, Payment, Exam, Maintenance, StudentProgressDetails, Inspection, Truck, Bus, Motorcycle, Staff, Standard, StandardColor, Charge, SchoolProfile, User, Office, Attendance, Notification, Subscription } from '../types';

const FAKE_LATENCY = 500;

export const MOCK_OFFICES: Office[] = [
    { id: 'OFFICE01', name: 'Main Office - Downtown', address: '123 Drive St, Success City', phone: '123-456-7890', subscriptionPlan: 'enterprise' },
    { id: 'OFFICE02', name: 'Westside Branch', address: '456 West Ave, Success City', phone: '987-654-3210', subscriptionPlan: 'basic' },
    { id: 'OFFICE03', name: 'North End Academy', address: '789 North Blvd, Success City', phone: '555-123-4567', subscriptionPlan: 'business' },
];

export const MOCK_USERS: User[] = [
  { id: 'U00', name: 'Super Admin', email: 'superadmin@issraedrive.com', role: 'superadmin' },
  { id: 'U01', name: 'Admin User', email: 'admin@issraedrive.com', role: 'admin' },
  { id: 'U02', name: 'Sarah Miller', email: 'secretary@issraedrive.com', role: 'secretary', officeId: 'OFFICE01' },
  { id: 'U03', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'secretary', officeId: 'OFFICE01' },
  { id: 'U04', name: 'John Smith', email: 'john.smith@example.com', role: 'secretary', officeId: 'OFFICE02' },
];

const simulateRequest = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), FAKE_LATENCY));
};

export const apiService = {
  login: async (email: string, password: string): Promise<{ token: string, user: User }> => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user && password === 'password') {
      const token = `fake-jwt-token-for-${user.role}-${user.id}`;
      localStorage.setItem('issraedrive_token', token);
      localStorage.setItem('issraedrive_user', JSON.stringify(user));
      return simulateRequest({ token, user });
    }
    throw new Error('Invalid credentials');
  },
  
  logout: (): void => {
    localStorage.removeItem('issraedrive_token');
    localStorage.removeItem('issraedrive_user');
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('issraedrive_token');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('issraedrive_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch(e) {
        return null;
      }
    }
    return null;
  },

  getOffices: async (): Promise<Office[]> => simulateRequest(MOCK_OFFICES),

  addOffice: async (officeData: Omit<Office, 'id'>): Promise<Office> => {
    const newOffice: Office = {
      ...officeData,
      id: `OFFICE${String(MOCK_OFFICES.length + 1).padStart(2, '0')}`,
    };
    MOCK_OFFICES.push(newOffice);
    return simulateRequest(newOffice);
  },

  getSecretaries: async (): Promise<User[]> => {
    const secretaries = MOCK_USERS.filter(u => u.role === 'secretary');
    return simulateRequest(secretaries);
  },

  addSecretary: async (secretaryData: Omit<User, 'id' | 'role'>): Promise<User> => {
    const newSecretary: User = {
      ...secretaryData,
      id: `U${String(MOCK_USERS.length + 1).padStart(2, '0')}`,
      role: 'secretary',
    };
    MOCK_USERS.push(newSecretary);
    return simulateRequest(newSecretary);
  },
  
  deleteSecretary: async (secretaryId: string): Promise<{ success: boolean }> => {
    const index = MOCK_USERS.findIndex(u => u.id === secretaryId && u.role === 'secretary');
    if (index > -1) {
      MOCK_USERS.splice(index, 1);
      return simulateRequest({ success: true });
    }
    throw new Error('Secretary not found');
  },
  
  getDashboardStats: async (officeId?: string) => {
    const currentUser = apiService.getCurrentUser();
    const targetOfficeId = officeId || (currentUser?.role === 'secretary' ? currentUser.officeId : undefined);

    const activeStudents = MOCK_STUDENTS.filter(s => !s.archived);
    
    let students = activeStudents;
    let lessons = MOCK_LESSONS;
    let payments = MOCK_PAYMENTS;
    
    if (targetOfficeId) {
      students = activeStudents.filter(s => s.officeId === targetOfficeId);
      const studentIds = new Set(students.map(s => s.id));
      lessons = MOCK_LESSONS.filter(l => studentIds.has(l.studentId));
      payments = MOCK_PAYMENTS.filter(p => studentIds.has(p.studentId));
    }

    return simulateRequest({
      totalStudents: students.length,
      activeLessons: lessons.filter(l => l.status === 'scheduled').length,
      revenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      availableCars: MOCK_CARS.filter(c => c.status === 'available').length,
      totalCharges: MOCK_CHARGES.reduce((sum, c) => sum + c.amount, 0),
      totalStaff: MOCK_STAFF.length,
      chargeStaff: MOCK_CHARGES.filter(c => c.category === 'salary').reduce((sum, c) => sum + c.amount, 0),
      presentStaff: MOCK_STAFF.filter(s => s.status === 'present').length,
      absentStaff: MOCK_STAFF.filter(s => s.status === 'absent').length,
      lessonData: [
        { name: 'Jan', lessons: 30 }, { name: 'Feb', lessons: 45 }, { name: 'Mar', lessons: 60 },
        { name: 'Apr', lessons: 50 }, { name: 'May', lessons: 70 }, { name: 'Jun', lessons: 85 },
      ],
      revenueData: [
        { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 7200 },
      ],
    });
  },

  getSuperAdminDashboardStats: async () => {
    return simulateRequest({
        totalSchools: MOCK_OFFICES.length,
        totalStudents: MOCK_STUDENTS.length,
        totalTrainers: MOCK_TRAINERS.length,
        totalRevenue: MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
        subscriptions: [
            { name: 'Basic', value: MOCK_OFFICES.filter(o => o.subscriptionPlan === 'basic').length },
            { name: 'Business', value: MOCK_OFFICES.filter(o => o.subscriptionPlan === 'business').length },
            { name: 'Enterprise', value: MOCK_OFFICES.filter(o => o.subscriptionPlan === 'enterprise').length },
        ]
    });
  },

  getStandards: async (officeId?: string): Promise<Standard[]> => {
    const students = await apiService.getStudents(officeId);
    const studentsByCategory = students.reduce((acc, student) => {
        const category = student.licenseCategory;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(student);
        return acc;
    }, {} as Record<string, Student[]>);

    const colors: StandardColor[] = ['teal', 'blue', 'red', 'brown', 'purple', 'cyan', 'orange', 'indigo'];
    let colorIndex = 0;

    const standards: Standard[] = Object.entries(studentsByCategory).map(([category, students]) => {
        const standard: Standard = {
            id: `std-${category}`,
            name: `Category ${category}`,
            category: category,
            level: 1, // keeping this for interface compatibility
            studentCount: students.length,
            studentAvatars: students.slice(0, 5).map(s => `https://i.pravatar.cc/150?u=${s.id}`),
            color: colors[colorIndex % colors.length]
        };
        colorIndex++;
        return standard;
    });

    return simulateRequest(standards.sort((a,b) => a.category.localeCompare(b.category)));
  },
  getStudents: async (officeId?: string, includeArchived = false): Promise<Student[]> => {
    const currentUser = apiService.getCurrentUser();
    let students = MOCK_STUDENTS;

    if (currentUser?.role === 'secretary' && currentUser.officeId) {
      students = students.filter(s => s.officeId === currentUser.officeId);
    } else if (officeId) {
      students = students.filter(s => s.officeId === officeId);
    }

    if (!includeArchived) {
        students = students.filter(s => !s.archived);
    }
    
    return simulateRequest(students);
  },
  getStudentById: async (id: string): Promise<Student | undefined> => {
    const student = MOCK_STUDENTS.find(s => s.id === id);
    return simulateRequest(student);
  },
  getTrainers: async (): Promise<Trainer[]> => simulateRequest(MOCK_TRAINERS),
  getTrainerById: async (id: string): Promise<Trainer | undefined> => {
    const trainer = MOCK_TRAINERS.find(t => t.id === id);
    return simulateRequest(trainer);
  },
  getStaff: async (): Promise<Staff[]> => simulateRequest(MOCK_STAFF),
  getStaffById: async (id: string): Promise<Staff | undefined> => {
    const staffMember = MOCK_STAFF.find(s => s.id === id);
    return simulateRequest(staffMember);
  },
  getCars: async (): Promise<Car[]> => simulateRequest(MOCK_CARS),
  getTrucks: async (): Promise<Truck[]> => simulateRequest(MOCK_TRUCKS),
  getBuses: async (): Promise<Bus[]> => simulateRequest(MOCK_BUSES),
  getMotorcycles: async (): Promise<Motorcycle[]> => simulateRequest(MOCK_MOTORCYCLES),
  getLessons: async (officeId?: string): Promise<Lesson[]> => {
      const studentsForUser = await apiService.getStudents(officeId);
      const studentIds = new Set(studentsForUser.map(s => s.id));

      const lessonsWithNames = MOCK_LESSONS
          .filter(lesson => studentIds.has(lesson.studentId))
          .map(lesson => {
              const student = MOCK_STUDENTS.find(s => s.id === lesson.studentId);
              const trainer = MOCK_TRAINERS.find(t => t.id === lesson.trainerId);
              const car = MOCK_CARS.find(c => c.id === lesson.carId);
              return {
                  ...lesson,
                  studentName: student?.name || 'Unknown',
                  trainerName: trainer?.name || 'Unknown',
                  carName: car ? `${car.make} ${car.model}` : 'Unknown',
              }
          });
      return simulateRequest(lessonsWithNames);
  },
   getLessonsForTrainer: async (trainerId: string): Promise<Lesson[]> => {
    const allLessons = await apiService.getLessons();
    const trainerLessons = allLessons.filter(l => l.trainerId === trainerId && l.status === 'scheduled');
    return simulateRequest(trainerLessons.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  },
  getPayments: async (officeId?: string): Promise<Payment[]> => {
    const studentsForUser = await apiService.getStudents(officeId);
    const studentIds = new Set(studentsForUser.map(s => s.id));

    const paymentsWithNames = MOCK_PAYMENTS
      .filter(p => studentIds.has(p.studentId))
      .map(p => ({
        ...p,
        studentName: MOCK_STUDENTS.find(s => s.id === p.studentId)?.name || 'Unknown',
    }));
    return simulateRequest(paymentsWithNames);
  },
  getExams: async (officeId?: string): Promise<Exam[]> => {
    const studentsForUser = await apiService.getStudents(officeId);
    const studentIds = new Set(studentsForUser.map(s => s.id));

    const examsWithNames = MOCK_EXAMS
      .filter(e => studentIds.has(e.studentId))
      .map(e => ({
        ...e,
        studentName: MOCK_STUDENTS.find(s => s.id === e.studentId)?.name || 'Unknown',
    }));
    return simulateRequest(examsWithNames);
  },
  getMaintenanceForVehicle: async (vehicleId: string): Promise<Maintenance[]> => {
    const records = MOCK_MAINTENANCE.filter(m => m.vehicleId === vehicleId);
    return simulateRequest(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },
  getAllMaintenance: async (): Promise<Maintenance[]> => simulateRequest(MOCK_MAINTENANCE),
  getInspectionsForCar: async (carId: string): Promise<Inspection[]> => {
    const records = MOCK_INSPECTIONS.filter(m => m.carId === carId);
    return simulateRequest(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },
   getStudentProgressDetails: async (studentId: string): Promise<StudentProgressDetails> => {
    const allLessons = await apiService.getLessons();
    const allExams = await apiService.getExams();
    const studentLessons = allLessons.filter(l => l.studentId === studentId);
    const studentExams = allExams.filter(e => e.studentId === studentId);
    return simulateRequest({
      lessons: studentLessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      exams: studentExams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    });
  },
  getCharges: async (): Promise<Charge[]> => simulateRequest(MOCK_CHARGES),
  addCharge: async (chargeData: Omit<Charge, 'id'>): Promise<Charge> => {
    const newCharge: Charge = {
      ...chargeData,
      id: `CH${String(MOCK_CHARGES.length + 1).padStart(3, '0')}`,
    };
    MOCK_CHARGES.push(newCharge);
    return simulateRequest(newCharge);
  },
  addMaintenance: async (maintenanceData: Omit<Maintenance, 'id'>): Promise<Maintenance> => {
    const newMaintenance: Maintenance = {
      ...maintenanceData,
      id: `M${String(MOCK_MAINTENANCE.length + 1).padStart(3, '0')}`,
    };
    MOCK_MAINTENANCE.push(newMaintenance);

    const vehicleId = maintenanceData.vehicleId;
    let vehicleList: (Car | Truck | Bus | Motorcycle)[] | null = null;
    
    if(vehicleId.startsWith('C')) {
        vehicleList = MOCK_CARS;
    } else if (vehicleId.startsWith('TR')) {
        vehicleList = MOCK_TRUCKS;
    } else if (vehicleId.startsWith('B')) {
        vehicleList = MOCK_BUSES;
    } else if (vehicleId.startsWith('M')) {
        vehicleList = MOCK_MOTORCYCLES;
    }

    if(vehicleList) {
        const vehicleIndex = vehicleList.findIndex(v => v.id === vehicleId);

        if (vehicleIndex !== -1) {
            if (newMaintenance.status === 'scheduled') {
                vehicleList[vehicleIndex].status = 'maintenance';
            } else if (newMaintenance.status === 'completed') {
                const hasOtherScheduled = MOCK_MAINTENANCE.some(
                    m => m.vehicleId === vehicleId && m.status === 'scheduled'
                );
                if (!hasOtherScheduled) {
                    vehicleList[vehicleIndex].status = 'available';
                }
            }
        }
    }

    return simulateRequest(newMaintenance);
  },
  addInspection: async (inspectionData: Omit<Inspection, 'id'>): Promise<Inspection> => {
    const newInspection: Inspection = {
      ...inspectionData,
      id: `I${String(MOCK_INSPECTIONS.length + 1).padStart(3, '0')}`,
    };
    MOCK_INSPECTIONS.push(newInspection);
    return simulateRequest(newInspection);
  },
  addStudent: async (studentData: Omit<Student, 'id' | 'archived'>): Promise<Student> => {
    const newStudent: Student = {
      ...studentData,
      id: `S${String(MOCK_STUDENTS.length + 1).padStart(3, '0')}`,
      archived: false,
    };
    MOCK_STUDENTS.push(newStudent);
    return simulateRequest(newStudent);
  },
  addTrainer: async (trainerData: Omit<Trainer, 'id' | 'hireDate'>): Promise<Trainer> => {
    const newTrainer: Trainer = {
      ...trainerData,
      id: `T${String(MOCK_TRAINERS.length + 1).padStart(2, '0')}`,
      hireDate: new Date().toISOString().split('T')[0],
    };
    MOCK_TRAINERS.push(newTrainer);
    return simulateRequest(newTrainer);
  },
  addStaff: async (staffData: Omit<Staff, 'id' | 'hireDate' | 'status'>): Promise<Staff> => {
    const newStaff: Staff = {
      ...staffData,
      id: `STF${String(MOCK_STAFF.length + 1).padStart(2, '0')}`,
      hireDate: new Date().toISOString().split('T')[0],
      status: 'present',
    };
    MOCK_STAFF.push(newStaff);
    return simulateRequest(newStaff);
  },
  addCar: async (carData: Omit<Car, 'id'>): Promise<Car> => {
    const newCar: Car = {
      ...carData,
      id: `C${String(MOCK_CARS.length + 101)}`,
    };
    MOCK_CARS.push(newCar);
    return simulateRequest(newCar);
  },
  addTruck: async (truckData: Omit<Truck, 'id'>): Promise<Truck> => {
    const newTruck: Truck = {
      ...truckData,
      id: `TR${String(MOCK_TRUCKS.length + 1).padStart(2, '0')}`,
    };
    MOCK_TRUCKS.push(newTruck);
    return simulateRequest(newTruck);
  },
  addBus: async (busData: Omit<Bus, 'id'>): Promise<Bus> => {
    const newBus: Bus = {
      ...busData,
      id: `B${String(MOCK_BUSES.length + 1).padStart(2, '0')}`,
    };
    MOCK_BUSES.push(newBus);
    return simulateRequest(newBus);
  },
  addMotorcycle: async (motorcycleData: Omit<Motorcycle, 'id'>): Promise<Motorcycle> => {
    const newMotorcycle: Motorcycle = {
      ...motorcycleData,
      id: `M${String(MOCK_MOTORCYCLES.length + 1).padStart(2, '0')}`,
    };
    MOCK_MOTORCYCLES.push(newMotorcycle);
    return simulateRequest(newMotorcycle);
  },
  addLesson: async (lessonData: Omit<Lesson, 'id'>): Promise<Lesson> => {
    const newLesson: Lesson = {
      ...lessonData,
      id: `L${String(MOCK_LESSONS.length + 1).padStart(3, '0')}`,
    };
    MOCK_LESSONS.push(newLesson);
    return simulateRequest(newLesson);
  },
  addPayment: async (paymentData: Omit<Payment, 'id' | 'studentName'>): Promise<Payment> => {
    const newPayment: Payment = {
      ...paymentData,
      id: `P${String(MOCK_PAYMENTS.length + 1).padStart(3, '0')}`,
    };
    MOCK_PAYMENTS.push(newPayment);
    const paymentWithStudentName = {
      ...newPayment,
      studentName: MOCK_STUDENTS.find(s => s.id === newPayment.studentId)?.name || 'Unknown',
    };

    const student = MOCK_STUDENTS.find(s => s.id === newPayment.studentId);
    if (student && !student.archived) {
        const studentExams = MOCK_EXAMS.filter(ex => ex.studentId === student.id);
        const hasPassedTheory = studentExams.some(ex => ex.type === 'theory' && ex.result === 'passed');
        const hasPassedPractical = studentExams.some(ex => ex.type === 'practical' && ex.result === 'passed');

        if (hasPassedTheory && hasPassedPractical) {
            const categoryPrice = LICENSE_CATEGORY_PRICES[student.licenseCategory] || 0;
            const totalPaid = MOCK_PAYMENTS
                .filter(p => p.studentId === student.id)
                .reduce((sum, p) => sum + p.amount, 0);
            
            if (totalPaid >= categoryPrice) {
                const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === student.id);
                if (studentIndex > -1) {
                    MOCK_STUDENTS[studentIndex].archived = true;
                    
                    const archiveNotif: Notification = {
                        id: `N${MOCK_NOTIFICATIONS.length + 1}`,
                        studentId: student.id,
                        studentName: student.name,
                        message: `${student.name}'s file has been archived after final payment.`,
                        date: new Date().toISOString(),
                        read: false,
                        type: 'completion'
                    };
                    MOCK_NOTIFICATIONS.unshift(archiveNotif);
                }
            }
        }
    }

    return simulateRequest(paymentWithStudentName);
  },
  addExam: async (examData: Omit<Exam, 'id' | 'studentName'>): Promise<Exam> => {
    const newExam: Exam = {
      ...examData,
      id: `E${String(MOCK_EXAMS.length + 1).padStart(3, '0')}`,
    };
    MOCK_EXAMS.push(newExam);
    const examWithStudentName = {
        ...newExam,
        studentName: MOCK_STUDENTS.find(s => s.id === newExam.studentId)?.name || 'Unknown',
    }
    
    // Check for completion and archive logic
    const studentExams = MOCK_EXAMS.filter(ex => ex.studentId === newExam.studentId);
    const hasPassedTheory = studentExams.some(ex => ex.type === 'theory' && ex.result === 'passed');
    const hasPassedPractical = studentExams.some(ex => ex.type === 'practical' && ex.result === 'passed');

    if (hasPassedTheory && hasPassedPractical) {
        const student = MOCK_STUDENTS.find(s => s.id === newExam.studentId);
        if (student && !student.archived) {
            const completionNotif: Notification = {
                id: `N${MOCK_NOTIFICATIONS.length + 1}`,
                studentId: student.id,
                studentName: student.name,
                message: `${student.name} has passed all required exams.`,
                date: new Date().toISOString(),
                read: false,
                type: 'completion'
            };
            MOCK_NOTIFICATIONS.unshift(completionNotif);

            const categoryPrice = LICENSE_CATEGORY_PRICES[student.licenseCategory] || 0;
            const totalPaid = MOCK_PAYMENTS
                .filter(p => p.studentId === student.id)
                .reduce((sum, p) => sum + p.amount, 0);
            
            const remainingBalance = categoryPrice - totalPaid;

            if (remainingBalance > 0) {
                const paymentNotif: Notification = {
                    id: `N${MOCK_NOTIFICATIONS.length + 1}`,
                    studentId: student.id,
                    studentName: student.name,
                    message: `Collect remaining ${remainingBalance.toFixed(2)} DH from ${student.name} to archive their file.`,
                    date: new Date().toISOString(),
                    read: false,
                    type: 'payment_due'
                };
                MOCK_NOTIFICATIONS.unshift(paymentNotif);
            } else {
                const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === student.id);
                if (studentIndex > -1) {
                    MOCK_STUDENTS[studentIndex].archived = true;
                    
                    const archiveNotif: Notification = {
                        id: `N${MOCK_NOTIFICATIONS.length + 1}`,
                        studentId: student.id,
                        studentName: student.name,
                        message: `${student.name}'s file has been automatically archived.`,
                        date: new Date().toISOString(),
                        read: false,
                        type: 'completion'
                    };
                    MOCK_NOTIFICATIONS.unshift(archiveNotif);
                }
            }
        }
    }

    return simulateRequest(examWithStudentName);
  },
  getLicensePrices: async (): Promise<{ [key: string]: number }> => {
    return simulateRequest(LICENSE_CATEGORY_PRICES);
  },
  addLicensePrice: async (category: string, price: number): Promise<{ [key: string]: number }> => {
      const upperCategory = category.toUpperCase();
      if (LICENSE_CATEGORY_PRICES[upperCategory]) {
          throw new Error(`Category '${upperCategory}' already exists.`);
      }
      LICENSE_CATEGORY_PRICES[upperCategory] = price;
      return simulateRequest(LICENSE_CATEGORY_PRICES);
  },
  updateLicensePrice: async (category: string, price: number): Promise<{ [key: string]: number }> => {
      if (LICENSE_CATEGORY_PRICES[category] === undefined) {
          throw new Error('Category does not exist.');
      }
      LICENSE_CATEGORY_PRICES[category] = price;
      return simulateRequest(LICENSE_CATEGORY_PRICES);
  },
  deleteLicensePrice: async (category: string, price: number): Promise<{ [key: string]: number }> => {
      if (LICENSE_CATEGORY_PRICES[category] === undefined) {
          throw new Error('Category does not exist.');
      }
      delete LICENSE_CATEGORY_PRICES[category];
      return simulateRequest(LICENSE_CATEGORY_PRICES);
  },
  getSchoolProfile: async (): Promise<SchoolProfile> => simulateRequest(MOCK_SCHOOL_PROFILE),
  updateSchoolProfile: async (profileData: SchoolProfile): Promise<SchoolProfile> => {
    // FIX: Cannot assign to an imported variable. Instead, mutate the properties of the imported object.
    Object.assign(MOCK_SCHOOL_PROFILE, profileData);
    return simulateRequest(MOCK_SCHOOL_PROFILE);
  },

  getAttendance: async (date: string, officeId?: string): Promise<Attendance[]> => {
    const officeStudents = MOCK_STUDENTS.filter(s => s.officeId === officeId);
    const officeStudentIds = new Set(officeStudents.map(s => s.id));
    const allStaffIds = new Set(MOCK_STAFF.map(s => s.id));

    const records = MOCK_ATTENDANCE.filter(att => {
        if (att.date !== date) return false;
        if (att.entityType === 'student' && officeStudentIds.has(att.entityId)) return true;
        if (att.entityType === 'staff' && allStaffIds.has(att.entityId)) return true;
        return false;
    });

    return simulateRequest(records);
  },

  markAttendance: async (attendanceData: Omit<Attendance, 'id'>[]): Promise<Attendance[]> => {
    const updatedRecords: Attendance[] = [];
    attendanceData.forEach(newRecord => {
        const existingIndex = MOCK_ATTENDANCE.findIndex(
            att => att.date === newRecord.date && att.entityId === newRecord.entityId
        );
        
        if (existingIndex > -1) {
            // Update existing
            MOCK_ATTENDANCE[existingIndex].status = newRecord.status;
            MOCK_ATTENDANCE[existingIndex].notes = newRecord.notes;
            updatedRecords.push(MOCK_ATTENDANCE[existingIndex]);
        } else {
            // Create new
            const newAttendance: Attendance = {
                ...newRecord,
                id: `ATT${String(MOCK_ATTENDANCE.length + 1).padStart(3, '0')}`
            };
            MOCK_ATTENDANCE.push(newAttendance);
            updatedRecords.push(newAttendance);
        }
    });
    return simulateRequest(updatedRecords);
  },
  
  getNotifications: async (): Promise<Notification[]> => {
    return simulateRequest(MOCK_NOTIFICATIONS);
  },
  markNotificationAsRead: async (notificationId: string): Promise<{ success: boolean }> => {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if(notif) {
        notif.read = true;
    }
    return simulateRequest({ success: !!notif });
  },
  markAllNotificationsAsRead: async (): Promise<{ success: boolean }> => {
    MOCK_NOTIFICATIONS.forEach(n => n.read = true);
    return simulateRequest({ success: true });
  },
  getSubscriptions: async (): Promise<Subscription[]> => simulateRequest(MOCK_SUBSCRIPTIONS),
  updateSubscription: async (updatedPlan: Subscription): Promise<Subscription> => {
    const index = MOCK_SUBSCRIPTIONS.findIndex(sub => sub.id === updatedPlan.id);
    if (index > -1) {
        MOCK_SUBSCRIPTIONS[index] = updatedPlan;
        return simulateRequest(updatedPlan);
    }
    throw new Error('Subscription not found');
  },
};