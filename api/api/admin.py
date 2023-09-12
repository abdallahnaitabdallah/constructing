from django.contrib import admin
from .models import Company, Project, CaseStudies, ConstructionRequest, ChatMessageAttachment ,ChatMessage, Document, UserAccount,ProjectImage,ProjectVideo

@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'adress')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'history', 'mission', 'vision')

@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'image')

@admin.register(ProjectVideo)
class ProjectVideoAdmin(admin.ModelAdmin):
    list_display = ('project', 'video_url')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

@admin.register(CaseStudies)
class CaseStudiesAdmin(admin.ModelAdmin):
    list_display = ('project', 'title')
    search_fields = ('project__title', 'title')
    list_filter = ('project',)

@admin.register(ConstructionRequest)
class ConstructionRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'requirements')


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'content', 'timestamp', 'parent_message', 'display_attachments')

    def display_attachments(self, obj):
        # Get a comma-separated list of attachment filenames
        return ", ".join([attachment.attachment.name for attachment in obj.attachments.all()])

    display_attachments.short_description = 'Attachments'
    
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('construction_request', 'file')
