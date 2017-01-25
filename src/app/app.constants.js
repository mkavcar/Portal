//app.constants.js
angular
  .module('dap.app')
  .constant("constants", {
      API_BASE_URL: "/appapi/",
      AUTHAPI_BASE_URL: "/authapi/",
      AUTH_DISABLED: false, //******** FOR LOCAL DEVELOPMENT ONLY ********
      LOG_SHIPPING_ENABLED: false,
      LOG_SHIP_INTERVAL: 10000,
      ACTIONS: {
        VIEW: 1,
        SHARE: 2,
        ADD: 3,
        UPDATE: 4,
        DELETE: 5,
        ADD_NOTE: 6,
        UPDATE_NOTE: 7,
        DELETE_NOTE: 8,
      },
      ASSET_PREFIX: {
        HOME: 999,
        VISUALS: 100,
        VISUALS_DASHBOARD: 101,
        VISUALS_AUDITLOG: 102,
        DOCUMENTS: 120,
        CCR: 140,
        CCR_REPORTS: 141,
        CCR_DASHBOARD: 142,
        DATAMART: 160,
        DATAFEEDS: 180,
        AWB: 200,
        ROI: 220,
        ROI_DASHBOARD: 221,
        ROI_QUERY: 222,
        ROI_UPLOAD: 223,
        LIVE_ATTRIBUTION: 240,
        LIVE_INTELLIGENCE: 260,
        REAL_TIME_OPTIMIZATION: 280,
        PORTAL_ADMIN: 300,
        PORTAL_ADMIN_USERS: 301,
        PORTAL_ADMIN_MENU: 302,
        PORTAL_ADMIN_FEEDBACK: 303,
        PORTAL_ADMIN_NOTIFICATIONS: 304,
        FEEDS_AMDIN: 320
      }     
  });


