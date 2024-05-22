<script setup lang="ts">
import { getTest, type FullTestDto } from "@/entities/tests";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import tCard from "@/shared/ui/layouts/t-card";
import tButton from "@/shared/ui/atoms/t-button/t-button.vue";
import { router } from "..";
import { completeTest } from "@/features/complete-test";
import { Answers } from "@/entities/tests/api";
import { getImage } from "@/shared/image";

const route = useRoute();

const testId = ref(+route.params.testId);
const isLoading = ref(false);
const test = ref<FullTestDto | null>(null);
const showAnswer = ref(false);
const score = ref(0);
const isFinished = ref(false);
const selectedAnswers = ref<number[]>([]);
const step = ref(0);

const currentQuestion = computed(() =>
  test.value ? test.value.questions[step.value] : null
);

const progress = computed(() =>
  test.value
    ? Math.floor(((step.value + 1) / test.value.questions.length) * 100) + "%"
    : "0"
);

const isSingle = computed(() => {
  if (!currentQuestion.value) return false;

  return (
    currentQuestion.value.answers.filter((answer: Answers) => answer.is_correct)
      .length === 1
  );
});

const questionVariant = computed(() => {
  if (isSingle.value) {
    return "Выберете 1 вариант ответа";
  } else {
    return "Выберете несколько варианта ответа";
  }
});

const areOthersAnswersDisabled = computed(() => {
  if (isSingle.value) {
    return selectedAnswers.value.length > 0;
  } else {
    return false;
  }
});

const uploadTest = async () => {
  isLoading.value = true;

  try {
    const { data } = await getTest(testId.value);

    test.value = data;
  } catch {
  } finally {
    isLoading.value = false;
  }
};

const toggleAnswer = (id: number) => {
  if (selectedAnswers.value.includes(id) || !areOthersAnswersDisabled.value) {
    const index = selectedAnswers.value.findIndex(answer => answer === id);

    if (index == -1) {
      selectedAnswers.value.push(id);
    } else {
      selectedAnswers.value.splice(index, 1);
    }
  }
};

const correctAnswers = computed(() => {
  if (!currentQuestion.value) return [];

  return currentQuestion.value.answers
    .filter(answer => answer.is_correct)
    .map(answer => answer.id);
});

const isCorrect = computed(() => {
  if (!currentQuestion.value) return false;

  return currentQuestion.value.answers
    .filter(answer => answer.is_correct)
    .map(answer => answer.id)
    .every(idx => selectedAnswers.value.includes(idx));
});

const clearQuestionInfo = () => {
  selectedAnswers.value = [];
  showAnswer.value = false;
};

const onAnswer = () => {
  showAnswer.value = true;

  setTimeout(async () => {
    if (isCorrect.value) {
      score.value += 1;
    }

    if (!test.value) return;

    if (step.value < test.value.questions.length - 1) {
      step.value += 1;
    } else {
      isFinished.value = true;

      await completeTest({
        testId: testId.value,
        score: Math.floor((score.value / test.value.questions.length) * 100)
      });
    }

    clearQuestionInfo();
  }, 1000);
};

const onSubmit = () => {
  router.push({
    name: "home"
  });
};

onMounted(() => {
  uploadTest();
});
</script>

<template>
  <main v-if="test" class="mt-16">
    <h1>{{ test.name }}</h1>

    <t-card class="question">
      <div v-if="!isFinished">
        <div class="bar mb-4">
          <div class="progress" :style="{ width: progress }"></div>
        </div>

        <div v-if="currentQuestion">
          <div v-if="currentQuestion.image" class="img-container mb-4">
            <div class="img-content">
              <img :src="getImage(currentQuestion.image)" alt="" />
            </div>
          </div>

          <h3>{{ currentQuestion.text }}</h3>

          <p class="variant">{{ questionVariant }}</p>

          <div class="answers mb-4">
            <div
              v-for="answer in currentQuestion.answers"
              :key="answer.id"
              class="answer"
              :class="{
                selected: selectedAnswers.includes(answer.id),
                correct: correctAnswers.includes(answer.id) && showAnswer,
                wrong:
                  !correctAnswers.includes(answer.id) &&
                  showAnswer &&
                  selectedAnswers.includes(answer.id),
                disabled:
                  areOthersAnswersDisabled! &&
                  selectedAnswers.includes(answer.id)
              }"
              @click="toggleAnswer(answer.id)"
            >
              {{ answer.text }}
            </div>
          </div>

          <t-button :disabled="!selectedAnswers.length" @click="onAnswer"
            >Принять</t-button
          >
        </div>
      </div>
      <div v-else class="results">
        <h3>Тест успешно пройден!</h3>

        <p class="answer">Ваш результат:</p>

        <div class="mb-6">
          <span style="font-size: 5.5rem; color: var(--t-primary)">
            {{ Math.floor((score / test.questions.length) * 100) }}%
          </span>
        </div>

        <t-button @click="onSubmit">На главную</t-button>
      </div>
    </t-card>
  </main>
</template>

<style lang="scss" scoped>
.bar {
  height: 4px;
  border-radius: 4px;
  background-color: var(--t-background);
  overflow: hidden;

  .progress {
    transition: all 1s ease-in-out;
    height: 8px;
    background-color: var(--t-primary);
  }
}

.question {
  .img-container {
    padding-bottom: 56.25%;
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
  }

  .img-content {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: var(--t-background);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 100%;
      object-fit: contain !important;
    }
  }
  .variant {
    font-size: 0.8rem;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .answer {
      padding: 1rem;
      border-radius: 10px;
      background-color: var(--t-background);
      cursor: pointer;
      border: 1px solid var(--t-background);
      transition: all 0.2s ease;
      &:hover {
        -webkit-box-shadow: 0px 6px 19px -8px rgba(34, 60, 80, 0.2);
        -moz-box-shadow: 0px 6px 19px -8px rgba(34, 60, 80, 0.2);
        box-shadow: 0px 6px 19px -8px rgba(34, 60, 80, 0.2);
        border: 1px solid var(--t-primary);
      }

      .result {
        font-size: 2.5rem;
      }
    }

    .selected {
      background-color: color-mix(in srgb, var(--t-primary) 50%, transparent);
    }

    .correct {
      background-color: color-mix(in srgb, var(--t-success) 50%, transparent);
      border: 1px solid var(--t-success);
      &:hover {
        border: 1px solid var(--t-success);
      }
    }

    .wrong {
      background-color: color-mix(in srgb, var(--t-danger) 50%, transparent);
      border: 1px solid var(--t-danger);
      &:hover {
        border: 1px solid var(--t-danger);
      }
    }
  }
}

.results {
  text-align: center;
}
</style>
