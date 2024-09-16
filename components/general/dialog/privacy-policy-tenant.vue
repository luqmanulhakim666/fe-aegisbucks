<template>
  <v-dialog v-model="dialog" persistent width="800">
    <div class="white rounded-xl flex-column-center pa-10">
      <p class="h5--small dark--text text-center">PENGUMUMAN</p>
      <br />
      <p class="h5--small dark--text text-center">
        REKRUTMEN CALON TENANT KOPERASI
        <br>
        MITRA INKUBATOR WIRAUSAHA LPDB-KUMKM TAHUN 2024
      </p>
      <br />
      <p>
        Lembaga Pengelola Dana Bergulir Koperasi dan Usaha Mikro, Kecil, dan Menengah (LPDB-KUMKM)
        bekerjasama dengan lembaga Inkubator untuk melakukan pendampingan
        kepada Koperasi tahun 2024 dalam rangka peningkatan kapasitas terutama
        akses pendanaan yang akan dilaksanakan mulai Maret - September 2024.
        Oleh karena itu, kami membuka pendaftaran Koperasi untuk mengikuti program
        inkubasi tahun 2024 dengan kriteria:
      </p>
      <br />

      <ol type="1">
            <li>Aktif menjalankan kegiatan usaha 1 tahun terakhir;</li>
            <li>Memiliki legalitas dan perizinan usaha;</li>
            <li>Telah melaksanakan Rapat Anggota Tahunan (RAT) tahun buku 2022 dan/atau tahun buku 2023.</li>
      </ol>

      <div class="mt-2 text-justify">
        <!-- <p>
          Keputusan dan penentuan hasil seleksi sepenuhnya merupakan kewenangan
          Tim Rekrutmen Calon Lembaga Inkubator LPDB-KUMKM yang bersifat MUTLAK
          dan tidak dapat diganggu gugat.
        </p> -->
        <span class="ml-10">Pendaftaran</span> dilakukan dengan mengisi form
        pendaftaran yang terdapat dalam
        <a href=" https://inkubator.lpdb.id" target="_blank">
          https://inkubator.lpdb.id.</a
        >

        <b
          >Pendaftaran dibuka tanggal 5 Februari s.d 4 September 2024 pukul 23:59
          WIB.</b
        >
        Keputusan dan penentuan hasil seleksi sepenuhnya merupakan kewenangan
        Tim Rekrutmen Calon Tenant LPDB-KUMKM Tahun 2024 bersifat MUTLAK dan tidak
        dapat diganggu gugat. Untuk mengetahui informasi lebih lanjut, dapat menghubungi
        kami di nomor call center 1500856 atau dapat chat melalui aplikasi WhatsApp
        ke nomor +62811-8880-5300.
      </div>

      <v-btn
        large
        depressed
        class="secondary lighten-5 white--text h5--small text-capitalize mt-8"
        @click="onEmitAgree()"
        >Setuju</v-btn
      >
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    loading: Boolean
  },

  methods: {
    onEmitAgree() {
      this.$emit('on:agree')
    }
  }
}
</script>
