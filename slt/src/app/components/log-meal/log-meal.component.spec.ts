import { LogMealComponent } from "./log-meal.component";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from "@angular/core";
import { DiaryService } from "@app/services/diary.service";
import { ToastService } from "@app/services/toast.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";

describe('LogMealComponent', () => {
    let component: LogMealComponent;
    let fixture: ComponentFixture<LogMealComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LogMealComponent],
            providers: [DiaryService, ToastService],
            imports: [HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogMealComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create log-meal component', () => {
        expect(component).toBeTruthy();
    });

    it('should init log-meal component', () => {
        component.ngOnInit();
        expect(component.addLogEntryCallBack).not.toEqual(undefined);
    });

    it('should handle changes to the date input', () => {
        spyOn(component, 'saveAndClose');
        let changes = { ['date']: undefined };
        component.ngOnChanges(changes);
        expect(component.saveAndClose).not.toHaveBeenCalled();
        changes = { ['date']: new SimpleChange(undefined, '2019-01-01', true) }
        component.editable = true;
        component.ngOnChanges(changes);
        expect(component.saveAndClose).toHaveBeenCalled();
    });

    it('should handle changes to the editable property input', () => {
        spyOn(component, 'saveAndClose');
        let changes = { ['open']: new SimpleChange(undefined, false, true) }
        component.ngOnChanges(changes);
        expect(component.saveAndClose).not.toHaveBeenCalled();
        changes = { ['open']: new SimpleChange(undefined, false, false) }
        component.ngOnChanges(changes);
        expect(component.saveAndClose).toHaveBeenCalled();
        changes = { ['open']: new SimpleChange(true, true, false) }
        component.ngOnChanges(changes);
        expect(component.editable).toBeTruthy();
    })

    it('should close the editable log-meal', () => {
        component.meal = 'lunch';
        component.editable = true;
        fixture.detectChanges();
        const closeButton = fixture.debugElement.query(By.css('#closeBtn'));
        closeButton.nativeElement.click();
        fixture.detectChanges();
        expect(component.editable).toBeFalsy();
    })
});