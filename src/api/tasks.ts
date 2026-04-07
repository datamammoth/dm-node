import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse, Task, ListOptions } from '../types/common.js';
import type { TaskStatus, TaskType } from '../types/enums.js';

export interface ListTasksOptions extends ListOptions {
  status?: TaskStatus;
  type?: TaskType;
}

export class TasksAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  /** List async tasks for the current tenant. */
  async list(options?: ListTasksOptions): Promise<PaginatedResponse<Task>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.type) query['filter[type]'] = options.type;
    return this.#client.getPaginated<Task>('/tasks', query);
  }

  /** Async iterator that auto-paginates through all tasks. */
  async *listAll(
    options?: ListTasksOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Task, void, undefined> {
    const query: QueryParams = {};
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.type) query['filter[type]'] = options.type;
    yield* paginate<Task>(this.#client, '/tasks', query, paginateOptions);
  }

  /** Get a single task by ID. */
  async get(id: string): Promise<Task> {
    return this.#client.getData<Task>(`/tasks/${enc(id)}`);
  }

  /**
   * Poll a task until it reaches a terminal state (completed, failed, cancelled).
   *
   * @param id - Task ID to poll
   * @param intervalMs - Polling interval in milliseconds (default: 2000)
   * @param timeoutMs - Maximum time to wait in milliseconds (default: 300000 = 5 min)
   * @returns The completed task
   * @throws Error if timeout is reached
   */
  async wait(id: string, intervalMs = 2000, timeoutMs = 300_000): Promise<Task> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const task = await this.get(id);

      if (task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') {
        return task;
      }

      await sleep(intervalMs);
    }

    throw new Error(`Task ${id} did not complete within ${timeoutMs}ms`);
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
