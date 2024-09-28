export const SUPER_ADMIN = [
  {
    name: "",
    menus: [{ text: "Home", icon: "mdi-home", path: "/admin/dashboard" }],
  },
  {
    name: "Master Data",
    menus: [
      { text: "Users", icon: "mdi-account-multiple", path: "/admin/users" },
      { text: "Brands", icon: "mdi-medal", path: "/admin/brands" },
      {
        text: "Products",
        icon: "mdi-package-variant",
        path: "/admin/products",
      },
      {
        text: "Retail Partners",
        icon: "mdi-handshake",
        path: "/admin/partners",
      },
    ],
  },
  {
    name: "Campaign",
    menus: [
      {
        text: "Campaign",
        icon: "mdi-bullhorn",
        path: "/admin/campaigns",
      },
      // {
      //   text: "Template",
      //   icon: "mdi-hammer-screwdriver",
      //   path: "/admin/templates",
      // },
    ],
  },
  {
    name: "Merchant",
    menus: [
      {
        text: "Merchant  List",
        icon: "mdi-store",
        path: "/admin/merchants",
      },
      {
        text: "Merchant Category",
        icon: "mdi-list-box",
        path: "/admin/merchant-categories",
      },
    ],
  },
];

// {
//   text: "Parameter",
//   icon: "mdi-layers",
//   sub_items: [
//     {
//       text: "Batch",
//       path: "//admin/assessment/batch",
//     },
//     {
//       text: "Aspek Penilaian",
//       path: "//admin/assessment/parameters",
//     },
//     {
//       text: "Interview Online",
//       path: "//admin/interview",
//     },
//   ],
// },
