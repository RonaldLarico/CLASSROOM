export interface Corporation {
  id: number;
  name: string;
  resolution: string;
  description: string;
  ruc: string;
  email: string;
  image?: string;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  //institute: CorporationOnInstitute[];
  //studentCourse: CorporationOnStudentCourse[];
  //studentGraduate: CorporationOnStudentGraduate[];
  graduate: CorporationOnGraduate[];
  //module: CorporationOnModule[];
}


export type Institute = {
  id: number; // Autoincrementing ID
  name: string; // Required name
  description?: string; // Optional description
  image?: string; // Optional image URL
  observation?: string; // Optional observation
  createdAt: Date; // Created timestamp
  updatedAt: Date; // Updated timestamp
  corporation: CorporationOnInstitute[]; // Array of CorporationOnInstitute references
};

export type CorporationOnInstitute = {
  corporationId: number;
  instituteId: number;
  corporation: Corporation;
  institute: Institute;
};


interface Exam {}

interface Module {}

interface CorporationOnGraduate {}

interface StudentOnGraduate {}

export interface Graduate {
  id: number;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  state: boolean;
  startAd: Date;
  endAd: Date;
  totalPrice: number;
  credits: string;
  observation?: string;
  checkImage: boolean;
  createdAt: Date;
  updatedAt: Date;

  exam: Exam[];
  corporation: CorporationOnGraduate[];
  module: Array<{
    id: number;
    name: string;
    code: string;
    topics: string[];
  }>;
  // Uncomment and adjust the corporation field if needed
  // corporation: Array<{
  //   corporationId: number;
  //   graduateId: number;
  //   corporation: {
  //     id: number;
  //     name: string;
  //     image: string | null;
  //   };
  // }>;
  studentGraduate: Array<{
    studentGraduateId: number;
    graduateId: number;
    studentGraduate: StudentGraduate;
  }>;
}

export interface Participant {
  id: number;
  fullName: string;
  documentNumber: string;
  password: string;
  email: string;
  birthDate?: Date;
  phone: string[];
  address?: string;
  code: string;
  state: boolean;
  active: boolean;
  occupation?: string;
  form?: string;
  dniImage?: string;
  imageTitle?: string;
  voucher?: string;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;
  graduate: StudentOnGraduate[];
  // Add any other properties that might be needed
}

export interface StudentGraduate {
  id: number;
  fullName: string;
  documentNumber: string;
  password: string;
  email: string;
  //role: Role;
  birthDate?: Date;
  phone: string[];
  address?: string;
  //gender?: Gender;
  code: string;
  state: boolean;
  active: boolean;
  occupation?: string;
  form?: string;
  dniImage?: string;
  imageTitle?: string;
  voucher?: string;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;
  documentType?: 'dni' | 'passport' | 'other';
  //passwordReset: Password[];
  //result: Result[];
  //paymentRegister: PaymentRegister[];
  quota: QuotaGraduate[];
  //studentModule: StudentModule[];
  //corporation: CorporationOnStudentGraduate[];
  graduate: StudentOnGraduate[];
}

// Definimos la interfaz User
export interface User {
  id: number;
  documentNumber: string;
  password: string;
  state: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  staff?: Staff;
  //passwordReset: Password[];
  corporationId?: number;
  corporation?: Corporation;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  ADVISORY = "ADVISORY",
  FINANCE = "FINANCE",
  ACCOUNTING = "ACCOUNTING",
  IMAGE = "IMAGE",
  STAFF = "STAFF"
}

export interface Staff {
  id: number;
  fullName: string;
  email: string;
  photo?: string;
  //gender: Gender;
  birthDate?: Date;
  phone: string;
  bankName?: string;
  numberBank?: string;
  payment?: number;
  paymentCorporation?: string;
  liquidation?: string;
  observation?: string;
  userId: number;
  user: User;
  //staffPayment: StaffPayment[];
}


export interface QuotaGraduate {
  id: number;
  name: string;
  price: number; // Assuming Decimal is a number type
  state: boolean;
  date: Date;
  observation?: string;
  voucher1?: string;
  voucher2?: string;
  createdAt: Date;
  updatedAt: Date;
  studentGraduateId: number;
  studentGraduate: StudentGraduate; // Assuming StudentGraduate is another interface
}
