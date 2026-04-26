import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ExecutorFactory } from './services/executorFactory';
import submitRoutes from './routes/submit.routes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json()); 

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Platform is running smoothly' });
});

// for testing the executor factory independently
app.use('/api/test-executor', submitRoutes);

<<<<<<< Updated upstream
app.post('/api/submissions', async (req: Request, res: Response) => {
    try {
        const { language, code } = req.body;
=======
import { JudgeService } from './services/judge.service';
import { ProblemService } from './services/problem.service';
import { SubmissionService } from './services/submission.service';
import { AuthService } from './services/auth.service';
import { DashboardService } from './services/dashboard.service';
>>>>>>> Stashed changes

        if (!language || !code) {
             res.status(400).json({ error: 'Language and code are required' });
             return;
        }

        const executor = ExecutorFactory.getExecutor(language);
        
        const result = await executor.execute(code, ''); // For simplicity, using empty input. In a real scenario, this would come from the test cases.

        res.status(200).json({
            status: 'Success',
            verdict: result
        });

<<<<<<< Updated upstream
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Judge Backend running on http://localhost:${PORT}`);
=======
import { ProblemController } from './controllers/problem.controller';
import { SubmissionController } from './controllers/submit.controller';
import { DashboardController } from './controllers/dashboard.controller';


import { createProblemRoutes } from './routes/problem.routes';
import { createSubmissionRoutes } from './routes/submit.routes';
import { createAuthRoutes } from './routes/auth.routes';
import { createDashboardRoutes } from './routes/dashboard.routes';

async function bootstrap(): Promise<void> {
  const config = loadConfig();
  const app = express();


  app.use(cors());
  app.use(express.json({ limit: '5mb' }));


  if (config.useDb && config.mongodbUri) {
    await connectDatabase(config.mongodbUri);
  }


  const problemRepo =
    config.useDb && config.mongodbUri
      ? new MongoProblemRepository()
      : new MockProblemRepository();

  const submissionRepo =
    config.useDb && config.mongodbUri
      ? new MongoSubmissionRepository()
      : new MockSubmissionRepository();

  const externalApi = new LeetCodeApiClient();
  const judgeService = new JudgeService();
  const problemService = new ProblemService(problemRepo, externalApi);
  const submissionService = new SubmissionService(
    judgeService,
    submissionRepo,
    problemRepo
  );
  const authService = new AuthService(config.jwtSecret, config.googleClientId);
  const dashboardService = new DashboardService(submissionRepo, problemRepo);

  const problemController = new ProblemController(problemService);
  const submissionController = new SubmissionController(submissionService);
  const dashboardController = new DashboardController(dashboardService);


  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      dbConnected: config.useDb,
    });
  });

  app.use('/api/problems', createProblemRoutes(problemController));
  app.use(
    '/api/submissions',
    createSubmissionRoutes(submissionController, authenticateToken(config.jwtSecret, false))
  );
  app.use(
    '/api/dashboard',
    createDashboardRoutes(dashboardController, authenticateToken(config.jwtSecret, false))
  );
  app.use('/api/auth', createAuthRoutes(authService));










  app.use(globalErrorHandler);


  app.listen(config.port, () => {
    console.log(
      `Nexorithm Backend running on http://localhost:${config.port}`
    );
    console.log(`   Mode: ${config.nodeEnv}`);
    console.log(`   Database: ${config.useDb ? 'MongoDB' : 'In-Memory'}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
>>>>>>> Stashed changes
});