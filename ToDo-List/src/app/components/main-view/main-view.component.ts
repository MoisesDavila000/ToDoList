import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/interfaces/task';
import { AuthService } from 'src/app/services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit{

  listForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1) , Validators.maxLength(30)]],
    date: ['', [Validators.required]]
  });

  editId: string | undefined;
  editing: boolean = false;
  task: Task | undefined;
  userName: string | undefined;
  valid: boolean = false;

  taskList: Task[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private taskService: TaskService
    ){}

  ngOnInit() {
    if(localStorage.length !== 2){
      this.logOut();
    }

    this.authService.validateToken().subscribe((res: HttpResponse<any>)=>{
      this.valid = true;
      this.userName = this.authService.getUser()!;
      //Get Tasks
      this.taskService.getTasks().subscribe((tasks: Task[]|any)=>{
        this.taskList = tasks;
      });
    });
  }

  addToList(content: any){
    this.listForm.controls['name'].setValue('');
    this.listForm.controls['date'].setValue('');
    this.editing = false;
    this.modalService.open(content, { centered: true });
  }

  complete(taskId: string, completed: boolean){
    this.taskService.editTask(taskId, {completed: !completed }).subscribe((editTask: Task | any) => {
      window.location.reload();
    });
  }

  edit(idTask: string, nameTask: string, dateTask: string, content: TemplateRef<any>){
    this.editing = true;
    this.editId = idTask;
    this.listForm.controls['name'].setValue(nameTask);
    this.listForm.controls['date'].setValue(dateTask);
    this.modalService.open(content , { centered: true });
  }

  delete(idTask: string){
    this.taskService.deleteTask(idTask).subscribe((taskDeleted: Task | any) => {
      window.location.reload();
    });
  }

  submitForm(){
    debugger;
    if(this.editing){
      if(this.editId !== undefined && this.listForm.valid){
        this.taskService.editTask(this.editId, this.listForm.value).subscribe((newTask: Task | any) => {
          this.modalService.dismissAll();
          window.location.reload();
        });
      }
      else{
        console.log("Algo salio mal durante el edit")
      }
    }
    else{
      if(this.listForm.valid){
        debugger;
        this.taskService.addTask(this.listForm.value).subscribe((newTask: Task | any) =>{
          this.modalService.dismissAll();
          window.location.reload();
        });
      }
      else{
        console.log("Algo salio mal");
      }
    }
  }

  logOut(){
    this.authService.logout();
  }
}
