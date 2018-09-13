import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IndexDbServiceService } from './index-db.service.service';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ComplexOperationComponent } from './components/complex-opration.component';
import { TodoListComponent } from './components/todo-list.component';
import { HttpModule } from '@angular/http';
const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'complex', component: ComplexOperationComponent },
  { path: 'normal', component: TodoListComponent }
];
@NgModule({
  declarations: [
    AppComponent, ComplexOperationComponent, TodoListComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpModule
  ],
  providers: [IndexDbServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
