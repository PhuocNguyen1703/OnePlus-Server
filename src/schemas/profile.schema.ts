import z from 'zod'

export const studentStatusEnum = z.enum(['active', 'inactive', 'graduated'])
export const genderEnum = z.enum(['male', 'female', 'other'])

const profileBase = z.object({
  userId: z.string(),
  fullName: z.string().min(1).max(100).trim().nullable().prefault(null),
  coverUrl: z.url().optional(),
  dob: z.date().optional(),
  gender: genderEnum.optional(),
  address: z.string().max(200).optional(),
  phone: z.string().min(10).max(15).optional(),
  email: z.email().trim().optional(),
  createdAt: z.date(),
  updatedAt: z.date().nullable().prefault(null),
  _isDeleted: z.boolean().prefault(false)
})

const student = z.object({
  guardianInfo: z
    .object({
      fullName: z.string().min(1).max(100).trim(),
      phone: z.string().min(10).max(15),
      email: z.email().optional(),
      relationship: z.string().optional()
    })
    .optional(),
  enrollmentDate: z.date().nullable().prefault(null),
  status: studentStatusEnum.prefault('inactive'),
  currentCourses: z.array(z.string()).prefault([]),
  testResults: z
    .array(
      z.object({
        examId: z.string(),
        score: z.number().min(0).max(100),
        date: z.date(),
        notes: z.string().optional()
      })
    )
    .optional()
})

const qualification = z.object({
  degree: z.string().min(1).max(100),
  major: z.string().min(1).max(100).optional(),
  institution: z.string().min(1).max(100),
  year: z.int().min(1900).max(new Date().getFullYear()),
  certificateType: z.string().min(1).max(100).optional(),
  expiryDate: z.date().optional()
})

const teacher = z.object({
  qualifications: z.array(qualification).optional(),
  experience: z.string().max(500).optional(),
  contractUrl: z.url().optional(),
  assignedClasses: z.array(z.string()).prefault([])
})

const staff = z.object({
  department: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  jobDesc: z.string().max(200).optional()
})

export const studentSchema = profileBase.merge(student)
export const teacherSchema = profileBase.merge(teacher)
export const staffSchema = profileBase.merge(staff)

export type StudentType = z.infer<typeof studentSchema>
export type TeacherType = z.infer<typeof teacherSchema>
export type StaffType = z.infer<typeof staffSchema>
