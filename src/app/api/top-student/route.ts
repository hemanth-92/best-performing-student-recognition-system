import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        students: {
          orderBy: { overallScore: "desc" },
          take: 3,
          include: {
            academicPerformances: true,
            hackathonParticipations: true,
            paperPresentations: true,
            coreCoursesExcellence: {
              include: { course: true },
            },
          },
        },
      },
    });

    const formattedBatches = batches.map((batch) => ({
      id: batch.id,
      year: batch.year,
      semester: batch.semester,
      students: batch.students.map((student) => ({
        id: student.id,
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        overallScore: student.overallScore,
        rank: student.rank,
        cgpa: calculateCGPA(student.academicPerformances),
        hackathons: student.hackathonParticipations.length,
        papers: student.paperPresentations.length,
        corePerformance: calculateCorePerformance(
          student.coreCoursesExcellence
        ),
        contributions: calculateContributions(student),
      })),
    }));

    return NextResponse.json(formattedBatches);
  } catch (error) {
    console.error("Error fetching top students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function calculateCGPA(academicPerformances: AcademicPerformance[]) {
  if (academicPerformances.length === 0) return 0;
  const totalGPA = academicPerformances.reduce(
    (sum, performance) => sum + performance.gpa,
    0
  );
  return totalGPA / academicPerformances.length;
}

function calculateCorePerformance(
  coreCoursesExcellence: CoreCoursePerformance[]
) {
  if (coreCoursesExcellence.length === 0) return 0;
  const totalGrade = coreCoursesExcellence.reduce(
    (sum, performance) => sum + performance.grade,
    0
  );
  return (totalGrade / coreCoursesExcellence.length) * 10; // Assuming grades are out of 10
}

function calculateContributions(student: Student) {
  return (
    student.hackathonParticipations.length + student.paperPresentations.length
  );
}

// Types based on the Prisma schema
type AcademicPerformance = {
  id: number;
  studentId: number;
  semester: number;
  gpa: number;
  createdAt: Date;
  updatedAt: Date;
};

type CoreCoursePerformance = {
  id: number;
  studentId: number;
  courseId: number;
  grade: number;
  semester: number;
  createdAt: Date;
  updatedAt: Date;
  course: Course;
};

type Course = {
  id: number;
  name: string;
  isCore: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type HackathonParticipation = {
  id: number;
  studentId: number;
  name: string;
  level: "LOCAL" | "NATIONAL" | "INTERNATIONAL";
  rank: number | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

type PaperPresentation = {
  id: number;
  studentId: number;
  title: string;
  conference: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

type Student = {
  id: number;
  name: string;
  email: string;
  enrollmentNumber: string;
  batchId: number;
  overallScore: number;
  rank: number | null;
  createdAt: Date;
  updatedAt: Date;
  academicPerformances: AcademicPerformance[];
  hackathonParticipations: HackathonParticipation[];
  paperPresentations: PaperPresentation[];
  coreCoursesExcellence: CoreCoursePerformance[];
};
