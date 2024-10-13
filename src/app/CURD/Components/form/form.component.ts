import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/product-interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number | null = null;
  loading: boolean = false; // Loading state for async operations

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    if (this.taskId) {
      this.loading = true; // Start loading
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.loading = false; // Stop loading
        if (task) {
          this.taskForm.patchValue(task);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = {
        id: this.taskId !== null ? this.taskId : Date.now(),
        ...this.taskForm.value,
      };

      if (this.taskId) {
        this.taskService.updateTask(task).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.taskService.addTask(task).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
