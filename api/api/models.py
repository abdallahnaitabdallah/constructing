from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email')

        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.IntegerField()
    adress = models.CharField(max_length=254)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name','phone','adress']

    def get_full_name(self):
        return self.first_name + self.last_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email

class Company(models.Model):
    name = models.CharField(max_length=255)
    history = models.TextField(null=True, blank=True)
    mission = models.TextField(null=True, blank=True)
    vision = models.TextField(null=True, blank=True)
    services = models.JSONField(null=True, blank=True)

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='media/project_images/')

    def __str__(self):
        return self.image.name  

class ProjectVideo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='videos')
    video_url = models.URLField()

    def __str__(self):
        return self.video_url

class CaseStudies(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='case_studies')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

class ConstructionRequest(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    requirements = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Construction Request by {self.first_name}"
    
class Document(models.Model):
    construction_request = models.ForeignKey(ConstructionRequest, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='media/documents/')

    def __str__(self):
        return self.file.name


class ChatMessageAttachment(models.Model):
    attachment = models.FileField(upload_to='media/attachments/')

class ChatMessage(models.Model):
    sender = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    content = models.TextField()
    parent_message = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    attachments = models.ManyToManyField(ChatMessageAttachment, related_name='chat_messages', blank=True)