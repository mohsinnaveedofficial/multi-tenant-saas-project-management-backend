import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task/entities/task.entity';
import { Between, In, Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { ProjectAssignedUser } from '../project-assigned-users/entities/project-assigned-user.entity';
import { ProjectStatus } from '../project/enums/project-status.enum';
import { UserService } from '../user/user.service';
import { TaskStatus } from '../task/enums/task.enum';

@Injectable()
export class TeamService {

constructor(@InjectRepository(Task) private taskRepo:Repository<Task>,
@InjectRepository(ProjectAssignedUser) private projectAssignedUserRepo:Repository<ProjectAssignedUser>,
private userServices:UserService){}

    async dashboard(userId:string){
        const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);


  const assignedProjectsThisMonth = await this.projectAssignedUserRepo.find({
    where: {
      userId,
      assignedAt: Between(startOfMonth, endOfMonth),
    },
  });

  const assignedProjectsLastMonth = await this.projectAssignedUserRepo.find({
    where: {
      userId,
      assignedAt: Between(startOfPrevMonth, endOfPrevMonth),
    },
  });


  const tasksThisMonth = await this.taskRepo.find({
    where: {
      assignedTo: userId,
      createdAt: Between(startOfMonth, endOfMonth),
    },
  });

  const tasksLastMonth = await this.taskRepo.find({
    where: {
      assignedTo: userId,
      createdAt: Between(startOfPrevMonth, endOfPrevMonth),
    },
  });


  const totalTasks = tasksThisMonth.length;
  const totalTasksLastMonth = tasksLastMonth.length;

  const tasksInProgress = tasksThisMonth.filter(t => t.status === "inProgress").length;
  const tasksInProgressLastMonth = tasksLastMonth.filter(t => t.status === "inProgress").length;

  const tasksCompleted = tasksThisMonth.filter(t => t.status === "completed").length;
  const tasksCompletedLastMonth = tasksLastMonth.filter(t => t.status === "completed").length;

  const calcGrowth = (cur: number, prev: number) => {
    if (prev === 0) return cur === 0 ? 0 : cur; 
    return cur - prev;
  };


const allTasks = await this.taskRepo.find({
    where: { assignedTo: userId },
  });

  const totalCompleted = allTasks.filter(t => t.status === "completed").length;
  const totalInProgress = allTasks.filter(t => t.status === "inProgress").length;
  const totalTodo = allTasks.filter(t => t.status === "todo").length;
  const totalDelayed = allTasks.filter(t => t.status === "delayed").length;

  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeekTasks = await this.taskRepo.find({
    where: {
      assignedTo: userId,
      createdAt: Between(oneWeekAgo, new Date()),
    },
  });

  const weeklyMap: Record<string, number> = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  for (const task of thisWeekTasks) {
    const dayName = days[new Date(task.createdAt).getDay()];
    if (task.status === "completed") {
      weeklyMap[dayName] += 1;
    }
  }

  const WeeklyReportchartData = Object.keys(weeklyMap).map(day => ({
    day,
    performance: weeklyMap[day]
  }));


  return {
    assignedProjects: {
      value: assignedProjectsThisMonth.length,
      growth: calcGrowth(
        assignedProjectsThisMonth.length,
        assignedProjectsLastMonth.length,
      ),
    },
    totalTasks: {
      value: totalTasks,
      growth: calcGrowth(totalTasks, totalTasksLastMonth),
    },
    tasksInProgress: {
      value: tasksInProgress,
      growth: calcGrowth(tasksInProgress, tasksInProgressLastMonth),
    },
    tasksCompleted: {
      value: tasksCompleted,
      growth: calcGrowth(tasksCompleted, tasksCompletedLastMonth),
    },
    totalTaskSummary: {
      completed: totalCompleted,
      inProgress: totalInProgress,
      todo: totalTodo,
      delayed: totalDelayed,
    },

    weeklyReport: WeeklyReportchartData,
  };

    }
async getTeamReport(userId: string) {
  
    const user = await this.userServices.findOne(userId)
    if (!user) throw new NotFoundException('User not found');

  
    const tasks = await this.taskRepo.find({
      where: { assignee: { id: userId } },
      relations: ['project'],
    });

    const taskStatusCount = {
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    };

    
    const projectsAssigned = new Set(tasks.map(t => t.projectId)).size;

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const avgCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => {
            const created = new Date(t.createdAt).getTime();
            const updated = new Date(t.updatedAt).getTime();
            return sum + (updated - created) / (1000 * 60 * 60 * 24); 
          }, 0) / completedTasks.length
        : 0;

    
    const totalTasks = tasks.length;
    const performanceScore =
      totalTasks > 0 ? Math.round((taskStatusCount.completed / totalTasks) * 100) : 0;


    return {
      totalTasksAssigned: totalTasks,
      projectsAssigned,
      avgCompletionTime: Number(avgCompletionTime.toFixed(2)), 
      performanceScore,
    
    };
  }


async reportPage(userId:string){
  const reportStats=await this.getTeamReport(userId);
  const {lastThreeProjects,monthlyChartData}=await this.getTeamCharts(userId)
  return {
    reportStats,lastThreeProjects,monthlyChartData
  }


}





async getTeamCharts(userId: string) {
  const user = await this.userServices.findOne(userId);
  if (!user) throw new NotFoundException("User not found");

  const tasks = await this.taskRepo.find({
    where: { assignedTo: userId },
    relations: ["project"],
  });

 

  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyChartData = months.map((monthName, index) => {
    const month = index + 5; 

    const completedCount = tasks.filter(t => {
      if (t.status !== TaskStatus.COMPLETED) return false;
      const updated = new Date(t.updatedAt);
      return updated.getMonth() === month; 
    }).length;

    return {
      month: monthName,
      completed: completedCount,
    };
  });

  const assignedRows = await this.projectAssignedUserRepo.find({
    where: { userId },
    relations: ["project"],
    order: { assignedAt: "DESC" },
  });


  const uniqueProjectsMap = new Map();
  for (const row of assignedRows) {
    if (!uniqueProjectsMap.has(row.projectId)) {
      uniqueProjectsMap.set(row.projectId, row);
    }
  }

 
  const lastThreeProjects = Array.from(uniqueProjectsMap.values()).slice(0, 3);

  const projectIds = lastThreeProjects.map(p => p.projectId);

 
  const projectTasks = await this.taskRepo.find({
    where: projectIds.length > 0 ? { projectId: In(projectIds) } : undefined,
  });

  const projectBreakdown = lastThreeProjects.map(pa => {
    const pTasks = projectTasks.filter(t => t.projectId === pa.projectId);

    return {
      projectId: pa.projectId,
      projectName: pa.project?.name ?? "Unnamed Project",
      completed: pTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      inProgress: pTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      todo: pTasks.filter(t => t.status === TaskStatus.TODO).length,
      delayed: pTasks.filter(t => t.status === TaskStatus.DELAYED).length,
    };
  });

  return {
    monthlyChartData,     
    lastThreeProjects: projectBreakdown, 
  };
}






  }
