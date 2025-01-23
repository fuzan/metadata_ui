import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppFormComponent } from './tpp-form.component';

describe('TppFormComponent', () => {
  let component: TppFormComponent;
  let fixture: ComponentFixture<TppFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TppFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TppFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
