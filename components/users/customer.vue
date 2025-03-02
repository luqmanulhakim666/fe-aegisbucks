<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      :loading="isLoading"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4 mb-6"
    >
      <template v-slot:[`item.gender`]="{ item }">
        <div class="d-flex align-center pa-4">
          <p class="text-capitalize">{{ item.gender ? item.gender : "-" }}</p>
        </div>
      </template>

      <template v-slot:[`item.avatar`]="{ item }">
        <general-avatar size="38" :image="item.imageUrl" />
      </template>

      <template v-slot:[`item.age`]="{ item }">
        <p>{{ calculateAge(item.birthDate) }}</p>
      </template>

      <template v-slot:[`item.profession`]="{ item }">
        <p>{{ item.profession ? item.profession : "-" }}</p>
      </template>
      <template v-slot:[`item.phone`]="{ item }">
        <p>{{ item.phone ? item.phone : "-" }}</p>
      </template>

      <template v-slot:[`item.city`]="{ item }">
        <p>{{ cityName(item) }}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: Boolean,
    data: Array,
    preventDelete: Function,
  },

  data: () => ({
    headers: [
      {
        text: "Photo Profile",
        value: "avatar",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Nama",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Email",
        value: "email",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Gender",
        value: "gender",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Age",
        value: "age",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Profession",
        value: "profession",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "City",
        value: "city",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Phone",
        value: "phone",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
    ],
  }),

  computed: {
    cityName() {
      let name = (val) => {
        return val?.city?.name || "-";
      };

      return name;
    },
  },

  methods: {
    calculateAge(birthday) {
      if (!birthday) {
        return "-";
      }
      const birthDate = new Date(birthday);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Adjust age if the birthday hasn't occurred yet this year
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },

    emitUpdateStatus(val) {
      this.$emit("update:status", val);
    },
  },
};
</script>
