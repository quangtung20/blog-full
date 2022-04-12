import { User } from '../../database/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from '../../database/entities/task.entity';
import { TasksService } from './tasks.service';
import RoleGuard from 'src/guards/role.guard';
import Role from 'src/config/role.enum';

@Controller('tasks')
export class TasksController {
  private logger = new Logger('Task controller');
  constructor(
    private tasksService: TasksService,
  ) { }

  @Get('/a')
  @UseGuards((RoleGuard(Role.admin)))
  testRole() {
    return 'test role';
  }

  @Get('/b')
  @UseGuards((RoleGuard(Role.user)))
  testRoleb() {
    return 'test role';
  }

  @Get()
  @UseGuards(RoleGuard(Role.user))
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user._id}" is handle get tasks. Filter:${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
  //   return this.tasksService.getTaskById(id, user);
  // }

  @Post()
  @UseGuards(RoleGuard(Role.user))
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User ${user._id} is creating task:${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<string> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
