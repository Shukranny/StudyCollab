import type { Project, Task } from "../types"

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Final Year Project",
    description: "A collaborative research project on machine learning applications in healthcare",
    dueDate: "2025-05-15",
    progress: 35,
    color: "#2563EB",
    members: ["John Doe", "Sarah Johnson", "Alex Wilson"],
  },
  {
    id: "2",
    name: "Literature Review",
    description: "Comprehensive review of research papers on sustainable energy",
    dueDate: "2025-03-22",
    progress: 75,
    color: "#0D9488",
    members: ["Emma Lee", "John Doe"],
  },
  {
    id: "3",
    name: "Study Group",
    description: "Prepare for upcoming exams by solving past papers together",
    dueDate: "2025-02-10",
    progress: 50,
    color: "#F59E0B",
    members: ["John Doe", "David Williams", "Sarah Johnson", "Emma Lee"],
  },
  {
    id: "4",
    name: "Research Methods",
    description: "Collaborative project on research methodology and data analysis",
    dueDate: "2025-04-05",
    progress: 20,
    color: "#8B5CF6",
    members: ["Sarah Johnson", "Emma Lee"],
  },
  {
    id: "5",
    name: "Design Project",
    description: "Creating a UI/UX design for a mobile application",
    dueDate: "2025-03-15",
    progress: 60,
    color: "#EC4899",
    members: ["Alex Wilson", "John Doe"],
  },
]

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Write introduction chapter",
    description: "Draft the introduction chapter for the final paper",
    projectId: "1",
    projectName: "Final Year Project",
    assignedTo: "John Doe",
    dueDate: "2025-02-15",
    priority: "high",
    completed: false,
  },
  {
    id: "2",
    title: "Analyze research data",
    description: "Process and analyze the collected data using statistical methods",
    projectId: "1",
    projectName: "Final Year Project",
    assignedTo: "Sarah Johnson",
    dueDate: "2025-02-20",
    priority: "medium",
    completed: false,
  },
  {
    id: "3",
    title: "Review research papers",
    description: "Read and summarize 5 research papers",
    projectId: "2",
    projectName: "Literature Review",
    assignedTo: "Emma Lee",
    dueDate: "2025-02-08",
    priority: "high",
    completed: true,
  },
  {
    id: "4",
    title: "Create bibliography",
    description: "Compile all references into a formatted bibliography",
    projectId: "2",
    projectName: "Literature Review",
    assignedTo: "John Doe",
    dueDate: "2025-02-18",
    priority: "low",
    completed: false,
  },
  {
    id: "5",
    title: "Prepare study materials",
    description: "Organize notes and create study guides",
    projectId: "3",
    projectName: "Study Group",
    assignedTo: "David Williams",
    dueDate: "2025-02-07",
    priority: "medium",
    completed: true,
  },
  {
    id: "6",
    title: "Schedule weekly meetings",
    description: "Set up recurring meetings for the study group",
    projectId: "3",
    projectName: "Study Group",
    assignedTo: "Sarah Johnson",
    dueDate: "2025-02-05",
    priority: "low",
    completed: true,
  },
  {
    id: "7",
    title: "Draft research methodology",
    description: "Document the research approach and methodologies",
    projectId: "4",
    projectName: "Research Methods",
    assignedTo: "Sarah Johnson",
    dueDate: "2025-02-25",
    priority: "high",
    completed: false,
  },
  {
    id: "8",
    title: "Create wireframes",
    description: "Design initial wireframes for the mobile app",
    projectId: "5",
    projectName: "Design Project",
    assignedTo: "Alex Wilson",
    dueDate: "2025-02-12",
    priority: "medium",
    completed: false,
  },
  {
    id: "9",
    title: "User testing",
    description: "Conduct user testing sessions with prototypes",
    projectId: "5",
    projectName: "Design Project",
    assignedTo: "John Doe",
    dueDate: "2025-03-01",
    priority: "high",
    completed: false,
  },
  {
    id: "10",
    title: "Final presentation",
    description: "Prepare slides for the final project presentation",
    projectId: "1",
    projectName: "Final Year Project",
    assignedTo: "Alex Wilson",
    dueDate: "2025-04-20",
    priority: "medium",
    completed: false,
  },
]
