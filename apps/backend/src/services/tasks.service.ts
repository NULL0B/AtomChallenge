import "reflect-metadata";

import { firestore } from "firebase-admin";
import { inject, injectable } from "inversify";
import Firestore = firestore.Firestore;
import {TYPES} from "../types/ioc";
import {Task} from "../models/task";

export interface ITasksService {
    getAllTasks: () => Promise<Task[]>;
    addTask: (task: Task) => Promise<Task>;
    updateTask: (taskId: string, updatedTask: Task) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<void>;
}

@injectable()
export class TasksService implements ITasksService {
    constructor(@inject(TYPES.Firestore) private firestoreInstance: Firestore) {
    }

    async getAllTasks() {
        // const snapshot = await this.firestoreInstance.collection("tasks")
        //     .get();
        // return snapshot.docs.map((doc) => doc.data());
        return [<Task>{id: "1", title: "Task 1", description: "Description 123"},];
    }

    async addTask(task: Task) {
        const docRef = await this.firestoreInstance.collection("tasks")
            .add(task);
        return (await docRef.get()).data() as Task;
    }

    async updateTask(taskId: string, updatedTask: Task) {
        const docRef = this.firestoreInstance.collection("tasks")
            .doc(taskId);
        await docRef.update(updatedTask);
        return (await docRef.get()).data() as Task;
    }

    async deleteTask(taskId: string) {
        const docRef = this.firestoreInstance.collection("tasks")
            .doc(taskId);
        await docRef.delete();
    }
}
