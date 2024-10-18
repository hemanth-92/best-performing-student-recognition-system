"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data (this would be fetched from an API in a real application)
const batches = ["2020-2024", "2021-2025", "2022-2026"];
const students = {
  "2020-2024": [
    {
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      cgpa: 9.8,
      hackathons: 5,
      papers: 3,
      corePerformance: 95,
      contributions: 8,
    },
    {
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      cgpa: 9.7,
      hackathons: 4,
      papers: 2,
      corePerformance: 92,
      contributions: 7,
    },
    {
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=100&width=100",
      cgpa: 9.6,
      hackathons: 3,
      papers: 4,
      corePerformance: 90,
      contributions: 9,
    },
  ],
  "2021-2025": [
    // ... similar data for 2021-2025 batch
  ],
  "2022-2026": [
    // ... similar data for 2022-2026 batch
  ],
};

export default function Dashboard() {
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Student Performance Comparison",
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Performance Metrics",
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Score",
        },
        min: 0,
      },
    },
  };

  const chartData = {
    labels: [
      "CGPA",
      "Hackathons",
      "Papers",
      "Core Performance",
      "Contributions",
    ],
    datasets: students[selectedBatch].map((student, index) => ({
      label: student.name,
      data: [
        student.cgpa,
        student.hackathons,
        student.papers,
        student.corePerformance,
        student.contributions,
      ],
      backgroundColor: `rgba(${index * 100}, 99, 132, 0.5)`,
    })),
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Best-Performing Student Recognition System
      </h1>
      <div className="mb-6">
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch} value={batch}>
                {batch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {students[selectedBatch].map((student, index) => (
          <Card key={student.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                {student.name}
              </CardTitle>
              <CardDescription>Batch: {selectedBatch}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">CGPA: {student.cgpa}</p>
                  <p className="text-sm text-muted-foreground">
                    Hackathons: {student.hackathons}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Papers: {student.papers}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  Core Performance: {student.corePerformance}%
                </p>
                <p className="text-sm">
                  Contributions: {student.contributions}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar options={chartOptions} data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
