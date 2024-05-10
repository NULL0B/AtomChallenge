import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { TasksComponent } from "./tasks.component";

describe("TasksComponent", () => {
    let component: TasksComponent;
    let fixture: ComponentFixture<TasksComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should compile", () => {
        expect(component).toBeTruthy();
    });
});