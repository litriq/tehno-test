# Generated by Django 5.0.3 on 2024-03-26 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testing', '0002_completedtest'),
    ]

    operations = [
        migrations.AddField(
            model_name='completedtest',
            name='score',
            field=models.IntegerField(default=0),
        ),
    ]
