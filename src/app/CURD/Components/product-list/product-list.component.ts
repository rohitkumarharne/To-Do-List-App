import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service'; // Adjust the path as necessary
import { Task } from '../../models/product-interface'; // Ensure this points to your task model
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  tasks: Task[] = []; // This array will hold the list of tasks
  filteredTasks: Task[] = []; // This array will hold the filtered tasks
  paginatedTasks: Task[] = []; // This array will hold the tasks for the current page
  searchTerm: string = ''; // This will hold the search term
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Number of tasks to display per page
  totalPages: number = 0; // Total number of pages

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks(); // Load tasks when the component initializes
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data; // Assign the fetched tasks to the local array
      this.filteredTasks = data; // Initialize filtered tasks
      this.calculateTotalPages(); // Calculate total pages
      this.updatePaginatedTasks(); // Update tasks for the current page
    }, error => {
      console.error('Error loading tasks:', error);
      alert('An error occurred while loading tasks. Please try again.');
    });
  }

  filterTasks(): void {
    // Filter tasks based on the search term
    this.filteredTasks = this.tasks.filter(task => 
      task.assignedTo.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      task.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.comments.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.calculateTotalPages(); // Recalculate total pages based on filtered results
    this.updatePaginatedTasks(); // Update paginated tasks
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredTasks.length / this.pageSize);
  }

  updatePaginatedTasks(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTasks(); // Update tasks for the new page
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTasks(); // Update tasks for the new page
    }
  }

  refreshTasks(): void {
    this.loadTasks(); // Call loadTasks to refresh the task list
  }

  editTask(id: number): void 
  {
    // Navigate to the edit page with the selected task's ID
    this.router.navigate(['/edit', id]);
  }

  deleteTask(id: number): void {
    // Confirm before deletion
    if (confirm("Are you sure you want to delete this task?")) 
      {
      this.taskService.deleteTask(id).subscribe(
        () => {
          // Remove the deleted task from the local tasks array
          this.tasks = this.tasks.filter(task => task.id !== id);
          this.filterTasks(); // Reapply the filter after deletion
        },
        error => {
          // Handle any errors that occur during deletion
          console.error('Error deleting task:', error);
          alert('An error occurred while deleting the task. Please try again.');
        }
      );
    }
  }
  
}
