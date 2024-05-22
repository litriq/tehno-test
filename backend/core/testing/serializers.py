from rest_framework import serializers
from testing.models import Test, Question, Answer, CompletedTest
from django.contrib.auth.models import User


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers', 'image']

class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'name', 'questions']

class TestListSerializer(serializers.ModelSerializer):
    
    completed = serializers.BooleanField()
    
    class Meta:
        model = Test
        fields = ('id', 'name', 'completed')

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    roles = serializers.StringRelatedField(source='groups', many=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'roles']


class CompletedTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedTest
        fields = ['id', 'user', 'test', 'score', 'completed_at']