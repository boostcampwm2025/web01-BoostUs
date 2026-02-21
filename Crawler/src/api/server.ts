import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ReportService } from '../monitoring/report-service';

/**
 * API Server
 * Grafana JSON Datasource를 위한 REST API 서버
 */
export class ApiServer {
  private app: Express;
  private reportService: ReportService;
  private port: number;

  constructor(port = 5000) {
    this.app = express();
    this.reportService = new ReportService();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * 미들웨어 설정
   */
  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());

    // 요청 로깅
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      console.log(`[API] ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * 라우트 설정
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        service: 'BoostUs Crawler API',
        status: 'running',
        endpoints: [
          'GET /api/reports?limit=200',
          'GET /api/reports/:filename',
          'GET /api/metrics/summary?limit=200',
        ],
      });
    });

    // Grafana JSON Datasource - Test connection
    this.app.get('/test', (_req: Request, res: Response) => {
      res.status(200).send();
    });

    // 리포트 목록 조회
    this.app.get('/api/reports', async (req: Request, res: Response) => {
      try {
        const limitParam = req.query.limit;
        const limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : 200;
        const reports = await this.reportService.getRecentReports(limit);

        res.json({
          total: reports.length,
          limit,
          reports,
        });
      } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
      }
    });

    // 특정 리포트 조회
    this.app.get('/api/reports/:filename', async (req: Request, res: Response) => {
      try {
        const filename = req.params.filename as string;
        const report = await this.reportService.getReport(filename);

        if (!report) {
          return res.status(404).json({ error: 'Report not found' });
        }

        res.json(report);
      } catch (error) {
        console.error(`Error fetching report ${req.params.filename}:`, error);
        res.status(500).json({ error: 'Failed to fetch report' });
      }
    });

    // 집계 통계 조회
    this.app.get('/api/metrics/summary', async (req: Request, res: Response) => {
      try {
        const limitParam = req.query.limit;
        const limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : 200;
        const summary = await this.reportService.getSummaryMetrics(limit);

        res.json(summary);
      } catch (error) {
        console.error('Error fetching summary metrics:', error);
        res.status(500).json({ error: 'Failed to fetch summary metrics' });
      }
    });

    // Grafana JSON Datasource - Query endpoint
    this.app.post('/query', async (req: Request, res: Response) => {
      try {
        const limit = 200;
        const reports = await this.reportService.getRecentReports(limit);

        // Grafana Time Series 포맷으로 변환
        const targets = req.body.targets || [];
        const result = targets.map((target: { target: string }) => {
          const datapoints: [number, number][] = reports.map((report) => {
            const timestamp = new Date(report.timestamp).getTime();
            let value = 0;

            switch (target.target) {
              case 'feed_success_rate':
                value = (1 - report.feed_error_rate) * 100;
                break;
              case 'stories_inserted':
                value = report.db_write_breakdown.insert;
                break;
              case 'stories_updated':
                value = report.db_write_breakdown.update;
                break;
              case 'stories_skipped':
                value = report.db_write_breakdown.skip;
                break;
              case 'p95_download_s':
                value = report.p95_download_s;
                break;
              case 'p95_parse_s':
                value = report.p95_parse_s;
                break;
              case 'p95_create_s':
                value = report.p95_create_s;
                break;
              case 'p95_total_execution_s':
                value = report.total_execution_time_s;
                break;
              default:
                value = 0;
            }

            return [value, timestamp];
          });

          return {
            target: target.target,
            datapoints,
          };
        });

        res.json(result);
      } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: 'Failed to process query' });
      }
    });

    // Grafana JSON Datasource - Search endpoint (metric names)
    this.app.post('/search', (_req: Request, res: Response) => {
      const metrics = [
        'feed_success_rate',
        'stories_inserted',
        'stories_updated',
        'stories_skipped',
        'p95_download_s',
        'p95_parse_s',
        'p95_create_s',
        'p95_total_execution_s',
      ];
      res.json(metrics);
    });
  }

  /**
   * 서버 시작
   */
  start(): void {
    this.app.listen(this.port, () => {
      console.log(`\n🌐 API Server started on http://localhost:${this.port}`);
      console.log(`   Health check: http://localhost:${this.port}/`);
      console.log(`   Reports API: http://localhost:${this.port}/api/reports`);
    });
  }

  /**
   * Express app 반환 (테스트용)
   */
  getApp(): Express {
    return this.app;
  }
}
