import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LobbyPage } from './lobby.page';

describe('LobbyPage', () => {
  let component: LobbyPage;
  let fixture: ComponentFixture<LobbyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LobbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
