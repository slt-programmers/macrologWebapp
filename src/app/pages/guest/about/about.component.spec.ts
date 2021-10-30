import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockComponent } from "ng-mocks";
import { NavigationComponent } from "src/app/shared/components/navigation/navigation.component";
import { AboutComponent } from "./about.component"

describe('AboutComponent', () => {
  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent,
        MockComponent(NavigationComponent)]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })
})