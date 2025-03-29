export interface MedicalRequest {
    _id: string;
    RecordId: string; 
    Status: string;
    Reason: string; 
    Notes: string; 
    CreatedDate: string; 
    __v: number;
    AssignedDate: string;
    DoctorId: string;
    ManagerId: string;
  }