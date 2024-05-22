<script setup lang="ts">
import { getTests } from "@/entities/tests";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "@/entities/user";
import { useSnackbar } from "@/shared/snackbar";

import tCard from "@/shared/ui/layouts/t-card";
import tGrid from "@/shared/ui/layouts/t-grid";
import tTest from "@/shared/ui/icons/t-test.vue";
import tPreloader from "@/shared/ui/prelaoder";

const { user } = useUser();
const router = useRouter();
const isLoading = ref(false);
const tests = ref<Test[]>([]);
const snackbar = useSnackbar();

const uploadTests = async () => {
  isLoading.value = true;

  try {
    const { data } = await getTests();

    tests.value = data;
  } catch {
  } finally {
    isLoading.value = false;
  }
};

const onTest = (test: Test) => {
  if (test.completed) {
    snackbar.show({
      type: "danger",
      message: "Тест уже пройден",
      timeout: 2000
    });

    return;
  }

  router.push({
    name: "test",
    params: {
      testId: test.id
    }
  });
};

onMounted(async () => {
  uploadTests();
});

interface Test {
  id: number;
  name: string;
  completed: boolean;
}
</script>

<template>
  <main class="mt-16">
    <div>
      <h1>Тесты</h1>
    </div>
    <p>
      <span v-if="user && user.full_name">Привет, {{ user.full_name }}!</span>
      На данной странице ты можешь выбрать тест для прохождения. Пройденый тест
      нельзя пройти повторно.
    </p>

    <div v-if="isLoading" class="preloader">
      <t-preloader />
    </div>

    <div v-else-if="tests.length">
      <div v-if="tests.filter(test => !test.completed).length" class="mb-8">
        <h3 class="mb-2">Не пройденые</h3>

        <t-grid class="list">
          <t-card
            v-for="test in tests.filter(test => !test.completed)"
            :key="test.id"
            class="test"
            :class="{ completed: test.completed }"
            @click="onTest(test)"
          >
            <div class="title">
              <t-test />
              <h3>{{ test.name }}</h3>
            </div>
            <div class="status mt-2">
              Статус: {{ test.completed ? "Пройден" : "Не пройден" }}
            </div>
          </t-card>
        </t-grid>
      </div>

      <div v-if="tests.filter(test => test.completed).length" class="mb-16">
        <h3 class="mb-2">Пройденые</h3>

        <t-grid class="list">
          <t-card
            v-for="test in tests.filter(test => test.completed)"
            :key="test.id"
            class="test"
            :class="{ completed: test.completed }"
            @click="onTest(test)"
          >
            <div class="title">
              <t-test />
              <h3>{{ test.name }}</h3>
            </div>
            <div class="status mt-2">
              Статус: {{ test.completed ? "Пройден" : "Не пройден" }}
            </div>
          </t-card>
        </t-grid>
      </div>
    </div>

    <div v-else class="nothing">На данный момент тесты отсутствуют</div>
  </main>
</template>

<style lang="scss" scoped>
.test {
  padding: 20px;
  outline: 1px solid #ffffff00;
  cursor: pointer;
  user-select: none;
  &:hover {
    outline: 1px solid var(--t-primary);
  }

  .title {
    color: var(--t-tertiary);
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      min-width: 24px;
      color: var(--t-primary);
    }

    h3 {
      padding-bottom: 0;
    }
  }

  .status {
    color: var(--t-secondary);
  }
}

.completed {
  outline: 1px solid var(--t-success);
  svg {
    color: var(--t-success) !important;
  }

  &:hover {
    outline: 1px solid var(--t-success);
  }
}

.preloader {
  text-align: center;
}

.nothing {
  opacity: 0.5;
  color: var(--t-primary);
}
</style>
