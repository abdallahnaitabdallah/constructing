from rest_framework import serializers
from .models import Company, Project, ProjectImage, ProjectVideo, ConstructionRequest, Document, ChatMessage,CaseStudies,UserAccount,ChatMessageAttachment
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name','phone','adress','password','is_superuser')

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'email', 'first_name', 'last_name','phone','adress','is_superuser')

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ('image',)

class ProjectVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectVideo
        fields = ('video_url',)

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, required=False)
    videos = ProjectVideoSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = ('title', 'description', 'images', 'videos')

class CaseStudiesSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = CaseStudies
        fields = ('id', 'project', 'title', 'description')

    def create(self, validated_data):
        project_data = validated_data.pop('project', {})
        images_data = project_data.pop('images', [])
        videos_data = project_data.pop('videos', [])

        # Create the Project instance
        project_instance = Project.objects.create(**project_data)

        # Create the CaseStudies instance with the Project instance as a foreign key
        case_studies_instance = CaseStudies.objects.create(project=project_instance, **validated_data)

        for image_data in images_data:
            ProjectImage.objects.create(project=project_instance, **image_data)

        for video_data in videos_data:
            ProjectVideo.objects.create(project=project_instance, **video_data)

        return case_studies_instance

    def update(self, instance, validated_data):
        project_data = validated_data.pop('project', {})
        images_data = project_data.pop('images', [])
        videos_data = project_data.pop('videos', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        project_instance = instance.project
        for key, value in project_data.items():
            setattr(project_instance, key, value)
        project_instance.save()

        # Clear existing project images and videos
        project_instance.images.all().delete()
        project_instance.videos.all().delete()

        # Create new project images and videos
        for image_data in images_data:
            ProjectImage.objects.create(project=project_instance, **image_data)

        for video_data in videos_data:
            ProjectVideo.objects.create(project=project_instance, **video_data)

        return instance
    
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('file',)

class ConstructionRequestSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, required=False)

    class Meta:
        model = ConstructionRequest
        fields = ('user', 'requirements', 'documents')

    def create(self, validated_data):
        documents_data = validated_data.pop('documents', [])
        construction_request = ConstructionRequest.objects.create(**validated_data)
        
        for document_data in documents_data:
            Document.objects.create(construction_request=construction_request, **document_data)
        
        return construction_request

    def update(self, instance, validated_data):
        documents_data = validated_data.pop('documents', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        for document_data in documents_data:
            Document.objects.create(construction_request=instance, **document_data)
        
        return instance

class ChatMessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessageAttachment
        fields = ('attachment',)

class ChatMessageSerializer(serializers.ModelSerializer):
    attachments = ChatMessageAttachmentSerializer(many=True, required=False)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ('id', 'sender', 'content', 'parent_message', 'timestamp', 'attachments', 'replies')

    def get_replies(self, obj):
        # Implement logic to get replies for the current message 'obj'
        # For example, you can query the database for replies related to this message.
        replies = ChatMessage.objects.filter(parent_message=obj)
        
        # Serialize the replies using the same serializer
        reply_serializer = ChatMessageSerializer(replies, many=True)
        
        return reply_serializer.data

    def create(self, validated_data):
        attachments_data = validated_data.pop('attachments', [])
        message = ChatMessage.objects.create(**validated_data)
        for attachment_data in attachments_data:
            ChatMessageAttachment.objects.create(chat_message=message, **attachment_data)
        return message
    
    def perform_create(self, serializer):
        parent_id = self.request.data.get('parent_message')
        parent_message = ChatMessage.objects.get(id=parent_id) if parent_id else None
        serializer.save(sender=self.request.user, parent_message=parent_message)

class UnrepliedMessagesSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    adress = serializers.CharField()
    is_superuser = serializers.BooleanField()
    num_unreplied_messages = serializers.IntegerField()
