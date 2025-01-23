import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppListComponent } from './tpp-list.component';

describe('TppListComponent', () => {
  let component: TppListComponent;
  let fixture: ComponentFixture<TppListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TppListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
