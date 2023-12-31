# Generated by Django 4.2.4 on 2023-09-03 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatmessageattachment',
            name='chat_message',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='attachments',
            field=models.ManyToManyField(blank=True, related_name='chat_messages', to='api.chatmessageattachment'),
        ),
        migrations.AlterField(
            model_name='chatmessageattachment',
            name='attachment',
            field=models.FileField(upload_to='media/attachments/'),
        ),
        migrations.AlterField(
            model_name='document',
            name='file',
            field=models.FileField(upload_to='media/documents/'),
        ),
        migrations.AlterField(
            model_name='projectimage',
            name='image',
            field=models.ImageField(upload_to='media/project_images/'),
        ),
    ]
