import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { Task } from '../task/entities/task.entity';
import { Finance } from '../finance/entities/finance.entity';
import { Between, In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Client } from '../client/entities/client.entity';
import { ProjectStatus } from '../project/enums/project-status.enum';
import { TaskStatus } from '../task/enums/task.enum';
import { ProjectService } from '../project/project.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Finance) private financeRepo: Repository<Finance>,
    private userServices: UserService,
    private projectService: ProjectService,
    private tenantService:TenantService
  ) {}

  private percentageGrowth(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }

  async getFinanceSummary(tenantId: string, start: Date, end: Date) {
    const finances = await this.financeRepo.find({
      where: { tenantId, date: Between(start, end) },
    });

    let revenue = 0;
    let profit = 0;
    let cost = 0;

    for (const f of finances) {
      revenue += Number(f.revenue);
      profit += Number(f.profit);
      cost += Number(f.cost);
    }

    return { revenue, profit, cost };
  }

  async dashboard(userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30Days = new Date(
      last30Days.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const tenantId = user.tenantId;

    const currentClient = await this.clientRepo.count({
      where: { tenantId, createdAt: Between(last30Days, now) },
    });
    const previousClient = await this.clientRepo.count({
      where: { tenantId, createdAt: Between(prev30Days, last30Days) },
    });

    const currentActiveProject = await this.projectRepo.count({
      where: {
        tenantId,
        status: In([ProjectStatus.IN_PROGRESS, ProjectStatus.PENDING]),
        createdAt: Between(last30Days, now),
      },
    });
    const prevActiveProject = await this.projectRepo.count({
      where: {
        tenantId,
        status: In([ProjectStatus.IN_PROGRESS, ProjectStatus.PENDING]),
        createdAt: Between(prev30Days, last30Days),
      },
    });

    const currentActiveTask = await this.taskRepo.count({
      where: {
        tenantId,
        status: In([
          TaskStatus.TODO,
          TaskStatus.IN_PROGRESS,
          TaskStatus.REVIEW,
          TaskStatus.DELAYED,
        ]),
        createdAt: Between(last30Days, now),
      },
    });
    const prevActiveTask = await this.taskRepo.count({
      where: {
        tenantId,
        status: In([
          TaskStatus.TODO,
          TaskStatus.IN_PROGRESS,
          TaskStatus.REVIEW,
          TaskStatus.DELAYED,
        ]),
        createdAt: Between(prev30Days, last30Days),
      },
    });

    const currentCompletedTask = await this.taskRepo.count({
      where: {
        tenantId,
        status: TaskStatus.COMPLETED,
        createdAt: Between(last30Days, now),
      },
    });
    const prevCompletedTask = await this.taskRepo.count({
      where: {
        tenantId,
        status: TaskStatus.COMPLETED,
        createdAt: Between(prev30Days, last30Days),
      },
    });

    const currentFinance = await this.getFinanceSummary(
      tenantId,
      last30Days,
      now,
    );

    const prevFinance = await this.getFinanceSummary(
      tenantId,
      prev30Days,
      last30Days,
    );

    const currentTotalRevenue = currentFinance.revenue;
    const currentTotalProfit = currentFinance.profit;
    const currentTotalCost = currentFinance.cost;

    const prevTotalRevenue = prevFinance.revenue;
    const prevTotalProfit = prevFinance.profit;
    const prevTotalCost = prevFinance.cost;

    const projectStatuses = Object.values(ProjectStatus);
    const statusCounts = {} as Record<string, number>;
    for (const status of projectStatuses) {
      statusCounts[status] = await this.projectRepo.count({
        where: { tenantId, status },
      });
    }

    const monthlyChartData = await this.getCharData(user.tenantId);
    const project = await this.projectService.findAll(userId);

    return {
      totalClient: {
        value: currentClient,
        growth: this.percentageGrowth(currentClient, previousClient),
      },
      activeProjects: {
        value: currentActiveProject,
        growth: this.percentageGrowth(currentActiveProject, prevActiveProject),
      },
      activeTasks: {
        value: currentActiveTask,
        growth: this.percentageGrowth(currentActiveTask, prevActiveTask),
      },
      completedTasks: {
        value: currentCompletedTask,
        growth: this.percentageGrowth(currentCompletedTask, prevCompletedTask),
      },
      totalRevenue: {
        value: currentTotalRevenue,
        growth: this.percentageGrowth(currentTotalRevenue, prevTotalRevenue),
      },
      netProfit: {
        value: currentTotalProfit,
        growth: this.percentageGrowth(currentTotalProfit, prevTotalProfit),
      },
      totalCost: {
        value: currentTotalCost,
        growth: this.percentageGrowth(currentTotalCost, prevTotalCost),
      },
      projectStatusCounts: statusCounts,
      monthlyChartData,
      project,
    };
  }

  async getCharData(tenantId: string) {
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);

    const finances = await this.financeRepo.find({
      where: {
        tenantId,
        date: Between(twelveMonthsAgo, now),
      },
    });

    const chartData: { month: string; revenue: number; cost: number }[] = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(twelveMonthsAgo);
      monthDate.setMonth(twelveMonthsAgo.getMonth() + i);

      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const monthNumber = monthDate.getMonth();
      const year = monthDate.getFullYear();

      
      const monthlyFinances = finances.filter((f) => {
  const d = new Date(f.createdAt);

  return d.getMonth() === monthNumber && d.getFullYear() === year;
});



      
      const revenue = monthlyFinances.reduce(
        (sum, f) => sum + Number(f.revenue),
        0,
      );
      const cost = monthlyFinances.reduce((sum, f) => sum + Number(f.cost), 0);

      chartData.push({ month: monthName, revenue, cost });
    }
    return chartData;
  }

  async financePageData(userId: string) {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30Days = new Date(
      last30Days.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tenantId = user.tenantId;
    const currentFinance = await this.getFinanceSummary(
      tenantId,
      last30Days,
      now,
    );

    const prevFinance = await this.getFinanceSummary(
      tenantId,
      prev30Days,
      last30Days,
    );

    const currentTotalRevenue = currentFinance.revenue;
    const currentTotalProfit = currentFinance.profit;
    const currentTotalCost = currentFinance.cost;

    const prevTotalRevenue = prevFinance.revenue;
    const prevTotalProfit = prevFinance.profit;
    const prevTotalCost = prevFinance.cost;

    const monthlyPerformance = await this.getMonthlyChartData(tenantId);

    return {
      totalRevenue: {
        value: currentTotalRevenue,
        growth: this.percentageGrowth(currentTotalRevenue, prevTotalRevenue),
      },
      netProfit: {
        value: currentTotalProfit,
        growth: this.percentageGrowth(currentTotalProfit, prevTotalProfit),
      },
      totalCost: {
        value: currentTotalCost,
        growth: this.percentageGrowth(currentTotalCost, prevTotalCost),
      },
      monthlyPerformance,
    };
  }

  async getMonthlyChartData(tenantId: string) {
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
    const finances = await this.financeRepo.find({
      where: { tenantId, date: Between(lastYear, now) },
    });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const chartData = months.map((month) => ({ month, performance: 0 }));

    finances.forEach((f) => {
      const monthIndex = new Date(f.date).getMonth();

      chartData[monthIndex].performance += Number(f.revenue);
    });

    return chartData;
  }

  async ReportPageData(userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tenantId = user.tenantId;
    const projectCompletionRate =
      await this.getLast6MonthsProjectCompletion(tenantId);
    const teamProductivity = await this.getLast4WeeksTaskStats(tenantId);
    const clientByProjectCount = await this.getClientProjectChartData(tenantId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthProjects = await this.projectRepo.find({
      where: {
        tenantId,
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });

    const prevMonthProjects = await this.projectRepo.find({
      where: {
        tenantId,
        createdAt: Between(startOfPrevMonth, endOfPrevMonth),
      },
    });

    const completedThisMonth = currentMonthProjects.filter(
      (p) => p.status === ProjectStatus.COMPLETED,
    ).length;

    const completedPrevMonth = prevMonthProjects.filter(
      (p) => p.status === ProjectStatus.COMPLETED,
    ).length;

    const completionRate =
      currentMonthProjects.length === 0
        ? 0
        : Math.round((completedThisMonth / currentMonthProjects.length) * 100);

    const prevCompletionRate =
      prevMonthProjects.length === 0
        ? 0
        : Math.round((completedPrevMonth / prevMonthProjects.length) * 100);

    const completedProjects = currentMonthProjects.filter(
      (p) => p.status === ProjectStatus.COMPLETED && p.start && p.end,
    );

    const avgProjectTime =
      completedProjects.length === 0
        ? 0
        : Math.round(
            completedProjects.reduce(
              (sum, p) =>
                sum +
                (new Date(p.end!).getTime() - new Date(p.start!).getTime()) /
                  (1000 * 60 * 60 * 24),
              0,
            ) / completedProjects.length,
          );

    const prevCompletedProjects = prevMonthProjects.filter(
      (p) => p.status === ProjectStatus.COMPLETED && p.start && p.end,
    );

    const prevAvgProjectTime =
      prevCompletedProjects.length === 0
        ? 0
        : Math.round(
            prevCompletedProjects.reduce(
              (sum, p) =>
                sum +
                (new Date(p.end!).getTime() - new Date(p.start!).getTime()) /
                  (1000 * 60 * 60 * 24),
              0,
            ) / prevCompletedProjects.length,
          );

    const projectGrowth =
      prevMonthProjects.length === 0
        ? currentMonthProjects.length * 100
        : ((currentMonthProjects.length - prevMonthProjects.length) /
            prevMonthProjects.length) *
          100;

    const completionRateGrowth = completionRate - prevCompletionRate;
    const avgProjectTimeGrowth = avgProjectTime - prevAvgProjectTime;

    return {
      projectCompletionRate,
      teamProductivity,
      clientByProjectCount,
      projectThisMonth: {
        value: currentMonthProjects.length,
        growth: Math.round(projectGrowth),
      },
      completionRate: {
        value: completionRate,
        growth: completionRateGrowth,
      },
      avgProjectTime: {
        value: avgProjectTime,
        growth: avgProjectTimeGrowth,
      },
    };
  }

  async getClientProjectChartData(tenantId: string) {
    const ranges = [
      { min: 1, max: 1, label: '1 project' },
      { min: 2, max: 3, label: '2–3 projects' },
      { min: 4, max: 6, label: '4–6 projects' },
      { min: 7, max: 10, label: '7–10 projects' },
      { min: 11, max: 15, label: '11–15 projects' },
      { min: 16, max: 20, label: '16–20 projects' },
      { min: 21, max: 25, label: '21–25 projects' },
      { min: 26, max: 30, label: '26–30 projects' },
      { min: 31, max: 40, label: '31–40 projects' },
      { min: 41, max: Infinity, label: '41–50+ projects' },
    ];

    const chartData: { range: string; clients: number }[] = [];

    const clients = await this.clientRepo.find({
      where: { tenantId },
      relations: ['projects'],
    });

    for (const range of ranges) {
      const count = clients.filter((c) => {
        const projectCount = c.projects.length;
        return projectCount >= range.min && projectCount <= range.max;
      }).length;

      chartData.push({ range: range.label, clients: count });
    }

    return chartData;
  }

  async getLast6MonthsProjectCompletion(tenantId: string) {
    const now = new Date();
    const chartData: { month: string; completion: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const completedCount = await this.projectRepo.count({
        where: {
          tenantId,
          status: ProjectStatus.COMPLETED,
          createdAt: Between(start, end),
        },
      });

      const monthName = start.toLocaleString('default', { month: 'short' });
      chartData.push({ month: monthName, completion: completedCount });
    }

    return chartData;
  }

  async getLast4WeeksTaskStats(tenantId: string) {
    const now = new Date();
    const chartData: {
      Week: string;
      taskCompleted: number;
      taskPending: number;
    }[] = [];

    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i * 7 - 6); // start of week
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setDate(end.getDate() - i * 7); // end of week
      end.setHours(23, 59, 59, 999);

      const taskCompleted = await this.taskRepo.count({
        where: {
          tenantId,
          status: TaskStatus.COMPLETED,
          createdAt: Between(start, end),
        },
      });

      const taskPending = await this.taskRepo.count({
        where: {
          tenantId,
          status: In([
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.REVIEW,
            TaskStatus.DELAYED,
          ]),
          createdAt: Between(start, end),
        },
      });

      chartData.push({
        Week: `Week ${4 - i}`,
        taskCompleted,
        taskPending,
      });
    }

    return chartData;
  }

async billingPageData(userId:string){
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tenantId = user.tenantId;

    const tenant=await this.tenantService.findOne(tenantId);
    if(!tenant){
      throw new NotFoundException('Tenant not found');}

      const projectUsed=await this.projectRepo.count({where:{tenantId}})
      const teamUsed=(await this.userServices.findAll(userId)).length;
    return { plan:tenant.subscriptionPlan,projectlimit:tenant.planProjectLimit,teamLimit:tenant.planTeamLimit,projectUsed,teamUsed }
}



}
