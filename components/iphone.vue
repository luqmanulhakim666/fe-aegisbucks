<template>
  <div class="iphone-x">
    <i>Speaker</i>
    <b>Camera</b>
    <s class="fill-height">
      <v-card flat class="card-content fill-height">
        <iframe
          :src="campaignUrl"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </v-card>
    </s>
  </div>
</template>

<script>
export default {
  props: {
    brandSlug: String,
    campaignSlug: String,
    isPublished: Boolean,
  },

  computed: {
    campaignUrl() {
      return this.isPublished
        ? `/campaign/${this.brandSlug}/${this.campaignSlug}`
        : `/campaign/${this.brandSlug}/${this.campaignSlug}&__preview=true`;
    },
  },
};
</script>

<style lang="scss" scoped>
.iphone-x {
  position: relative;
  margin: 40px auto;
  max-width: 360px;
  height: 780px;
  background-color: #7371ee;
  background-image: linear-gradient(60deg, #7371ee 1%, #a1d9d6 100%);
  border-radius: 40px;
  box-shadow: 0px 0px 0px 11px #1f1f1f, 0px 0px 0px 13px #191919,
    0px 0px 0px 20px #111;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  // home button indicator
  &:after {
    bottom: 7px;
    width: 140px;
    height: 4px;
    background-color: #4a4a4a;
    border-radius: 10px;
  }

  // frontal camera/speaker frame
  &:before {
    z-index: 1;

    top: 0px;
    width: 56%;
    height: 30px;
    background-color: #1f1f1f;
    border-radius: 0px 0px 40px 40px;
  }

  i,
  b,
  s,
  span {
    position: absolute;
    display: block;
    color: transparent;
  }

  // speaker
  i {
    z-index: 1;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 6px);
    height: 8px;
    width: 15%;
    background-color: #101010;
    border-radius: 8px;
    box-shadow: inset 0px -3px 3px 0px rgba(256, 256, 256, 0.2);
  }

  // camera
  b {
    z-index: 1;

    left: 10%;
    top: 0px;
    transform: translate(180px, 4px);
    width: 12px;
    height: 12px;
    background-color: #101010;
    border-radius: 12px;
    box-shadow: inset 0px -3px 2px 0px rgba(256, 256, 256, 0.2);

    &:after {
      content: "";
      position: absolute;
      background-color: #2d4d76;
      width: 6px;
      height: 6px;
      top: 2px;
      left: 2px;
      top: 3px;
      left: 3px;
      display: block;
      border-radius: 4px;
      box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.5);
    }
  }

  // time
  s {
    color: #fff;
    text-align: center;
    text-decoration: none;
    width: 100%;
    font-size: 70px;
    border-radius: 40px;

    font-weight: 100;
  }

  .card-content {
    border-radius: 40px;
  }

  .i-frame {
  }

  // action buttons
}
</style>
