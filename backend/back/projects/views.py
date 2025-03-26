from rest_framework import generics
from .models import Project
from .serializers import ProjectSerializer

class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.filter(deleted_at__isnull=True)
    serializer_class = ProjectSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)