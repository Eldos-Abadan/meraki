from django.contrib import admin
from django.urls import path, include
from back import views  # Import from your app

urlpatterns = [

    path('', views.home, name='home'),

    path('api/auth/', include('back.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/tasks/', include('apps.tasks.urls')),

    path('admin/', admin.site.urls),

    # User URLs
    path('users/', views.UserListCreateView.as_view(), name='user-list'),
    path('users/<uuid:pk>/', views.UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    
    # Department URLs
    path('departments/', views.DepartmentListCreateView.as_view(), name='department-list'),
    path('departments/<uuid:pk>/', views.DepartmentRetrieveUpdateDestroyView.as_view(), name='department-detail'),
    
    # Designation URLs
    path('designations/', views.DesignationListCreateView.as_view(), name='designation-list'),
    path('designations/<uuid:pk>/', views.DesignationRetrieveUpdateDestroyView.as_view(), name='designation-detail'),
    
    # Project URLs
    path('projects/', views.ProjectListCreateView.as_view(), name='project-list'),
    path('projects/<uuid:pk>/', views.ProjectRetrieveUpdateDestroyView.as_view(), name='project-detail'),
    
    # Task URLs
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<uuid:pk>/', views.TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),
    
    # Announcement URLs
    path('announcements/', views.AnnouncementListCreateView.as_view(), name='announcement-list'),
    path('announcements/<uuid:pk>/', views.AnnouncementRetrieveUpdateDestroyView.as_view(), name='announcement-detail'),
    
    # Attendance URLs
    path('attendances/', views.AttendanceListCreateView.as_view(), name='attendance-list'),
    path('attendances/<uuid:pk>/', views.AttendanceRetrieveUpdateDestroyView.as_view(), name='attendance-detail'),
    
    # Expense URLs
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<uuid:pk>/', views.ExpenseRetrieveUpdateDestroyView.as_view(), name='expense-detail'),
    
    # Leave URLs
    path('leaves/', views.LeaveListCreateView.as_view(), name='leave-list'),
    path('leaves/<uuid:pk>/', views.LeaveRetrieveUpdateDestroyView.as_view(), name='leave-detail'),
    
    # Notification URLs
    path('notifications/', views.NotificationListCreateView.as_view(), name='notification-list'),
    path('notifications/<uuid:pk>/', views.NotificationRetrieveUpdateDestroyView.as_view(), name='notification-detail'),
    
    # Setting URLs
    path('settings/', views.SettingListCreateView.as_view(), name='setting-list'),
    path('settings/<uuid:pk>/', views.SettingRetrieveUpdateDestroyView.as_view(), name='setting-detail'),
]