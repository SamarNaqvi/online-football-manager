import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TeamService } from '../app/modules/team/team.service';
import { FirebaseService } from '../app/modules/firebase/firebase.service';
import { UserService } from '../app/modules/user/user.service';

@Processor('build-team-queue')
export class WorkerService extends WorkerHost {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private firebaseService: FirebaseService,
  ) {
    super();
  }
  logger = new Logger('WorkerService');

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} in PID ${process.pid}.`,
    );

    await this.teamService.createTeam(job.data.userId);

    return { value: job.data.userId };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.log(
      `Job ${job.id} of type ${job.name} failed with error ${error.message}`,
    );
  }

  @OnWorkerEvent('error')
  onError(error: Error) {
    console.log(`An error occurred: ${error.message}`);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}...`);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    console.log(`Job ${job.id} of type ${job.name} completed.`);
    const userId = job.returnvalue.value;
    const userEmail = await this.userService.getUserEmail(userId);
    const userToken = await this.userService.getUserToken(userId);
    const token = userToken?.token;
    const payload = {
      notification: {
        title: 'New Notification',
        body: `Hello ${userEmail?.email}, Your Team is ready, Please try visting Team Page View`,
      },
      data: {
        type: 'team-creation',
      },
    };
    if (token) this.firebaseService.sendNotification(token, payload);
  }
}
