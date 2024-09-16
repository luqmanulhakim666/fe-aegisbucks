export default (ctx) => {
  let { $axios } = ctx;
  let url = "/file";
  return {
    async upload({ body, onUploadProgress }) {
      let formData = new window.FormData();
      formData.append("file", body.file);

      return await $axios.post(`${url}`, formData, {
        onUploadProgress,
      });
    },

    async getOne(id) {
      return await $axios.get(`${url}/${id}`);
    },

    async getFile(id) {
      let res = await $axios.get(`${url}/${id}/file`);
    },
  };
};
