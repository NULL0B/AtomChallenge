import { Firestore } from "firebase-admin/firestore";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/ioc.types";
import { injectHttpContext, interfaces } from "inversify-express-utils";
import { InputTaskDto } from "../dto/updateable-task.dto";
import { Task } from "../models/task.model";
import { FirebasePrincipal } from "../types/firebase-principal";
import { Logger } from "../types/logger";
import { AppStatusInformer } from "../utils/app-status-informer";
import { NotFoundError } from "../types/exceptions/not-found.error";
import { nameof } from "../utils/typing";
export interface ITasksService {
    getAllTasks: () => Promise<Task[]>;
    addTask: (task: Task) => Promise<Task>;
    updateTask: (taskId: string, updatedTask: Task) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<void>;
}

@injectable()
export class TasksService implements ITasksService {

    private readonly _tenantTasksCollection!: FirebaseFirestore.CollectionReference;

    constructor(
        @inject(TYPES.Firestore) private readonly _firestoreInstance: Firestore,
        @injectHttpContext private readonly _httpContext: interfaces.HttpContext,
        @inject(TYPES.Logger) private readonly _logger: Logger,
        @inject(TYPES.AppStatus) readonly _appStatus: AppStatusInformer
    ) {
        if (!_appStatus.isInitialized()) {
            this._logger
                .warn("Task Service Attepmted to be created before the app is initialized by inversify-express.");
            return;
        }
        const user = this._httpContext.user as FirebasePrincipal;
        if (!user?.details?.email) {
            throw new Error("User not found in the request");
        }
        this._tenantTasksCollection = this._firestoreInstance
            .collection(`tasks_${user?.details?.email}`).withConverter({
                toFirestore: (task: Task) => {
                    const createdAt = task.createdAt.toISOString();
                    return {
                        ...task,
                        createdAt
                    };
                },
                fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
                    const data = snapshot.data();
                    const createdAt = new Date(data.createdAt);
                    return {
                        ...data,
                        createdAt
                    } as Task;
                }
            });
    }

    async getAllTasks(orderField = nameof<Task>("createdAt"),
        orderDir: "asc" | "desc" = "desc",
        lastId?: string,
        itemsPerPage = 16): Promise<Task[]> {
        let query = this._tenantTasksCollection
            .orderBy(orderField, orderDir).limit(itemsPerPage);
        if (lastId) {
            query = query.startAfter( await this._tenantTasksCollection.doc(lastId).get());
        }
        const querySnapshot = await query.get();
        const data = querySnapshot.docs.map(doc => doc.data() as Task);
        return data;
    }

    async addTask(task: InputTaskDto): Promise<Task> {
        const docRef = this._tenantTasksCollection.doc();
        // Will use a converter and save as utc value instead of using FieldValue.serverTimestamp(),
        const MILLIS_IN_MINUTE = 60_000;
        const now = new Date();
        const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * MILLIS_IN_MINUTE);
        await docRef.set({
            ...task,
            createdAt: utcNow,
            id: docRef.id
        } as Task);
        const data = (await docRef.get()).data() as Task;
        return data;
    }

    async updateTask(taskId: string, updatedTask: InputTaskDto): Promise<Task> {
        const docRef = this._tenantTasksCollection.doc(taskId);
        const data = (await docRef.get()).data() as Task;
        if (!data) {
            throw new NotFoundError(`Task with id ${taskId} not found`);
        }
        const newDataTask = {
            ...data,
            ...updatedTask
        } as Task;
        // do not use the update method as it will not work with the custom converter
        await docRef.set(newDataTask, { merge: true });
        return newDataTask;
    }

    async deleteTask(taskId: string): Promise<void> {
        const docRef = this._tenantTasksCollection.doc(taskId);
        if (!(await docRef.get()).exists) {
            throw new NotFoundError(`Task with id ${taskId} not found`);
        }
        await docRef.delete();
    }
}
