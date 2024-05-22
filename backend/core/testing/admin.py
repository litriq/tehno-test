from django.contrib import admin
from .models import Test, Question, Answer


class AnswerInline(admin.TabularInline):
    model = Answer


class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]


class TestAdmin(admin.ModelAdmin):
    filter_horizontal = ('questions',)


admin.site.register(Question, QuestionAdmin)
admin.site.register(Test, TestAdmin)
